import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const saksopplysningPersonsopplysningerPropType = PropTypes.shape({
  personstatus: kodeverkObjektPropType.isRequired,
  avklartPersonstatus: PropTypes.shape({
    orginalPersonstatus: kodeverkObjektPropType,
    overstyrtPersonstatus: kodeverkObjektPropType,
  }).isRequired,
});

export default saksopplysningPersonsopplysningerPropType;
