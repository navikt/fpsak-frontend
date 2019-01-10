import { getBehandlingFormValues } from 'behandlingFpsak/behandlingForm';
import { getFaktaOmBeregning } from 'behandlingFpsak/behandlingSelectors';


export const mottarYtelseFieldPrefix = 'mottarYtelseField';
export const frilansSuffix = '_frilans';
export const utledArbeidsforholdFieldName = andel => mottarYtelseFieldPrefix + andel.andelsnr;
export const finnFrilansFieldName = () => (mottarYtelseFieldPrefix + frilansSuffix);


export const andelsnrMottarYtelseMap = (values, vurderMottarYtelse) => {
  if (!vurderMottarYtelse) {
    return {};
  }
  const mottarYtelseMap = {};
  const ATAndelerUtenIM = vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  ATAndelerUtenIM.forEach((andel) => {
    const mottarYtelse = values[utledArbeidsforholdFieldName(andel)];
    mottarYtelseMap[andel.andelsnr] = mottarYtelse;
  });
  return mottarYtelseMap;
};

export const skalFastsetteInntektATUtenInntektsmelding = (values, vurderMottarYtelse) => {
  const ATAndelerUtenIM = vurderMottarYtelse && vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  return ATAndelerUtenIM.map(andel => values[utledArbeidsforholdFieldName(andel)])
    .find(mottarYtelse => mottarYtelse) !== undefined;
};

export const mapStateToSkalFastsetteAT = (state, formName) => {
  const values = getBehandlingFormValues(formName)(state);
  const faktaOmBeregning = getFaktaOmBeregning(state);
  return faktaOmBeregning ? skalFastsetteInntektATUtenInntektsmelding(values, faktaOmBeregning.vurderMottarYtelse) : false;
};

export const frilansMottarYtelse = values => (values[finnFrilansFieldName()]);

export const mapStateToSkalFastsetteFL = (state, formName) => {
  const values = getBehandlingFormValues(formName)(state);
  return frilansMottarYtelse(values);
};
