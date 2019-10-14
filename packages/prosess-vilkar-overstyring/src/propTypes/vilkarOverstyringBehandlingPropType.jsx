import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vilkarOverstyringBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape(),
});

export default vilkarOverstyringBehandlingPropType;
