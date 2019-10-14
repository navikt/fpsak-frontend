import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vilkarOverstyringAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  kanLoses: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
});

export default vilkarOverstyringAksjonspunkterPropType;
