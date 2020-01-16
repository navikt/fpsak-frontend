import PropTypes from 'prop-types';

const ankeVurderingPropType = PropTypes.shape({
  ankeVurderingResultat: PropTypes.shape({
    ankeVurdering: PropTypes.string,
    ankeVurderingOmgjoer: PropTypes.string,
    ankeOmgjoerArsakNavn: PropTypes.string,
    begrunnelse: PropTypes.string.isRequired,
    paAnketBehandlingId: PropTypes.number,
    erAnkerIkkePart: PropTypes.bool.isRequired,
    erIkkeKonkret: PropTypes.bool.isRequired,
    erFristIkkeOverholdt: PropTypes.bool.isRequired,
    erIkkeSignert: PropTypes.bool.isRequired,
    erSubsidiartRealitetsbehandles: PropTypes.bool.isRequired,
  }),
});

export default ankeVurderingPropType;
