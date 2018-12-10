import PropTypes from 'prop-types';

const historikkinnslagDelPropType = PropTypes.shape({
  begrunnelse: PropTypes.shape({
    kode: PropTypes.string,
    kodeverk: PropTypes.string,
    navn: PropTypes.string,
  }),
  begrunnelseFritekst: PropTypes.string,
  hendelse: PropTypes.shape({
    navn: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    verdi: PropTypes.string,
  }),
  opplysninger: PropTypes.arrayOf(PropTypes.shape({
    opplysningType: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    tilVerdi: PropTypes.string,
  })),
  soeknadsperiode: PropTypes.shape({
    soeknadsperiodeType: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    tilVerdi: PropTypes.string,
  }),
  skjermlenke: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  }),
  gjeldendeFra: PropTypes.shape({
    fra: PropTypes.string,
    navn: PropTypes.string,
    verdi: PropTypes.string,
  }),
  aarsak: PropTypes.PropTypes.shape({
    kode: PropTypes.string,
    kodeverk: PropTypes.string,
    navn: PropTypes.string,
  }),
  resultat: PropTypes.string,
  endredeFelter: PropTypes.arrayOf(PropTypes.shape({
    endretFeltNavn: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    navnVerdi: PropTypes.string,
    fraVerdi: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    tilVerdi: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    klFraVerdi: PropTypes.string,
    klTilVerdi: PropTypes.string,
  })),
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape({
    aksjonspunktBegrunnelse: PropTypes.string,
    godkjent: PropTypes.bool,
    aksjonspunktKode: PropTypes.string,
  })),
});

export default historikkinnslagDelPropType;
