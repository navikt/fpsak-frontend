import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakTilbakekrevingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingsresultat: PropTypes.shape({
    type: kodeverkObjektPropType.isRequired,
  }),
  behandlingPaaVent: PropTypes.bool.isRequired,
});

export default vedtakTilbakekrevingBehandlingPropType;
