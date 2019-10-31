import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const uttakBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
  type: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape({
    skjaeringstidspunktForeldrepenger: PropTypes.string.isRequired,
  }).isRequired,
});

export default uttakBehandlingPropType;
