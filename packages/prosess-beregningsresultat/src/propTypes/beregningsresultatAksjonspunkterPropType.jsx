import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const beregningsresultatAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
});

export default beregningsresultatAksjonspunkterPropType;
