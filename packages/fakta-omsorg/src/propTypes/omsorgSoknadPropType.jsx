import PropTypes from 'prop-types';

const omsorgSoknadPropType = PropTypes.shape({
  oppgittRettighet: PropTypes.shape({
    omsorgForBarnet: PropTypes.bool.isRequired,
    aleneomsorgForBarnet: PropTypes.bool.isRequired,
  }).isRequired,
});

export default omsorgSoknadPropType;
