import PropTypes from 'prop-types';

import arbeidsforholdPropType from './arbeidsforholdPropType';

const arbeidsforholdInntektArbeidYtelsePropType = PropTypes.shape({
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdPropType),
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
});

export default arbeidsforholdInntektArbeidYtelsePropType;
