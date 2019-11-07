import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const ankeResultatAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
});

export default ankeResultatAksjonspunkterPropType;
