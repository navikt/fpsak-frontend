import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const revurderingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingArsaker: PropTypes.arrayOf(PropTypes.shape({
    erAutomatiskRevurdering: PropTypes.bool.isRequired,
  })),
  type: kodeverkObjektPropType.isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
});

export default revurderingBehandlingPropType;
