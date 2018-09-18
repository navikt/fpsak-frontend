import PropTypes from 'prop-types';

const aksjonspunktPropType = PropTypes.shape({
  definisjon: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  begrunnelse: PropTypes.string,
  vilkarType: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }),
  toTrinnsBehandling: PropTypes.bool,
  toTrinnsBehandlingGodkjent: PropTypes.bool,
  vurderPaNyttArsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  besluttersBegrunnelse: PropTypes.string,
  aksjonspunktType: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }),
  kanLoses: PropTypes.bool.isRequired,
  erAktivt: PropTypes.bool.isRequired,
});

export default aksjonspunktPropType;
