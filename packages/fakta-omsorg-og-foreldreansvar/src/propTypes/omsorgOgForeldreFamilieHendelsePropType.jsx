import PropTypes from 'prop-types';

const omsorgOgForeldreFamilieHendelsePropType = PropTypes.shape({
  gjeldende: PropTypes.shape({
    termindato: PropTypes.string,
    utstedtdato: PropTypes.string,
    antallBarnTermin: PropTypes.number,
    dokumentasjonForeligger: PropTypes.bool,
  }),
});

export default omsorgOgForeldreFamilieHendelsePropType;
