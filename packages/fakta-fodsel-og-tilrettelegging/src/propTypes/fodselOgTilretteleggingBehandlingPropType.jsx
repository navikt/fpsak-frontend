import PropTypes from 'prop-types';

const fodselOgTilretteleggingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default fodselOgTilretteleggingBehandlingPropType;
