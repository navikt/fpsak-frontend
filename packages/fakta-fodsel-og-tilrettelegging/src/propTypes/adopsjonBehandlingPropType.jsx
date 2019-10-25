import PropTypes from 'prop-types';

const adopsjonBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default adopsjonBehandlingPropType;
