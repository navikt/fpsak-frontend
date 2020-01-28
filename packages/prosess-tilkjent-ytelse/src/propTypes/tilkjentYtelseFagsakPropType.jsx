import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const tilkjentYtelseFagsakPropType = PropTypes.shape({
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
});

export default tilkjentYtelseFagsakPropType;
