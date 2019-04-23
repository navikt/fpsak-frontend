import PropTypes from 'prop-types';

const personPropType = PropTypes.shape({
  navn: PropTypes.string.isRequired,
  alder: PropTypes.number.isRequired,
  personnummer: PropTypes.string.isRequired,
  erKvinne: PropTypes.bool.isRequired,
  diskresjonskode: PropTypes.string,
  dodsdato: PropTypes.string,
});

export default personPropType;
