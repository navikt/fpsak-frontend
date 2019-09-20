import PropTypes from 'prop-types';

import { kodeverkPropType } from '@fpsak-frontend/prop-types';

const avregningAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkPropType.isRequired,
  begrunnelse: PropTypes.string.isRequired,
});

export default avregningAksjonspunkterPropType;
