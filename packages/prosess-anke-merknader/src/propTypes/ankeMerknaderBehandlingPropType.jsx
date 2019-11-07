import PropTypes from 'prop-types';

const ankeMerknaderBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default ankeMerknaderBehandlingPropType;
