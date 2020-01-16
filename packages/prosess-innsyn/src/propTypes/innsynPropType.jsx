import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const innsynPropType = PropTypes.shape({
  dokumenter: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tidspunkt: PropTypes.string,
  })).isRequired,
  innsynMottattDato: PropTypes.string,
  innsynResultatType: kodeverkObjektPropType,
  vedtaksdokumentasjon: PropTypes.arrayOf(PropTypes.shape({
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    opprettetDato: PropTypes.string.isRequired,
  }).isRequired).isRequired,
});

export default innsynPropType;
