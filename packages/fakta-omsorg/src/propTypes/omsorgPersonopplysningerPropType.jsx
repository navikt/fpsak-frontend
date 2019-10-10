import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const omsorgPersonopplysningerPropType = PropTypes.shape({
  navn: PropTypes.string.isRequired,
  barn: PropTypes.arrayOf(PropTypes.shape({
    navn: PropTypes.string.isRequired,
  })),
  ektefelle: PropTypes.shape({
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
  }),
  personstatus: kodeverkObjektPropType.isRequired,
  adresser: PropTypes.arrayOf(PropTypes.shape({
    adresseType: kodeverkObjektPropType.isRequired,
    adresselinje1: PropTypes.string,
    adresselinje2: PropTypes.string,
    adresselinje3: PropTypes.string,
    land: PropTypes.string,
  })).isRequired,
});

export default omsorgPersonopplysningerPropType;
