import PropTypes from 'prop-types';

const revurderingFamilieHendelsePropType = PropTypes.shape({
  register: PropTypes.shape({
    avklartBarn: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }),
  gjeldende: PropTypes.shape({
    termindato: PropTypes.string,
    vedtaksDatoSomSvangerskapsuke: PropTypes.string,
  }),
});

export default revurderingFamilieHendelsePropType;
