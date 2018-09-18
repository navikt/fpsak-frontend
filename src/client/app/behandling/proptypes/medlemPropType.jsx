import PropTypes from 'prop-types';

const medlemPropType = PropTypes.shape({
  inntekt: PropTypes.arrayOf(PropTypes.shape({
    navn: PropTypes.string.isRequired,
    utbetaler: PropTypes.string.isRequired,
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    ytelse: PropTypes.bool.isRequired,
    belop: PropTypes.number.isRequired,
  })),
  skjearingstidspunkt: PropTypes.string.isRequired,
  medlemskapPerioder: PropTypes.arrayOf(PropTypes.shape({
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    medlemskapType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }).isRequired,
    dekningType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }).isRequired,
    kildeType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }).isRequired,
    beslutningsdato: PropTypes.string,
  })),
  oppholdsrettVurdering: PropTypes.bool,
  erEosBorger: PropTypes.bool,
  lovligOppholdVurdering: PropTypes.bool,
  bosattVurdering: PropTypes.bool,
  medlemskapManuellVurderingType: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }),
  fom: PropTypes.string,
});

export default medlemPropType;
