import PropTypes from 'prop-types';

const medlemskapBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default medlemskapBehandlingPropType;
