import PropTypes from 'prop-types';

const omsorgYtelsefordelingPropType = PropTypes.shape({
  aleneOmsorgPerioder: PropTypes.arrayOf(PropTypes.shape()),
  ikkeOmsorgPerioder: PropTypes.arrayOf(PropTypes.shape()),
});

export default omsorgYtelsefordelingPropType;
