import PropTypes from 'prop-types';

const kodeverkPropType = PropTypes.shape({
  kode: PropTypes.string.isRequired,
  kodeverk: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
});

export default kodeverkPropType;
