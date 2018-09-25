import PropTypes from 'prop-types';

const kodeverkPropType = PropTypes.arrayOf(PropTypes.shape({
  kode: PropTypes.string,
  navn: PropTypes.string,
}));

export default kodeverkPropType;
