import PropTypes from 'prop-types';

const opptjeningBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default opptjeningBehandlingPropType;
