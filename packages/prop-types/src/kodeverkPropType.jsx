import PropTypes from 'prop-types';


export const kodeverkPropType = PropTypes.arrayOf(PropTypes.shape({
  kode: PropTypes.string.isRequired,
  kodeverk: PropTypes.string, // burde være required fy fy backend
  navn: PropTypes.string.isRequired,
}));

export const kodeverkObjektPropType = PropTypes.shape({
  kode: PropTypes.string.isRequired,
  kodeverk: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
});

export default kodeverkPropType;
