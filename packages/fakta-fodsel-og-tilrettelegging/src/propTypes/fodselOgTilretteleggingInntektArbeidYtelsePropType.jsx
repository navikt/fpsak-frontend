import PropTypes from 'prop-types';

import iayArbeidsforholdPropType from './iayArbeidsforholdPropType';

const fodselOgTilretteleggingInntektArbeidYtelsePropType = PropTypes.shape({
  arbeidsforhold: PropTypes.arrayOf(iayArbeidsforholdPropType),
});

export default fodselOgTilretteleggingInntektArbeidYtelsePropType;
