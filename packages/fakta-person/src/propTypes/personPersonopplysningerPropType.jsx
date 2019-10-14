import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const personPersonopplysningerPropType = PropTypes.shape({
  barn: PropTypes.shape().isRequired,
  navn: PropTypes.string.isRequired,
  fodselsdato: PropTypes.string.isRequired,
  fnr: PropTypes.string.isRequired,
  navBrukerKjonn: kodeverkObjektPropType.isRequired,
  diskresjonskode: kodeverkObjektPropType,
  personstatus: kodeverkObjektPropType.isRequired,
  avklartPersonstatus: PropTypes.shape({
    overstyrtPersonstatus: kodeverkObjektPropType,
  }),
  dodsdato: PropTypes.string,
  harVerge: false,
});

export default personPersonopplysningerPropType;
