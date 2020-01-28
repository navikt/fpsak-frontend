import PropTypes from 'prop-types';

const fodselSammenligningFamiliehendelsePropType = PropTypes.shape({
  termindato: PropTypes.string,
  fodselsdato: PropTypes.string,
  antallBarnTermin: PropTypes.number,
  antallBarnFodsel: PropTypes.number,
});

export default fodselSammenligningFamiliehendelsePropType;
