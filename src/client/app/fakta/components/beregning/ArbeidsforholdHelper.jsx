import PropTypes from 'prop-types';

export const sortArbeidsforholdList = (arbeidsforhold) => {
  const copy = arbeidsforhold.slice(0);
  copy.sort((a, b) => new Date(a.startdato) - new Date(b.startdato));
  return copy;
};

export const createArbeidsperiodeString = (arbeidsforhold) => {
  if (arbeidsforhold.opphoersdato !== undefined && arbeidsforhold.opphoersdato !== null) {
    return `${arbeidsforhold.startdato} - ${arbeidsforhold.opphoersdato}`;
  }
  return `${arbeidsforhold.startdato} - `;
};


export const getUniqueListOfArbeidsforhold = (andeler) => {
  const arbeidsgiverList = [];
  if (andeler === undefined) {
    return arbeidsgiverList;
  }
  andeler.forEach((andel) => {
    if (andel.arbeidsforhold !== null && !arbeidsgiverList.map(({ arbeidsforholdId }) => (arbeidsforholdId)).includes(andel.arbeidsforhold.arbeidsforholdId)) {
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
  virksomhetNavn: PropTypes.string,
  virksomhetId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});
