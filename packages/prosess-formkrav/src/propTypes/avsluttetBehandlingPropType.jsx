import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const avsluttetBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: kodeverkObjektPropType.isRequired,
  avsluttet: PropTypes.string,
});

export default avsluttetBehandlingPropType;
