import PropTypes from 'prop-types';

const fodselOriginalBehandlingPropType = PropTypes.shape({
  soknad: PropTypes.shape({
    fodselsdatoer: PropTypes.arrayOf(PropTypes.string).isRequired,
    antallBarn: PropTypes.number.isRequired,
  }).isRequired,
  familiehendelse: PropTypes.shape({
    termindato: PropTypes.string.isRequired,
    fodselsdato: PropTypes.string.isRequired,
    antallBarnTermin: PropTypes.number.isRequired,
    antallBarnFodsel: PropTypes.number.isRequired,
  }).isRequired,
});

export default fodselOriginalBehandlingPropType;
