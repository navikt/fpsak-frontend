import PropTypes from 'prop-types';

import { kodeverkPropType } from '@fpsak-frontend/prop-types';

const avregningFagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.string.isRequired,
  ytelseType: kodeverkPropType.isRequired,
});

export default avregningFagsakPropType;
