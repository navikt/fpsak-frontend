import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const bostedSokerPersonopplysningerPropType = PropTypes.shape({
  navn: PropTypes.string.isRequired,
  adresser: PropTypes.arrayOf(PropTypes.shape({
    adresseType: kodeverkObjektPropType.isRequired,
    adresselinje1: PropTypes.string,
    adresselinje2: PropTypes.string,
    adresselinje3: PropTypes.string,
    land: PropTypes.string,
  })).isRequired,
  sivilstand: kodeverkObjektPropType,
  region: kodeverkObjektPropType,
  personstatus: kodeverkObjektPropType.isRequired,
  avklartPersonstatus: PropTypes.shape({
    overstyrtPersonstatus: kodeverkObjektPropType,
  }),
});

export default bostedSokerPersonopplysningerPropType;
