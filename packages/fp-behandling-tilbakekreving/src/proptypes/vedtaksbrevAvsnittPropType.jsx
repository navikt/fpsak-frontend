import PropTypes from 'prop-types';

const vedtaksbrevAvsnittPropType = PropTypes.shape({
  avsnittstype: PropTypes.string.isRequired,
  fom: PropTypes.string,
  tom: PropTypes.string,
  overskrift: PropTypes.string,
  underavsnittsliste: PropTypes.arrayOf(PropTypes.shape({
    brødtekst: PropTypes.string,
    fritekst: PropTypes.string,
    fritekstTillatt: PropTypes.bool.isRequired,
    overskrift: PropTypes.string,
    underavsnittstype: PropTypes.string,
  })).isRequired,
});

export default vedtaksbrevAvsnittPropType;
