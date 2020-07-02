import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

export const mottarYtelseFieldPrefix = 'mottarYtelseField';
export const frilansSuffix = '_frilans';
export const utledArbeidsforholdFieldName = (andel) => mottarYtelseFieldPrefix + andel.andelsnr;
export const finnFrilansFieldName = () => (mottarYtelseFieldPrefix + frilansSuffix);

export const skalFastsetteInntektATUtenInntektsmelding = (values, vurderMottarYtelse) => {
  const atAndelerUtenIM = vurderMottarYtelse && vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  return atAndelerUtenIM.map((andel) => values[utledArbeidsforholdFieldName(andel)])
    .find((mottarYtelse) => mottarYtelse) !== undefined;
};

export const frilansMottarYtelse = (values) => (values[finnFrilansFieldName()]);

export const andelsnrMottarYtelseMap = (values, vurderMottarYtelse, beregningsgrunnlag) => {
  if (!vurderMottarYtelse) {
    return {};
  }
  const mottarYtelseMap = {};
  const atAndelerUtenIM = vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  atAndelerUtenIM.forEach((andel) => {
    const mottarYtelse = values[utledArbeidsforholdFieldName(andel)];
    mottarYtelseMap[andel.andelsnr] = mottarYtelse;
  });
  if (!beregningsgrunnlag) {
    return mottarYtelseMap;
  }
  const frilansAndel = beregningsgrunnlag.beregningsgrunnlagPeriode[0]
    .beregningsgrunnlagPrStatusOgAndel
    .find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
  if (frilansAndel) {
    mottarYtelseMap[frilansAndel.andelsnr] = frilansMottarYtelse(values);
  }
  return mottarYtelseMap;
};

export const harVurdertMottarYtelse = (values, vurderMottarYtelse) => {
  if (vurderMottarYtelse.erFrilans) {
    const flMottarYtelse = frilansMottarYtelse(values);
    if (flMottarYtelse === undefined || flMottarYtelse === null) {
      return false;
    }
  }
  const atAndelerUtenIM = vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  if (atAndelerUtenIM.length > 0) {
    const harAndelSomIkkeErVurdert = atAndelerUtenIM.map((andel) => values[utledArbeidsforholdFieldName(andel)])
      .some((mottarYtelse) => mottarYtelse === undefined || mottarYtelse === null);
    if (harAndelSomIkkeErVurdert) {
      return false;
    }
  }
  return true;
};
