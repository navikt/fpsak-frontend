import PropTypes from 'prop-types';

const fagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  barnFodt: PropTypes.string,
  person: PropTypes.shape({
    navn: PropTypes.string.isRequired,
    alder: PropTypes.number.isRequired,
    personnummer: PropTypes.string.isRequired,
    erKvinne: PropTypes.bool.isRequired,
    personstatusType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }),
    diskresjonskode: PropTypes.string,
    dodsdato: PropTypes.string,
    erNAVAnsatt: PropTypes.bool,
    erVerge: PropTypes.bool,
  }),
  opprettet: PropTypes.string.isRequired,
  endret: PropTypes.string,
  antallBarn: PropTypes.number,
  kanRevurderingOpprettes: PropTypes.bool,
});

export default fagsakPropType;
