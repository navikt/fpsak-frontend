import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const innsynPropType = PropTypes.shape({
  dokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  innsynMottattDato: PropTypes.string.isRequired,
  innsynResultatType: PropTypes.shape({
    type: kodeverkObjektPropType.isRequired,
  }).isRequired,
});

export default innsynPropType;
