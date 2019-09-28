import PropTypes from 'prop-types';

const soknadsfristUttakPeriodeGrensePropType = PropTypes.shape({
  mottattDato: PropTypes.string.isRequired,
  antallDagerLevertForSent: PropTypes.number.isRequired,
  soknadsperiodeStart: PropTypes.string.isRequired,
  soknadsperiodeSlutt: PropTypes.string.isRequired,
  soknadsfristForForsteUttaksdato: PropTypes.string.isRequired,
});

export default soknadsfristUttakPeriodeGrensePropType;
