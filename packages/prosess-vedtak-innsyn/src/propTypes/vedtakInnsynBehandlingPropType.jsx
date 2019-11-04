import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakInnsynBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
});

export default vedtakInnsynBehandlingPropType;
