import PropTypes from 'prop-types';

// TODO (TOR) Dette burde ikkje vore ein array-prop. Forventar shape ut ifrå navnet
export const kodeverkPropType = PropTypes.arrayOf(PropTypes.shape({
  kode: PropTypes.string.isRequired,
  kodeverk: PropTypes.string,
  navn: PropTypes.string.isRequired,
}));

export const kodeverkObjektPropType = PropTypes.shape({
  kode: PropTypes.string.isRequired,
  kodeverk: PropTypes.string,
  navn: PropTypes.string.isRequired,
});

export default kodeverkPropType;
