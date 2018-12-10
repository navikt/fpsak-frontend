import PropTypes from 'prop-types';

const opptjeningPropType = PropTypes.shape({
  fastsattOpptjening: PropTypes.shape({
    opptjeningFom: PropTypes.string.isRequired,
    opptjeningTom: PropTypes.string.isRequired,
    fastsattOpptjeningAktivitetList: PropTypes.arrayOf(PropTypes.shape({
      fom: PropTypes.string.isRequired,
      tom: PropTypes.string.isRequired,
      type: PropTypes.shape({
        kode: PropTypes.string.isRequired,
        navn: PropTypes.string.isRequired,
      }).isRequired,
      klasse: PropTypes.shape({
        kode: PropTypes.string.isRequired,
        navn: PropTypes.string.isRequired,
      }).isRequired,
      aktivitetReferanse: PropTypes.string.isRequired,
    })),
  }).isRequired,
  opptjeningAktivitetList: PropTypes.arrayOf(PropTypes.shape({
    aktivitetType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }).isRequired,
    opptjeningFom: PropTypes.string.isRequired,
    opptjeningTom: PropTypes.string.isRequired,
    arbeidsgiver: PropTypes.string,
    arbeidsforholdRef: PropTypes.string,
    oppdragsgiverOrg: PropTypes.string,
    stillingsandel: PropTypes.number,
    naringRegistreringsdato: PropTypes.string,
    erManueltOpprettet: PropTypes.bool,
    erGodkjent: PropTypes.bool,
    erEndret: PropTypes.bool,
    erPeriodeEndret: PropTypes.bool,
    begrunnelse: PropTypes.string,
  })).isRequired,
});

export default opptjeningPropType;
