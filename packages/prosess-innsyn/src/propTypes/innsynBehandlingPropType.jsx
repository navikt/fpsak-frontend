import PropTypes from 'prop-types';

const innsynBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
});

export default innsynBehandlingPropType;
