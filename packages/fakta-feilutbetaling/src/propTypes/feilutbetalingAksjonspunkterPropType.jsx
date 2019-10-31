import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const feilutbetalingAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  kanLoses: PropTypes.bool.isRequired,
});

export default feilutbetalingAksjonspunkterPropType;
