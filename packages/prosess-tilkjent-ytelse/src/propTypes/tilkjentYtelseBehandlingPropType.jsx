import PropTypes from 'prop-types';

const tilkjentYtelseBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default tilkjentYtelseBehandlingPropType;
