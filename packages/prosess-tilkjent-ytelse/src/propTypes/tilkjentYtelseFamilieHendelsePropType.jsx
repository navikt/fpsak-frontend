import PropTypes from 'prop-types';

const tilkjentYtelseFamilieHendelsePropType = PropTypes.shape({
  gjeldende: PropTypes.shape({
    fodselsdato: PropTypes.string,
    omsorgsovertakelseDato: PropTypes.string,
  }),
});

export default tilkjentYtelseFamilieHendelsePropType;
