import PropTypes from 'prop-types';

const dokumentPropType = PropTypes.shape({
  journalpostId: PropTypes.string.isRequired,
  dokumentId: PropTypes.string.isRequired,
  behandlinger: PropTypes.arrayOf(PropTypes.number),
  tittel: PropTypes.string.isRequired,
  tidspunkt: PropTypes.string,
  kommunikasjonsretning: PropTypes.string.isRequired,
  gjelderFor: PropTypes.string,
});

export default dokumentPropType;
