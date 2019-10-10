import PropTypes from 'prop-types';

const medlemskapInntektArbeidYtelsePropType = PropTypes.shape({
  inntektsmeldinger: PropTypes.arrayOf(PropTypes.shape({
    arbeidsgiverStartdato: PropTypes.string,
  })),
});

export default medlemskapInntektArbeidYtelsePropType;
