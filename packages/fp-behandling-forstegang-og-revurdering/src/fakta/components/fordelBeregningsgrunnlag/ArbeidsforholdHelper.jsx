import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import {
  getEndringBeregningsgrunnlagPerioder,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';

export const createArbeidsperiodeString = (arbeidsforhold) => {
  if (arbeidsforhold.opphoersdato) {
    return `${arbeidsforhold.startdato} - ${arbeidsforhold.opphoersdato}`;
  }
  return `${arbeidsforhold.startdato} - `;
};

const arbeidsforholdEksistererIListen = (arbeidsforhold, arbeidsgiverList) => {
  if (arbeidsforhold.arbeidsforholdId === null) {
    return arbeidsgiverList.map(({ arbeidsgiverId }) => (arbeidsgiverId)).includes(arbeidsforhold.arbeidsgiverId);
  }
  return arbeidsgiverList.map(({ arbeidsforholdId }) => (arbeidsforholdId)).includes(arbeidsforhold.arbeidsforholdId);
};

export const getUniqueListOfArbeidsforholdFromAndeler = (andeler) => {
  const arbeidsgiverList = [];
  if (andeler === undefined) {
    return arbeidsgiverList;
  }
  andeler.forEach((andel) => {
    if (andel.arbeidsforhold !== null && !arbeidsforholdEksistererIListen(andel.arbeidsforhold, arbeidsgiverList)) {
      const arbeidsforholdObject = {
        andelsnr: andel.andelsnr,
        nyttArbeidsforhold: andel.nyttArbeidsforhold,
        ...andel.arbeidsforhold,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  });
  return arbeidsgiverList;
};

const emptyList = [];

export const getUniqueListOfArbeidsforhold = createSelector([getEndringBeregningsgrunnlagPerioder],
  endringPerioder => getUniqueListOfArbeidsforholdFromAndeler(endringPerioder.length > 0
  ? endringPerioder.flatMap(p => p.endringBeregningsgrunnlagAndeler) : emptyList));

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
