import PropTypes from 'prop-types';

const personFagsakPersonPropType = PropTypes.shape({
  navn: PropTypes.string.isRequired,
  personnummer: PropTypes.string.isRequired,
  erKvinne: PropTypes.bool.isRequired,
  diskresjonskode: PropTypes.string,
  dodsdato: PropTypes.string,
  harVerge: false,
  erDod: PropTypes.bool.isRequired,
  alder: PropTypes.number.isRequired,
});

export default personFagsakPersonPropType;
