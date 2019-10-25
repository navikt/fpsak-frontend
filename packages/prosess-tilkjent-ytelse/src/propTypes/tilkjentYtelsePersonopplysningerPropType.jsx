import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const tilkjentYtelsePersonopplysningerPropType = PropTypes.shape({
  navBrukerKjonn: kodeverkObjektPropType.isRequired,
  annenPart: PropTypes.shape({
    navBrukerKjonn: kodeverkObjektPropType.isRequired,
  }),
});

export default tilkjentYtelsePersonopplysningerPropType;
