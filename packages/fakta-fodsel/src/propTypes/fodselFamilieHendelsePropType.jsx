import PropTypes from 'prop-types';

const fodselFamilieHendelsePropType = PropTypes.shape({
  register: PropTypes.shape({
    avklartBarn: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }),
  gjeldende: PropTypes.shape({
    fodselsdato: PropTypes.string.isRequired,
    termindato: PropTypes.string.isRequired,
    utstedtdato: PropTypes.string.isRequired,
    antallBarnTermin: PropTypes.number.isRequired,
    antallBarnFodsel: PropTypes.number.isRequired,
    erOverstyrt: PropTypes.bool.isRequired,
    vedtaksDatoSomSvangerskapsuke: PropTypes.string.isRequired,
    morForSykVedFodsel: PropTypes.bool.isRequired,
    dokumentasjonForeligger: PropTypes.bool.isRequired,
    brukAntallBarnFraTps: PropTypes.bool.isRequired,
    avklartBarn: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }),
});

export default fodselFamilieHendelsePropType;
