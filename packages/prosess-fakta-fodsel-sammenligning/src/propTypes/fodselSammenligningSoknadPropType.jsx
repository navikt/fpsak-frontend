import PropTypes from 'prop-types';

const revurderingSoknadPropType = PropTypes.shape({
  fodselsdatoer: PropTypes.arrayOf(PropTypes.string).isRequired,
  termindato: PropTypes.string.isRequired,
  antallBarn: PropTypes.number.isRequired,
  utstedtdato: PropTypes.string.isRequired,
});

export default revurderingSoknadPropType;
