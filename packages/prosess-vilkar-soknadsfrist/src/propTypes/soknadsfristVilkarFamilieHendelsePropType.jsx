import PropTypes from 'prop-types';

const soknadsfristVilkarFamilieHendelsePropType = PropTypes.shape({
  gjeldende: PropTypes.shape({
    fodselsdato: PropTypes.string,
    omsorgsovertakelseDato: PropTypes.string,
    termindato: PropTypes.string,
  }),
});

export default soknadsfristVilkarFamilieHendelsePropType;
