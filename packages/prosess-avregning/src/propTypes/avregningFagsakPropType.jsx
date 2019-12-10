import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const avregningFagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.string.isRequired,
  ytelseType: kodeverkObjektPropType.isRequired,
});

export default avregningFagsakPropType;
