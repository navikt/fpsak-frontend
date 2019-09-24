import PropTypes from 'prop-types';

const revurderingFamilieHendelsePropType = PropTypes.shape({
  register: PropTypes.shape({
    avklartBarn: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }),
  gjeldende: PropTypes.shape({
    termindato: PropTypes.string.isRequired,
    vedtaksDatoSomSvangerskapsuke: PropTypes.string.isRequired,
  }),
});

export default revurderingFamilieHendelsePropType;
