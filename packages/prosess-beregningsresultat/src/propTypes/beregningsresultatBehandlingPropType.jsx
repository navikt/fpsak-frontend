import PropTypes from 'prop-types';

const beregningsresultatBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default beregningsresultatBehandlingPropType;
