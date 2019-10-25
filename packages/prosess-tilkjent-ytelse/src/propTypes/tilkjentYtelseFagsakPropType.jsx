import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const tilkjentYtelseFagsakPropType = PropTypes.shape({
  ytelseType: kodeverkObjektPropType.isRequired,
});

export default tilkjentYtelseFagsakPropType;
