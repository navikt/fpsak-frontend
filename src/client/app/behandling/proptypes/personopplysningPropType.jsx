import PropTypes from 'prop-types';

const personopplysningPropType = PropTypes.shape({
  nummer: PropTypes.number,
  navBrukerKjonn: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  statsborgerskap: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  avklartPersonstatus: PropTypes.shape({
    orginalPersonstatus: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }),
    overstyrtPersonstatus: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }).isRequired,
  }),
  personstatus: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  diskresjonskode: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  sivilstand: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  aktoerId: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  dodsdato: PropTypes.string,
  fodselsdato: PropTypes.string,
  adresser: PropTypes.arrayOf(PropTypes.shape({
    adresseType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }),
    adresselinje1: PropTypes.string,
    adresselinje2: PropTypes.string,
    adresselinje3: PropTypes.string,
    postNummer: PropTypes.string,
    poststed: PropTypes.string,
    land: PropTypes.string,
    mottakerNavn: PropTypes.string,

  })),
  fnr: PropTypes.string,
  region: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  annenPart: PropTypes.shape(),
  barn: PropTypes.arrayOf(PropTypes.shape()),
  harVerge: PropTypes.bool,
  barnSoktFor: PropTypes.arrayOf(PropTypes.shape()),
  barnFraTpsRelatertTilSoknad: PropTypes.arrayOf(PropTypes.shape()),
  opplysningsKilde: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
});

export default personopplysningPropType;
