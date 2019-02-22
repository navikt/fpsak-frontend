import PropTypes from 'prop-types';

const behandlingsresultatPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  avslagsarsak: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }),
  avslagsarsakFritekst: PropTypes.string,
  skjaeringstidspunktForeldrepenger: PropTypes.string,
});

export default behandlingsresultatPropType;
