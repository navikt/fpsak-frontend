import beregningsgrunnlagAndeltyper from 'kodeverk/beregningsgrunnlagAndeltyper';
import { aktivitetstatusTilAndeltypeMap } from 'kodeverk/aktivitetStatus';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import { required } from 'utils/validation/validators';
import { formatCurrencyNoKr, removeSpacesFromNumber } from 'utils/currencyUtils';


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

export const validateUlikeAndelerWithMap = (andelList, mapToSort) => {
  const mappedAndeler = andelList.map(value => (mapToSort(value, andelList)));
  const sortedAndeler = mappedAndeler.slice().sort((andel1, andel2) => compareAndeler(andel1, andel2));
  for (let i = 0; i < sortedAndeler.length - 1; i += 1) {
    if (erAndelerLike(sortedAndeler[i], sortedAndeler[i + 1])) {
      return ulikeAndelerErrorMessage();
    }
  }
  return null;
};


export const validateUlikeAndeler = andelList => validateUlikeAndelerWithMap(andelList, mapAndelToSortedObject);


const finnArbeidsforholdRefusjonsinfoListe = (andelList) => {
  const andelerMedArbeidsforhold = andelList.filter(andel => andel.arbeidsforholdId !== '');
  const arbeidsforholdRefusjonsbelop = [];
  andelerMedArbeidsforhold.forEach((andel) => {
    const infoIndex = arbeidsforholdRefusjonsbelop
      .findIndex(({ arbeidsforholdId }) => arbeidsforholdId === andel.arbeidsforholdId);
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

export const validateTotalRefusjonPrArbeidsforhold = (andelList) => {
  const arbeidsforholdRefusjonsinfo = finnArbeidsforholdRefusjonsinfoListe(andelList);
  const arbeidsforholdMedForHogRefusjon = arbeidsforholdRefusjonsinfo
    .filter(refusjonsInfo => refusjonsInfo.totalRefusjon > refusjonsInfo.refusjonskravFraInntektsmelding);
  if (arbeidsforholdMedForHogRefusjon.length > 0) {
    const arbeidsgiverString = createVisningsnavnForAktivitet(arbeidsforholdMedForHogRefusjon[0]);
    return skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverString);
  }
  return null;
};

export const skalIkkjeVereHogareEnnInntektmeldingMessage = () => ([{ id: 'BeregningInfoPanel.EndringBG.Validation.IkkeHøyereEnnInntektsmelding' }]);

const skalIkkjeVereHogareEnnInntektmelding = (
  value, belopFraInntektsmelding,
) => ((value > belopFraInntektsmelding) ? skalIkkjeVereHogareEnnInntektmeldingMessage() : undefined);

export const skalVereLikFordelingMessage = fordeling => (
  [{ id: 'BeregningInfoPanel.EndringBG.Validation.LikFordeling' },
    { fordeling }]);

export const likFordeling = (
  value, fordeling,
) => ((value !== fordeling) ? skalVereLikFordelingMessage(formatCurrencyNoKr(fordeling)) : null);

export const validateRefusjonsbelop = (refusjonskrav, skalKunneEndreRefusjon) => {
  let refusjonskravError;
  if (skalKunneEndreRefusjon) {
    refusjonskravError = required(refusjonskrav);
  }
  return refusjonskravError;
};

export const validateFastsattBelop = (fastsattBelop, belopFraInntektsmelding) => {
  let error = required(fastsattBelop);
  if (belopFraInntektsmelding !== null && belopFraInntektsmelding !== undefined) {
    error = error || skalIkkjeVereHogareEnnInntektmelding(Number(removeSpacesFromNumber(fastsattBelop)), belopFraInntektsmelding);
  }
  return error;
};

export const hasFieldErrors = fieldErrors => (fieldErrors.refusjonskrav || fieldErrors.andel
  || fieldErrors.fastsattBeløp || fieldErrors.inntektskategori);


export const validateAndelFields = (andelFieldValues) => {
  const {
    refusjonskrav, fastsattBeløp, belopFraInntektsmelding, skalKunneEndreRefusjon,
    andel, inntektskategori,
  } = andelFieldValues;
  const fieldErrors = {};
  fieldErrors.refusjonskrav = validateRefusjonsbelop(
    refusjonskrav, skalKunneEndreRefusjon,
  );
  fieldErrors.fastsattBeløp = validateFastsattBelop(fastsattBeløp, belopFraInntektsmelding);
  fieldErrors.andel = required(andel);
  fieldErrors.inntektskategori = required(inntektskategori);
  return hasFieldErrors(fieldErrors) ? fieldErrors : null;
};


export const validateSumFastsattBelop = (values, fordeling) => {
  const sumFastsattBelop = values.map(({ fastsattBeløp }) => (fastsattBeløp ? removeSpacesFromNumber(fastsattBeløp) : 0))
    .reduce((sum, fastsattBeløp) => sum + fastsattBeløp, 0);
  return fordeling !== 0 ? likFordeling(sumFastsattBelop, fordeling) : null;
};
