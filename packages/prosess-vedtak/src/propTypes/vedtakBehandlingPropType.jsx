import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape(),
  behandlingPaaVent: PropTypes.bool.isRequired,
  behandlingHenlagt: PropTypes.bool.isRequired,
  behandlingArsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
});

export default vedtakBehandlingPropType;
