import beregningsgrunnlagAndeltyper from 'kodeverk/beregningsgrunnlagAndeltyper';
import { aktivitetstatusTilAndeltypeMap } from 'kodeverk/aktivitetStatus';
import { required } from 'utils/validation/validators';
import { formatCurrencyNoKr, removeSpacesFromNumber } from 'utils/currencyUtils';


const compareAndeler = (andel1, andel2) => {
  if (andel1.andelsinfo === andel2.andelsinfo) {
    return andel1.inntektskategori > andel2.inntektskategori;
  }
  return andel1.andelsinfo > andel2.andelsinfo;
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


export const validateUlikeAndeler = (andelList) => {
  const mappedAndeler = andelList.map(value => (mapAndelToSortedObject(value, andelList)));
  const sortedAndeler = mappedAndeler.slice().sort((andel1, andel2) => compareAndeler(andel1, andel2));
  for (let i = 0; i < sortedAndeler.length - 1; i += 1) {
    if (erAndelerLike(sortedAndeler[i], sortedAndeler[i + 1])) {
      return ulikeAndelerErrorMessage();
    }
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

export const validateRefusjonsbelop = (refusjonskrav, skalKunneEndreRefusjon, belopFraInntektsmelding) => {
  let refusjonskravError;
  if (skalKunneEndreRefusjon) {
    refusjonskravError = required(refusjonskrav);
    refusjonskravError = refusjonskravError
      || skalIkkjeVereHogareEnnInntektmelding(refusjonskrav !== '' ? Number(removeSpacesFromNumber(refusjonskrav)) : 0,
        belopFraInntektsmelding !== null ? belopFraInntektsmelding : 0);
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
    andel, inntektskategori, refusjonskravFraInntektsmelding,
  } = andelFieldValues;
  const fieldErrors = {};
  fieldErrors.refusjonskrav = validateRefusjonsbelop(
    refusjonskrav, skalKunneEndreRefusjon,
    refusjonskravFraInntektsmelding,
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
