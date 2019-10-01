import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const saksopplysningAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
});

export default saksopplysningAksjonspunkterPropType;
