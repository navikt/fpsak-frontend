import React from 'react';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import AktivitetStatus, { aktivitetstatusTilAndeltypeMap } from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  dateIsAfter, formatCurrencyNoKr, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';
import { erAAPEllerArbeidsgiverOgSkalFlytteMellomAAPOgArbeidsgiver, GRADERING_RANGE_DENOMINATOR, mapToBelop } from './BgFordelingUtils';
import TotalbelopPrArbeidsgiverError, { lagTotalInntektArbeidsforholdList } from './TotalbelopPrArbeidsgiverError';
import { createVisningsnavnForAktivitet } from './util/visningsnavnHelper';

const convertToNumber = (n) => (n == null || undefined ? null : Number(removeSpacesFromNumber(n)));

export const compareAndeler = (andel1, andel2) => {
  if (andel1.andelsinfo === andel2.andelsinfo) {
    if (andel1.inntektskategori === andel2.inntektskategori) {
      return 0;
    }
    return andel1.inntektskategori > andel2.inntektskategori ? 1 : -1;
  }
  return andel1.andelsinfo > andel2.andelsinfo ? 1 : -1;
};

const mapAndelToSortedObject = (value, andelList) => {
  const {
    nyAndel, andel, inntektskategori, aktivitetStatus, arbeidsforholdId,
  } = value;
  if (nyAndel) {
    if (!Number.isNaN(Number(andel))) {
      const matchendeAndelFraListe = andelList.filter((andelValue) => andelValue.andelsnr === parseFloat(andel));
      if (matchendeAndelFraListe.length > 0) {
        return { andelsinfo: matchendeAndelFraListe[0].andel + arbeidsforholdId, inntektskategori };
      }
    }
    if (beregningsgrunnlagAndeltyper[andel]) {
      return { andelsinfo: andel, inntektskategori };
    }
    return { andelsinfo: andel + arbeidsforholdId, inntektskategori };
  }
  if (aktivitetstatusTilAndeltypeMap[aktivitetStatus]) {
    return { andelsinfo: aktivitetstatusTilAndeltypeMap[aktivitetStatus], inntektskategori };
  }
  return { andelsinfo: andel + arbeidsforholdId, inntektskategori };
};

export const ulikeAndelerErrorMessage = () => ([{ id: 'BeregningInfoPanel.FordelBG.Validation.UlikeAndeler' }]);


const erAndelerLike = (andel1, andel2) => andel2.andelsinfo === andel1.andelsinfo && andel2.inntektskategori === andel1.inntektskategori;

export const validateUlikeAndelerWithGroupingFunction = (andelList, mapToSort) => {
  const mappedAndeler = andelList.map((value) => (mapToSort(value, andelList)));
  const sortedAndeler = mappedAndeler.slice().sort((andel1, andel2) => compareAndeler(andel1, andel2));
  for (let i = 0; i < sortedAndeler.length - 1; i += 1) {
    if (erAndelerLike(sortedAndeler[i], sortedAndeler[i + 1])) {
      return ulikeAndelerErrorMessage();
    }
  }
  return null;
};


export const validateUlikeAndeler = (andelList) => validateUlikeAndelerWithGroupingFunction(andelList, mapAndelToSortedObject);


const finnArbeidsforholdRefusjonsinfoListe = (andelList) => {
  const andelerMedArbeidsforhold = andelList.filter((andel) => andel.arbeidsforholdId !== '');
  const arbeidsforholdRefusjonsbelop = [];
  andelerMedArbeidsforhold.forEach((andel) => {
    const infoIndex = arbeidsforholdRefusjonsbelop
      .findIndex(({ arbeidsforholdId, arbeidsgiverId }) => arbeidsforholdId === andel.arbeidsforholdId && arbeidsgiverId === andel.arbeidsgiverId);
    if (infoIndex >= 0) {
      const belopsInfo = arbeidsforholdRefusjonsbelop[infoIndex];
      if (belopsInfo.refusjonskravFraInntektsmelding < andel.refusjonskravFraInntektsmelding) {
        arbeidsforholdRefusjonsbelop[infoIndex].refusjonskravFraInntektsmelding = andel.refusjonskravFraInntektsmelding;
      }
      if (andel.refusjonskrav !== null && andel.refusjonskrav !== undefined) {
        arbeidsforholdRefusjonsbelop[infoIndex].totalRefusjon = belopsInfo.totalRefusjon + Number(removeSpacesFromNumber(andel.refusjonskrav));
      }
    } else {
      const {
        refusjonskravFraInntektsmelding, arbeidsforholdId,
        arbeidsgiverNavn, arbeidsgiverId, eksternArbeidsforholdId,
      } = andel;
      let totalRefusjon = 0;
      if (andel.refusjonskrav !== null && andel.refusjonskrav !== undefined) {
        totalRefusjon = Number(removeSpacesFromNumber(andel.refusjonskrav));
      }
      arbeidsforholdRefusjonsbelop.push({
        arbeidsforholdId,
        eksternArbeidsforholdId,
        arbeidsgiverNavn,
        arbeidsgiverId,
        refusjonskravFraInntektsmelding,
        totalRefusjon,
      });
    }
  });
  return arbeidsforholdRefusjonsbelop;
};

