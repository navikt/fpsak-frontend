import React from 'react';
import { PropTypes } from 'prop-types';

import { getAddresses } from '@fpsak-frontend/utils';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import opplysningsKilde from '@fpsak-frontend/kodeverk/src/opplysningsKilde';

import AdressePanel from './AdressePanel';
import BarnePanel from './BarnePanel';

const findPersonStatus = (personopplysning) => {
  if (personopplysning.avklartPersonstatus) {
    return personopplysning.avklartPersonstatus.overstyrtPersonstatus;
  }
  return personopplysning.personstatus ? personopplysning.personstatus : undefined;
};

// TODO (TOR) Fjern opplysningskilde
export const getBarnFraTPS = (barneListe = []) => barneListe.filter((barn) => barn.opplysningsKilde === opplysningsKilde.TPS);

/**
 * FullPersonInfo
 *
 * Presentasjonskomponent. Tar inn et personopplysningsobjekt som brukes til å populere adressepanelet og barnepanelet med data som blir vist
 * når NAV-ansatt utvider nedtrekksfanen med personopplysninger.
 */
export const FullPersonInfo = ({
  sprakkode,
  personopplysning,
  isPrimaryParent,
  personstatusTypes,
  sivilstandTypes,
  getKodeverknavn,
}) => {
  if (!personopplysning) {
    return null;
  }
  const adresseListe = getAddresses(personopplysning.adresser);
  const barnFraTPS = getBarnFraTPS(personopplysning.barn);
  const harBarnITPSSjekk = barnFraTPS.length !== 0;
  return (
    <div>
      <AdressePanel
        bostedsadresse={adresseListe[opplysningAdresseType.BOSTEDSADRESSE]}
        postAdresseNorge={adresseListe[opplysningAdresseType.POSTADRESSE]}
        postadresseUtland={adresseListe[opplysningAdresseType.UTENLANDSK_POSTADRESSE]}
        midlertidigAdresse={
          adresseListe[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
            ? adresseListe[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
            : adresseListe[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE]
        }
        personstatus={findPersonStatus(personopplysning)}
        sivilstandtype={personopplysning.sivilstand}
        region={personopplysning.region ? getKodeverknavn(personopplysning.region) : null}
        sprakkode={sprakkode}
        isPrimaryParent={isPrimaryParent}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
      />
      {harBarnITPSSjekk && (
        <BarnePanel barneListe={barnFraTPS} />
      )}
    </div>
  );
};

FullPersonInfo.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  personopplysning: PropTypes.shape({
    adresser: PropTypes.arrayOf(PropTypes.shape({})),
    barn: PropTypes.arrayOf(PropTypes.shape({})),
    sivilstand: PropTypes.shape({}),
    region: PropTypes.shape({}),
  }).isRequired,
  isPrimaryParent: PropTypes.bool.isRequired,
  sivilstandTypes: kodeverkPropType.isRequired,
  personstatusTypes: kodeverkPropType.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default FullPersonInfo;
