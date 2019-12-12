import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const personPersonopplysningerPropType = PropTypes.shape({
  barn: PropTypes.arrayOf(PropTypes.shape({
    navn: PropTypes.string.isRequired,
    fnr: PropTypes.string.isRequired,
    navBrukerKjonn: kodeverkObjektPropType,
    soktForBarn: PropTypes.bool,
  })),
  navn: PropTypes.string.isRequired,
  fodselsdato: PropTypes.string.isRequired,
  fnr: PropTypes.string.isRequired,
  navBrukerKjonn: kodeverkObjektPropType,
  diskresjonskode: kodeverkObjektPropType,
  personstatus: kodeverkObjektPropType.isRequired,
  avklartPersonstatus: PropTypes.shape({
    overstyrtPersonstatus: kodeverkObjektPropType,
  }),
  dodsdato: PropTypes.string,
  harVerge: PropTypes.bool.isRequired,
  adresser: PropTypes.arrayOf(PropTypes.shape({
    adresseType: kodeverkObjektPropType.isRequired,
    adresselinje1: PropTypes.string.isRequired,
    adresselinje2: PropTypes.string,
    adresselinje3: PropTypes.string,
    land: PropTypes.string.isRequired,
  })),
  annenPart: PropTypes.shape({
    barn: PropTypes.arrayOf(PropTypes.shape({
      navn: PropTypes.string.isRequired,
      fnr: PropTypes.string.isRequired,
      navBrukerKjonn: kodeverkObjektPropType.isRequired,
      soktForBarn: PropTypes.bool.isRequired,
    })),
    navn: PropTypes.string,
    fodselsdato: PropTypes.string,
    fnr: PropTypes.string,
    navBrukerKjonn: kodeverkObjektPropType.isRequired,
    diskresjonskode: kodeverkObjektPropType,
    personstatus: kodeverkObjektPropType.isRequired,
    avklartPersonstatus: PropTypes.shape({
      overstyrtPersonstatus: kodeverkObjektPropType,
    }),
    dodsdato: PropTypes.string,
    harVerge: PropTypes.bool.isRequired,
    adresser: PropTypes.arrayOf(PropTypes.shape({
      adresseType: kodeverkObjektPropType.isRequired,
      adresselinje1: PropTypes.string.isRequired,
      adresselinje2: PropTypes.string,
      adresselinje3: PropTypes.string,
      land: PropTypes.string.isRequired,
    })),
  }),
});

export default personPersonopplysningerPropType;
