import PropTypes from 'prop-types';

const vergeBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default vergeBehandlingPropType;
