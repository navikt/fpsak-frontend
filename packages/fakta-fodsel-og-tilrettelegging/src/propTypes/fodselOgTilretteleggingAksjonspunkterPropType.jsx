import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const fodselOgTilretteleggingAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
  kanLoses: PropTypes.bool.isRequired,
});

export default fodselOgTilretteleggingAksjonspunkterPropType;
