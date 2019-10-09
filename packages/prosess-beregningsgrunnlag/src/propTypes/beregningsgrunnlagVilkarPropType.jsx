import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const beregningsgrunnlagVilkarPropType = PropTypes.shape({
  vilkarType: kodeverkObjektPropType.isRequired,
  vilkarStatus: kodeverkObjektPropType.isRequired,
});

export default beregningsgrunnlagVilkarPropType;
