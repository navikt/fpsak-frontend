import PropTypes from 'prop-types';

const commonSoknad = {
  soknadType: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  }),
  mottattDato: PropTypes.string,
  tilleggsopplysninger: PropTypes.string,
  begrunnelseForSenInnsending: PropTypes.string,
  annenPartNavn: PropTypes.string,
  antallBarn: PropTypes.number,
  farSokerType: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string,
  }),
  manglendeVedlegg: PropTypes.arrayOf(PropTypes.shape({
    dokumentType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string,
    }).isRequired,
    arbeidsgiver: PropTypes.shape({
    }),
    brukerHarSagtAtIkkeKommer: PropTypes.bool,
  })),
};

const soknadPropType = PropTypes.oneOfType([
  PropTypes.shape({
    ...commonSoknad,
    omsorgsovertakelseDato: PropTypes.string,
    adopsjonFodelsedatoer: PropTypes.shape(),
  }),
  PropTypes.shape({
    ...commonSoknad,
    utstedtdato: PropTypes.string,
    termindato: PropTypes.string,
    fodselsdatoer: PropTypes.shape(),
  }),
]);

export default soknadPropType;
