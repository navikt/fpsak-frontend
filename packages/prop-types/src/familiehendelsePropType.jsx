import PropTypes from 'prop-types';

const familiehendelsePropType = PropTypes.oneOfType([
  PropTypes.shape({
    soknadType: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    fodselsdato: PropTypes.string,
    antallBarnFodsel: PropTypes.number,
    brukAntallBarnFraTps: PropTypes.bool,
    termindato: PropTypes.string,
    antallBarnTermin: PropTypes.number,
    utstedtdato: PropTypes.string,
  }),
  PropTypes.shape({
    soknadType: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    mannAdoptererAlene: PropTypes.bool,
    ektefellesBarn: PropTypes.bool,
    omsorgsovertakelseDato: PropTypes.string,
    adopsjonFodelsedatoer: PropTypes.shape(),
  }),
  PropTypes.shape({
    soknadType: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    omsorgsovertakelseDato: PropTypes.string,
    vilkarType: PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
    antallBarnTilBeregning: PropTypes.number,
  }),
]);

export default familiehendelsePropType;
