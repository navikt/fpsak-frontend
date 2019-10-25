import PropTypes from 'prop-types';

const opptjeningPropType = PropTypes.shape({
  fastsattOpptjening: PropTypes.shape({
    omsorgsovertakelseDato: PropTypes.string,
  }),
  opptjeningAktivitetList: PropTypes.arrayOf(PropTypes.shape({
    omsorgsovertakelseDato: PropTypes.string,
  })),
});

export default opptjeningPropType;
