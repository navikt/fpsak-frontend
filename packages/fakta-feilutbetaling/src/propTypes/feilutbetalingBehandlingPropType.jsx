import PropTypes from 'prop-types';

const feilutbetalingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default feilutbetalingBehandlingPropType;
