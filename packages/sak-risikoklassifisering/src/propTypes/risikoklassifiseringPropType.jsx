import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const risikoklassifiseringPropType = PropTypes.shape({
  kontrollresultat: kodeverkObjektPropType.isRequired,
  faresignalVurdering: kodeverkObjektPropType,
});

export default risikoklassifiseringPropType;
