import PropTypes from 'prop-types';

const foreldelseBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default foreldelseBehandlingPropType;
