import PropTypes from 'prop-types';

const dokumentPropType = PropTypes.shape({
  journalpostId: PropTypes.string.isRequired,
  dokumentId: PropTypes.string.isRequired,
  tittel: PropTypes.string,
  tidspunkt: PropTypes.string,
  kommunikasjonsretning: PropTypes.string.isRequired,
});

export default dokumentPropType;
