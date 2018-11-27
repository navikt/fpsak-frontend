import PropTypes from 'prop-types';

const navAnsattPropType = PropTypes.shape({
  brukernavn: PropTypes.string.isRequired,
  kanBehandleKode6: PropTypes.bool.isRequired,
  kanBehandleKode7: PropTypes.bool.isRequired,
  kanBehandleKodeEgenAnsatt: PropTypes.bool.isRequired,
  kanBeslutte: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  kanSaksbehandle: PropTypes.bool.isRequired,
  kanVeilede: PropTypes.bool.isRequired,
  navn: PropTypes.string.isRequired,
  funksjonellTid: PropTypes.string,
});

export default navAnsattPropType;
