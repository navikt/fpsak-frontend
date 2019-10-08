import PropTypes from 'prop-types';

const medlemskapSoknadPropType = PropTypes.shape({
  oppgittFordeling: PropTypes.shape({
    startDatoForPermisjon: PropTypes.string,
  }),
  oppgittTilknytning: PropTypes.shape({
    oppholdNorgeNa: PropTypes.bool,
    oppholdNestePeriode: PropTypes.bool,
    oppholdSistePeriode: PropTypes.bool,
    utlandsoppholdFor: PropTypes.arrayOf(PropTypes.shape()),
    utlandsoppholdEtter: PropTypes.arrayOf(PropTypes.shape()),
  }),
});

export default medlemskapSoknadPropType;