export const skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding = (arbeidsgiver) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.IkkjeHogereRefusjonEnnInntektsmelding' },
    { arbeidsgiver }]);

export const validateTotalRefusjonPrArbeidsforhold = (andelList, getKodeverknavn) => {
  const arbeidsforholdRefusjonsinfo = finnArbeidsforholdRefusjonsinfoListe(andelList);
  const arbeidsforholdMedForHogRefusjon = arbeidsforholdRefusjonsinfo
    .filter((refusjonsInfo) => refusjonsInfo.totalRefusjon > refusjonsInfo.refusjonskravFraInntektsmelding);
  if (arbeidsforholdMedForHogRefusjon.length > 0) {
    const arbeidsgiverString = createVisningsnavnForAktivitet(arbeidsforholdMedForHogRefusjon[0], getKodeverknavn);
    return skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverString);
  }
  return null;
};

const skalIkkjeVereHogareEnn = (
  value, registerInntekt, errorMessage,
) => ((value > Math.round(registerInntekt)) ? errorMessage() : undefined);


export const skalVereLikFordelingMessage = (fordeling) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.LikFordeling' },
    { fordeling }]);

export const kanIkkjeHaNullBeregningsgrunnlagError = () => (
  [{ id: 'FordelBeregningsgrunnlag.Validation.KanIkkeHaNullIBeregningsgrunnlag' }]);

export const tomErrorMessage = () => (
  [{ id: ' ' }]);


export const totalRefusjonMåVereLavereEnn = (seksG) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.TotalRefusjonSkalIkkeOverstige' }, { seksG }]);

const totalRefusjonSkalVereLavereEnn = (
  value, seksG,
) => ((value >= Math.round(seksG)) ? totalRefusjonMåVereLavereEnn(formatCurrencyNoKr(seksG)) : undefined);


export const totalFordelingForArbeidstakerMåVereLavereEnn = (seksG) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.TotalFordelingForArbeidstakerLavereEnn' }, { seksG }]);

export const totalFordelingForArbeidstakerOgFrilanserMåVereLavereEnn = (seksG) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.TotalFordelingForArbeidstakerOgFrilanserLavereEnn' }, { seksG }]);

export const totalFordelingForFrilanserMåVereLavereEnn = (seksG) => (
  [{ id: 'BeregningInfoPanel.FordelBG.Validation.TotalFordelingForFrilanserLavereEnn' }, { seksG }]);


const totalFordelingSkalVereLavereEnn = (
  value, seksG, errorMessage,
) => ((value >= Math.round(seksG)) ? errorMessage(formatCurrencyNoKr(seksG)) : undefined);


export const likFordeling = (
  value, fordeling,
) => ((value !== Math.round(fordeling)) ? skalVereLikFordelingMessage(formatCurrencyNoKr(Math.round(fordeling))) : null);

export const validateRefusjonsbelop = (refusjonskrav, skalKunneEndreRefusjon) => {
  let refusjonskravError;
  if (skalKunneEndreRefusjon) {
    refusjonskravError = required(refusjonskrav);
  }
  return refusjonskravError;
};

