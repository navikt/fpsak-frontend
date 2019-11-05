import PropTypes from 'prop-types';

const beregningBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default beregningBehandlingPropType;
