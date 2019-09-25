import PropTypes from 'prop-types';

const fodselSammenligningOriginalBehandlingPropType = PropTypes.shape({
  soknad: PropTypes.shape({
    fodselsdatoer: PropTypes.shape().isRequired,
    antallBarn: PropTypes.number.isRequired,
  }).isRequired,
  familiehendelse: PropTypes.shape({
    termindato: PropTypes.string,
    fodselsdato: PropTypes.string,
    antallBarnTermin: PropTypes.number,
    antallBarnFodsel: PropTypes.number,
  }).isRequired,
});

export default fodselSammenligningOriginalBehandlingPropType;
