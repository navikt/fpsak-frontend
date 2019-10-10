import PropTypes from 'prop-types';

const omsorgOgForeldreBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default omsorgOgForeldreBehandlingPropType;
