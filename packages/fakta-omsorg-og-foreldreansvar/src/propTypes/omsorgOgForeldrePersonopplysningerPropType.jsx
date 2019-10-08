import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const omsorgOgForeldrePersonopplysningerPropType = PropTypes.shape({
  aktoerId: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  dodsdato: PropTypes.string,
  opplysningsKilde: kodeverkObjektPropType.isRequired,
  navBrukerKjonn: kodeverkObjektPropType.isRequired,
  personstatus: kodeverkObjektPropType.isRequired,
  barnSoktFor: PropTypes.arrayOf(PropTypes.shape()),
  adresser: PropTypes.arrayOf(PropTypes.shape({
    adresseType: kodeverkObjektPropType.isRequired,
    adresselinje1: PropTypes.string,
    adresselinje2: PropTypes.string,
    adresselinje3: PropTypes.string,
    land: PropTypes.string,
    postNummer: PropTypes.string,
    poststed: PropTypes.string,
  })),
  avklartPersonstatus: PropTypes.shape({
    overstyrtPersonstatus: kodeverkObjektPropType.isRequired,
  }),
  annenPart: PropTypes.shape(),
});

export default omsorgOgForeldrePersonopplysningerPropType;
