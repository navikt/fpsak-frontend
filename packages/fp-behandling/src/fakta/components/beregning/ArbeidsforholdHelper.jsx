import PropTypes from 'prop-types';

export const sortArbeidsforholdList = (arbeidsforhold) => {
  const copy = arbeidsforhold.slice(0);
  copy.sort((a, b) => new Date(a.arbeidsforhold.startdato) - new Date(b.arbeidsforhold.startdato));
  return copy;
};

export const createArbeidsperiodeString = (arbeidsforhold) => {
  if (arbeidsforhold.opphoersdato !== undefined && arbeidsforhold.opphoersdato !== null) {
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


export const getUniqueListOfArbeidsforhold = (andeler) => {
  const arbeidsgiverList = [];
  if (andeler === undefined) {
    return arbeidsgiverList;
  }
  andeler.forEach((andel) => {
    if (andel.arbeidsforhold !== null && !arbeidsforholdEksistererIListen(andel.arbeidsforhold, arbeidsgiverList)) {
      const arbeidsforholdObject = {
        andelsnr: andel.andelsnr,
        ...andel.arbeidsforhold,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  });
  return arbeidsgiverList;
};


export const arbeidsforholdProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});
