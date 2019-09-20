import PropTypes from 'prop-types';

const avregningBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  sprakkode: PropTypes.string.isRequired,
});

export default avregningBehandlingPropType;
