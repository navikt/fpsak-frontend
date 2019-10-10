import PropTypes from 'prop-types';

const omsorgBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default omsorgBehandlingPropType;
