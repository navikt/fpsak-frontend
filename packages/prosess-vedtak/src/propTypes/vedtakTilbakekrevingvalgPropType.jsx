import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakTilbakekrevingvalgPropType = PropTypes.shape({
  videreBehandling: kodeverkObjektPropType.isRequired,
});

export default vedtakTilbakekrevingvalgPropType;