const validateFordelingForGradertAndel = (andel, periodeDato) => {
  const arbeidsforholdIkkeOpphørt = !andel.arbeidsperiodeTom || dateIsAfter(andel.arbeidsperiodeTom, periodeDato.fom);
  if (!andel.andelIArbeid || !arbeidsforholdIkkeOpphørt) {
    return null;
  }
  if (!Number.isNaN(Number(andel.andelIArbeid))) {
    const arbeidsprosent = Number(andel.andelIArbeid);
    if (arbeidsprosent > 0 && Number(andel.fastsattBelop) === 0) {
      return kanIkkjeHaNullBeregningsgrunnlagError();
    }
  }
  const arbeidsprosenter = andel.andelIArbeid.split(GRADERING_RANGE_DENOMINATOR);
  const arbeidsprosenterOverNull = arbeidsprosenter.filter((val) => val > 0);
  if (arbeidsprosenterOverNull.length > 0 && Number(andel.fastsattBelop) === 0) {
    return kanIkkjeHaNullBeregningsgrunnlagError();
  }
  return null;
};

export const validateFastsattBelopEqualOrBelowBeregningsgrunnlagPrAar = (fastsattBelop, beregningsgrunnlagPrAar) => {
  if (beregningsgrunnlagPrAar !== null && beregningsgrunnlagPrAar !== undefined) {
    return skalIkkjeVereHogareEnn(Number(fastsattBelop),
      beregningsgrunnlagPrAar, tomErrorMessage);
  }
  return null;
};

export const validateFastsattBelopEqualOrBelowRefusjon = (fastsattBelop, refusjon) => {
  if (refusjon !== null && refusjon !== undefined) {
    return skalIkkjeVereHogareEnn(Number(fastsattBelop),
      refusjon, tomErrorMessage);
  }
  return null;
};

export const validateAgainstBeregningsgrunnlag = (andelFieldValues, totalInntektArbeidsforholdList,
  skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn) => {
  const arbeidsforholdBelopValues = totalInntektArbeidsforholdList
    .find(({ key }) => key === createVisningsnavnForAktivitet(andelFieldValues, getKodeverknavn));
  if (arbeidsforholdBelopValues) {
    const arbeidsforholdTotalFastsatt = arbeidsforholdBelopValues.fastsattBelop;
    if (skalValidereMotBeregningsgrunnlagPrAar(andelFieldValues)) {
      return validateFastsattBelopEqualOrBelowBeregningsgrunnlagPrAar(arbeidsforholdTotalFastsatt, arbeidsforholdBelopValues.beregningsgrunnlagPrAar);
    }
  }
  return null;
};

export const validateFastsattBelop = (andelFieldValues, totalInntektArbeidsforholdList, skalValidereMotBeregningsgrunnlagPrAar,
  getKodeverknavn, periodeDato) => {
  let fastsattBelopError = required(andelFieldValues.fastsattBelop);
  if (!fastsattBelopError) {
    fastsattBelopError = validateAgainstBeregningsgrunnlag(
      andelFieldValues,
      totalInntektArbeidsforholdList,
      skalValidereMotBeregningsgrunnlagPrAar,
      getKodeverknavn,
    );
  }
  if (!fastsattBelopError) {
    fastsattBelopError = validateFordelingForGradertAndel(andelFieldValues, periodeDato);
  }
  return fastsattBelopError;
};

export const hasFieldErrors = (fieldErrors) => (fieldErrors.refusjonskrav || fieldErrors.andel
  || fieldErrors.fastsattBelop || fieldErrors.inntektskategori);


export const validateAndelFields = (andelFieldValues, totalInntektArbeidsforholdList, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn, periodeDato) => {
  const {
    refusjonskrav, skalKunneEndreRefusjon,
    andel, inntektskategori,
  } = andelFieldValues;
  const fieldErrors = {};
  fieldErrors.refusjonskrav = validateRefusjonsbelop(refusjonskrav, skalKunneEndreRefusjon);
  fieldErrors.fastsattBelop = validateFastsattBelop(andelFieldValues, totalInntektArbeidsforholdList, skalValidereMotBeregningsgrunnlagPrAar,
    getKodeverknavn, periodeDato);
  fieldErrors.andel = required(andel);
  fieldErrors.inntektskategori = required(inntektskategori);
  return hasFieldErrors(fieldErrors) ? fieldErrors : null;
};


