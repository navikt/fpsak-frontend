import PropTypes from 'prop-types';
import historikkinnslagDelPropType from './historikkinnslagDelPropType';

const historikkinnslagPropType = PropTypes.shape({
  behandlingsId: PropTypes.number,
  kjoennKode: PropTypes.string,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape({
    dokumentId: PropTypes.string,
    journalpostId: PropTypes.string,
    tag: PropTypes.string.isRequired,
    url: PropTypes.string,
  })),
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  opprettetAv: PropTypes.string,
});

export default historikkinnslagPropType;
