import PropTypes from 'prop-types';

const feilutbetalingFaktaPropType = PropTypes.shape({
  gjeldende: PropTypes.shape({
    omsorgsovertakelseDato: PropTypes.string,
    barnetsAnkomstTilNorgeDato: PropTypes.string,
    adopsjonFodelsedatoer: PropTypes.shape(),
    ektefellesBarn: PropTypes.bool,
    mannAdoptererAlene: PropTypes.bool,
  }),
});

export default feilutbetalingFaktaPropType;
