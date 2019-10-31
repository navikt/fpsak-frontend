import PropTypes from 'prop-types';

const feilutbetalingAarsakPropType = PropTypes.shape({
  hendelseTyper: PropTypes.arrayOf(PropTypes.shape({
    hendelseType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }),
    hendelseUndertyper: PropTypes.arrayOf(PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    })),
  })).isRequired,
});

export default feilutbetalingAarsakPropType;
