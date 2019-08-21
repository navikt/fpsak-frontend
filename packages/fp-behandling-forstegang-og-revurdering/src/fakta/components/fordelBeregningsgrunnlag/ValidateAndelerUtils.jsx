import React from 'react';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import { aktivitetstatusTilAndeltypeMap } from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  required, formatCurrencyNoKr, removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/util/visningsnavnHelper';
import { mapToBelop, erAAPEllerArbeidsgiverOgSkalFlytteMellomAAPOgArbeidsgiver, GRADERING_RANGE_DENOMINATOR } from './BgFordelingUtils';
import TotalbelopPrArbeidsgiverError, { lagTotalInntektArbeidsforholdList } from './TotalbelopPrArbeidsgiverError';

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
    nyAndel, andel, inntektskategori, aktivitetStatus,
  } = value;
  if (nyAndel) {
    if (!Number.isNaN(Number(andel))) {
      const matchendeAndelFraListe = andelList.filter(andelValue => andelValue.andelsnr === parseFloat(andel));
      if (matchendeAndelFraListe.length > 0) {
        return { andelsinfo: matchendeAndelFraListe[0].andel, inntektskategori };
      }
    }
    if (beregningsgrunnlagAndeltyper[andel]) {
      return { andelsinfo: andel, inntektskategori };
    }
    return { andelsinfo: andel, inntektskategori };
  }
  if (aktivitetstatusTilAndeltypeMap[aktivitetStatus]) {
    return { andelsinfo: aktivitetstatusTilAndeltypeMap[aktivitetStatus], inntektskategori };
  }
  return { andelsinfo: andel, inntektskategori };
};

export const ulikeAndelerErrorMessage = () => ([{ id: 'BeregningInfoPanel.EndringBG.Validation.UlikeAndeler' }]);


const erAndelerLike = (andel1, andel2) => andel2.andelsinfo === andel1.andelsinfo && andel2.inntektskategori === andel1.inntektskategori;

export const validateUlikeAndelerWithGroupingFunction = (andelList, mapToSort) => {
  const mappedAndeler = andelList.map(value => (mapToSort(value, andelList)));
  const sortedAndeler = mappedAndeler.slice().sort((andel1, andel2) => compareAndeler(andel1, andel2));
  for (let i = 0; i < sortedAndeler.length - 1; i += 1) {
    if (erAndelerLike(sortedAndeler[i], sortedAndeler[i + 1])) {
      return ulikeAndelerErrorMessage();
    }
  }
  return null;
};


export const validateUlikeAndeler = andelList => validateUlikeAndelerWithGroupingFunction(andelList, mapAndelToSortedObject);


const finnArbeidsforholdRefusjonsinfoListe = (andelList) => {
  const andelerMedArbeidsforhold = andelList.filter(andel => andel.arbeidsforholdId !== '');
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
        arbeidsgiverNavn, arbeidsgiverId,
      } = andel;
      let totalRefusjon = 0;
      if (andel.refusjonskrav !== null && andel.refusjonskrav !== undefined) {
        totalRefusjon = Number(removeSpacesFromNumber(andel.refusjonskrav));
      }
      arbeidsforholdRefusjonsbelop.push({
        arbeidsforholdId,
        arbeidsgiverNavn,
        arbeidsgiverId,
        refusjonskravFraInntektsmelding,
        totalRefusjon,
      });
    }
  });
  return arbeidsforholdRefusjonsbelop;
};

export const skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding = arbeidsgiver => (
  [{ id: 'BeregningInfoPanel.EndringBG.Validation.IkkjeHogereRefusjonEnnInntektsmelding' },
    { arbeidsgiver }]);

export const validateTotalRefusjonPrArbeidsforhold = (andelList, getKodeverknavn) => {
  const arbeidsforholdRefusjonsinfo = finnArbeidsforholdRefusjonsinfoListe(andelList);
  const arbeidsforholdMedForHogRefusjon = arbeidsforholdRefusjonsinfo
    .filter(refusjonsInfo => refusjonsInfo.totalRefusjon > refusjonsInfo.refusjonskravFraInntektsmelding);
  if (arbeidsforholdMedForHogRefusjon.length > 0) {
    const arbeidsgiverString = createVisningsnavnForAktivitet(arbeidsforholdMedForHogRefusjon[0], getKodeverknavn);
    return skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverString);
  }
  return null;
};

const skalIkkjeVereHogareEnn = (
    value, registerInntekt, errorMessage,
) => ((value > Math.round(registerInntekt)) ? errorMessage() : undefined);

export const skalVereLikFordelingMessage = fordeling => (
  [{ id: 'BeregningInfoPanel.EndringBG.Validation.LikFordeling' },
    { fordeling }]);

export const kanIkkjeHaNullBeregningsgrunnlagError = () => (
  [{ id: 'FordelBeregningsgrunnlag.Validation.KanIkkeHaNullIBeregningsgrunnlag' }]);

export const tomErrorMessage = () => (
  [{ id: ' ' }]);


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

const validateFordelingForGradertAndel = (andel) => {
  if (!andel.andelIArbeid) {
    return null;
  }
  if (!Number.isNaN(Number(andel.andelIArbeid))) {
    const arbeidsprosent = Number(andel.andelIArbeid);
    if (arbeidsprosent > 0 && Number(andel.fastsattBelop) === 0) {
      return kanIkkjeHaNullBeregningsgrunnlagError();
    }
  }
  const arbeidsprosenter = andel.andelIArbeid.split(GRADERING_RANGE_DENOMINATOR);
  const arbeidsprosenterOverNull = arbeidsprosenter.filter(val => val > 0);
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
  getKodeverknavn) => {
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
    fastsattBelopError = validateFordelingForGradertAndel(andelFieldValues);
  }
  return fastsattBelopError;
};

export const hasFieldErrors = fieldErrors => (fieldErrors.refusjonskrav || fieldErrors.andel
  || fieldErrors.fastsattBelop || fieldErrors.inntektskategori);


export const validateAndelFields = (andelFieldValues, totalInntektArbeidsforholdList, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn) => {
  const {
    refusjonskrav, skalKunneEndreRefusjon,
    andel, inntektskategori,
  } = andelFieldValues;
  const fieldErrors = {};
  fieldErrors.refusjonskrav = validateRefusjonsbelop(refusjonskrav, skalKunneEndreRefusjon);
  fieldErrors.fastsattBelop = validateFastsattBelop(andelFieldValues, totalInntektArbeidsforholdList, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
  fieldErrors.andel = required(andel);
  fieldErrors.inntektskategori = required(inntektskategori);
  return hasFieldErrors(fieldErrors) ? fieldErrors : null;
};


export const validateAndeler = (values, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn) => {
  const skalValidereMellomAAPOgArbeidsgiver = andel => erAAPEllerArbeidsgiverOgSkalFlytteMellomAAPOgArbeidsgiver(andel, values);
  const totalInntektPrArbeidsforhold = lagTotalInntektArbeidsforholdList(values, skalValidereMotBeregningsgrunnlagPrAar,
    skalValidereMellomAAPOgArbeidsgiver, getKodeverknavn);
  const arrayErrors = values.map((andelFieldValues) => {
    if (!andelFieldValues.harPeriodeAarsakGraderingEllerRefusjon) {
        return null;
    }
    return validateAndelFields(andelFieldValues, totalInntektPrArbeidsforhold, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
  });
  if (arrayErrors.some(errors => errors !== null)) {
    if (arrayErrors.some(errors => errors && errors.fastsattBelop && errors.fastsattBelop[0].id === tomErrorMessage()[0].id)) {
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
