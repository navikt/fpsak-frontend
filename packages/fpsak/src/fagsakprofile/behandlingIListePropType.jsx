import PropTypes from 'prop-types';

const behandlingIListePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  fagsakId: PropTypes.number.isRequired,
  opprettet: PropTypes.string.isRequired,
  avsluttet: PropTypes.string,
  endret: PropTypes.string,
  behandlendeEnhetId: PropTypes.string.isRequired,
  behandlendeEnhetNavn: PropTypes.string.isRequired,
  erAktivPapirsoknad: PropTypes.bool.isRequired,
});

export default behandlingIListePropType;
