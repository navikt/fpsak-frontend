import PropTypes from 'prop-types';

const revurderingSoknadPropType = PropTypes.shape({
  fodselsdatoer: PropTypes.shape().isRequired,
  termindato: PropTypes.string,
  antallBarn: PropTypes.number.isRequired,
  utstedtdato: PropTypes.string,
});

export default revurderingSoknadPropType;
