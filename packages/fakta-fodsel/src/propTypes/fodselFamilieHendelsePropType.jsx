import PropTypes from 'prop-types';

const fodselFamilieHendelsePropType = PropTypes.shape({
  register: PropTypes.shape({
    avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  }),
  gjeldende: PropTypes.shape({
    fodselsdato: PropTypes.string,
    termindato: PropTypes.string,
    utstedtdato: PropTypes.string,
    antallBarnTermin: PropTypes.number,
    antallBarnFodsel: PropTypes.number,
    erOverstyrt: PropTypes.bool,
    vedtaksDatoSomSvangerskapsuke: PropTypes.string,
    morForSykVedFodsel: PropTypes.bool,
    dokumentasjonForeligger: PropTypes.bool,
    brukAntallBarnFraTps: PropTypes.bool,
    avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  }),
});

export default fodselFamilieHendelsePropType;
