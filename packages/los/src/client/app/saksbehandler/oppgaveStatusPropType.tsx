import PropTypes from 'prop-types';

const oppgaveStatusPropType = PropTypes.shape({
  erReservert: PropTypes.bool.isRequired,
  reservertTilTidspunkt: PropTypes.string,
  erReservertAvInnloggetBruker: PropTypes.bool,
  reservertAvUid: PropTypes.string,
  reservertAvNavn: PropTypes.string,
  flyttetReservasjon: PropTypes.shape({
    tidspunkt: PropTypes.string,
    uid: PropTypes.string,
    navn: PropTypes.string,
    begrunnelse: PropTypes.string,
  }),
});

export default oppgaveStatusPropType;