export const validateAndeler = (values, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn, periodeDato) => {
  if (!values) {
    return null;
  }
  const skalValidereMellomAAPOgArbeidsgiver = (andel) => erAAPEllerArbeidsgiverOgSkalFlytteMellomAAPOgArbeidsgiver(andel, values);
  const totalInntektPrArbeidsforhold = lagTotalInntektArbeidsforholdList(values, skalValidereMotBeregningsgrunnlagPrAar,
    skalValidereMellomAAPOgArbeidsgiver, getKodeverknavn);
  const arrayErrors = values.map((andelFieldValues) => {
    if (!andelFieldValues.harPeriodeAarsakGraderingEllerRefusjon) {
      return null;
    }
    return validateAndelFields(andelFieldValues, totalInntektPrArbeidsforhold, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn, periodeDato);
  });
  if (arrayErrors.some((errors) => errors !== null)) {
    if (arrayErrors.some((errors) => errors && errors.fastsattBelop && errors.fastsattBelop[0].id === tomErrorMessage()[0].id)) {
      return {
        ...arrayErrors,
        _error: <TotalbelopPrArbeidsgiverError totalInntektPrArbeidsforhold={totalInntektPrArbeidsforhold} />,
      };
    }
    return arrayErrors;
  }
  return null;
};

export const validateSumFastsattBelop = (values, fordeling) => {
  const sumFastsattBelop = values.map(mapToBelop)
    .reduce((sum, fastsattBelop) => sum + fastsattBelop, 0);
  return fordeling !== undefined && fordeling !== null ? likFordeling(sumFastsattBelop, fordeling) : null;
};

export const validateSumRefusjon = (values, grunnbeløp) => {
  const harGraderingUtenRefusjon = !!values.find((v) => v.andelIArbeid !== '0.00' && convertToNumber(v.refusjonskrav) === 0);
  const sumRefusjon = values.map(({ refusjonskrav }) => convertToNumber(refusjonskrav))
    .reduce((sum, refusjonskrav) => sum + refusjonskrav, 0);
  const seksG = 6 * grunnbeløp;
  return harGraderingUtenRefusjon ? totalRefusjonSkalVereLavereEnn(sumRefusjon, seksG) : null;
};

export const validateSumFastsattArbeidstaker = (values, seksG) => {
  const sumFastsattBelop = values.filter((v) => v.aktivitetStatus === AktivitetStatus.ARBEIDSTAKER).map(mapToBelop)
    .reduce((sum, fastsattBelop) => sum + fastsattBelop, 0);
  return totalFordelingSkalVereLavereEnn(sumFastsattBelop, seksG, totalFordelingForArbeidstakerMåVereLavereEnn);
};

const finnRiktigErrorMessage = (values) => {
  const harFrilans = !!values.find((v) => v.aktivitetStatus === AktivitetStatus.FRILANSER);
  const harArbeidstaker = !!values.find((v) => v.aktivitetStatus === AktivitetStatus.ARBEIDSTAKER);
  if (harArbeidstaker && harFrilans) {
    return totalFordelingForArbeidstakerOgFrilanserMåVereLavereEnn;
  } if (harArbeidstaker && !harFrilans) {
    return totalFordelingForArbeidstakerMåVereLavereEnn;
  } if (harFrilans && !harArbeidstaker) {
    return totalFordelingForFrilanserMåVereLavereEnn;
  }
  return totalFordelingForArbeidstakerOgFrilanserMåVereLavereEnn;
};

export const validateSumFastsattArbeidstakerOgFrilanser = (values, seksG) => {
  const sumFastsattBelop = values.filter((v) => v.aktivitetStatus === AktivitetStatus.ARBEIDSTAKER || v.aktivitetStatus === AktivitetStatus.FRILANSER)
    .map(mapToBelop)
    .reduce((sum, fastsattBelop) => sum + fastsattBelop, 0);
  const errorMessageFunc = finnRiktigErrorMessage(values);
  return totalFordelingSkalVereLavereEnn(sumFastsattBelop, seksG, errorMessageFunc);
};

export const validateSumFastsattForUgraderteAktiviteter = (values, grunnbeløp) => {
  const skalGradereFL = !!values.find((v) => v.andelIArbeid !== '0.00' && v.aktivitetStatus === AktivitetStatus.FRILANSER);
  const seksG = 6 * grunnbeløp;
  if (skalGradereFL) {
    return validateSumFastsattArbeidstaker(values, seksG);
  }
  const skalGradereSN = !!values.find((v) => v.andelIArbeid !== '0.00' && v.aktivitetStatus === AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  if (skalGradereSN) {
    return validateSumFastsattArbeidstakerOgFrilanser(values, seksG);
  }
  return null;
};
