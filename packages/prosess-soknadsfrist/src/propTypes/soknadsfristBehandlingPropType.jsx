import PropTypes from 'prop-types';

const soknadsfristBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default soknadsfristBehandlingPropType;
