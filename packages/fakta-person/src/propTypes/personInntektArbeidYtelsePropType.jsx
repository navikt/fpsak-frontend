import PropTypes from 'prop-types';


const personInntektArbeidYtelsePropType = PropTypes.shape({
  relatertTilgrensendeYtelserForSoker: PropTypes.arrayOf(PropTypes.shape({
    relatertYtelseType: PropTypes.string.isRequired,
    tilgrensendeYtelserListe: PropTypes.arrayOf(PropTypes.shape({
      periodeTilDato: PropTypes.string.isRequired,
      periodeFraDato: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      saksNummer: PropTypes.string.isRequired,
    })),
  })),
  relatertTilgrensendeYtelserForAnnenForelder: PropTypes.arrayOf(PropTypes.shape({
    relatertYtelseType: PropTypes.string.isRequired,
    tilgrensendeYtelserListe: PropTypes.arrayOf(PropTypes.shape({
      periodeTilDato: PropTypes.string.isRequired,
      periodeFraDato: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      saksNummer: PropTypes.string.isRequired,
    })),
  })),
});

export default personInntektArbeidYtelsePropType;
