import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

const arbeidsforholdEksistererIListen = (arbeidsforhold, arbeidsgiverList) => {
  if (arbeidsforhold.arbeidsforholdId === null) {
    return arbeidsgiverList.map(({ arbeidsgiverId }) => (arbeidsgiverId)).includes(arbeidsforhold.arbeidsgiverId);
  }
  return arbeidsgiverList.map(({ arbeidsforholdId }) => (arbeidsforholdId)).includes(arbeidsforhold.arbeidsforholdId);
};

const finnBgAndelMedSammeArbeidsforhold = (bgAndeler, andel) => bgAndeler.find(({ arbeidsforhold }) => !!arbeidsforhold
&& arbeidsforhold.arbeidsgiverId === andel.arbeidsforhold.arbeidsgiverId
&& arbeidsforhold.arbeidsforholdId === andel.arbeidsforhold.arbeidsforholdId);

export const getUniqueListOfArbeidsforholdFromAndeler = (andeler, bgAndeler) => {
  const arbeidsgiverList = [];
  if (andeler === undefined) {
    return arbeidsgiverList;
  }
  andeler.forEach((andel) => {
    if (andel.arbeidsforhold !== null && !arbeidsforholdEksistererIListen(andel.arbeidsforhold, arbeidsgiverList)) {
      const bgAndel = finnBgAndelMedSammeArbeidsforhold(bgAndeler, andel);
      const arbeidsforholdObject = {
        andelsnr: andel.andelsnr,
        nyttArbeidsforhold: andel.nyttArbeidsforhold,
        beregningsperiodeTom: bgAndel.beregningsperiodeTom,
        beregningsperiodeFom: bgAndel.beregningsperiodeFom,
        ...andel.arbeidsforhold,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  });
  return arbeidsgiverList;
};

const emptyList = [];

const finnAndelerFraFordelingperioder = (fordelPerioder) => (fordelPerioder.length > 0
  ? fordelPerioder.flatMap((p) => p.fordelBeregningsgrunnlagAndeler) : emptyList);

const finnAndelerFraBgperioder = (bgPerioder) => (bgPerioder.length > 0
  ? bgPerioder.flatMap((p) => p.beregningsgrunnlagPrStatusOgAndel) : emptyList);

const getUniqueListOfArbeidsforholdFromPerioder = (fordelPerioder, bgPerioder) => getUniqueListOfArbeidsforholdFromAndeler(
  finnAndelerFraFordelingperioder(fordelPerioder),
  finnAndelerFraBgperioder(bgPerioder),
);

export const getUniqueListOfArbeidsforhold = createSelector(
  [(props) => props.beregningsgrunnlag],
  (beregningsgrunnlag) => {
    const fordelBGPerioder = beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder;
    const bgPerioder = beregningsgrunnlag.beregningsgrunnlagPeriode;
    return getUniqueListOfArbeidsforholdFromPerioder(fordelBGPerioder, bgPerioder);
  },
);

export const getUniqueListOfArbeidsforholdFields = (fields) => {
  const arbeidsgiverList = [];
  if (fields === undefined) {
    return arbeidsgiverList;
  }
  for (let index = 0; index < fields.length; index += 1) {
    const field = fields.get(index);
    if (field.arbeidsforhold && !arbeidsforholdEksistererIListen(field, arbeidsgiverList)) {
      const arbeidsforholdObject = {
        andelsnr: field.andelsnr,
        arbeidsforholdId: field.arbeidsforholdId,
        arbeidsgiverId: field.arbeidsgiverId,
        arbeidsgiverNavn: field.arbeidsgiverNavn,
        arbeidsperiodeFom: field.arbeidsperiodeFom,
        arbeidsperiodeTom: field.arbeidsperiodeTom,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  }
  return arbeidsgiverList;
};


export const arbeidsforholdProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});
