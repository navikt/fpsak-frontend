import PropTypes from 'prop-types';

const vedtakKlageVurderingPropType = PropTypes.shape({
  klageVurderingResultatNK: PropTypes.shape({
    klageVurdertAv: PropTypes.string.isRequired,
    klageVurdering: PropTypes.string.isRequired,
    fritekstTilBrev: PropTypes.string,
    klageMedholdArsakNavn: PropTypes.string.isRequired,
    godkjentAvMedunderskriver: PropTypes.bool.isRequired,
  }),
  klageVurderingResultatNFP: PropTypes.shape({
    klageVurdertAv: PropTypes.string.isRequired,
    klageVurdering: PropTypes.string.isRequired,
    fritekstTilBrev: PropTypes.string,
    klageMedholdArsakNavn: PropTypes.string.isRequired,
    godkjentAvMedunderskriver: PropTypes.bool.isRequired,
  }),
  klageFormkravResultatKA: PropTypes.shape({
    avvistArsaker: PropTypes.arrayOf(PropTypes.shape({
      navn: PropTypes.string,
    })),
  }),
  klageFormkravResultatNFP: PropTypes.shape({
    avvistArsaker: PropTypes.arrayOf(PropTypes.shape({
      navn: PropTypes.string,
    })),
  }),
});

export default vedtakKlageVurderingPropType;
