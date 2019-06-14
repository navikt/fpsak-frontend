import React from 'react';
import { PropTypes } from 'prop-types';

import { getAddresses } from '@fpsak-frontend/utils';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import { AdressePanel, BarnePanel, PersonYtelserTable } from '@fpsak-frontend/person-info';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import { Utland } from './utland/Utland';

const findPersonStatus = (personopplysning) => {
  if (personopplysning.avklartPersonstatus) {
    return personopplysning.avklartPersonstatus.overstyrtPersonstatus;
  }
  return personopplysning.personstatus ? personopplysning.personstatus : undefined;
};

/**
 *
 * FullPersonInfo
 *
 * Presentasjonskomponent. Tar inn et personopplysningsobjekt som brukes til å populere adressepanelet og barnepanelet med data som blir vist
 * når NAV-ansatt utvider nedtrekksfanen med personopplysninger.
 *
 */
export const FullPersonInfoImpl = ({
  sprakkode,
  personopplysning,
  ytelser,
  relatertYtelseTypes,
  relatertYtelseStatus,
  utlandSakstype,
  submitCallback,
  isPrimaryParent,
  personstatusTypes,
  sivilstandTypes,
  getKodeverknavn,
  regBarn,
}) => {
  if (!personopplysning) {
    return null;
  }
  const adresseListe = getAddresses(personopplysning.adresser);
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
      >
        <Utland
          initialValue={utlandSakstype}
          submitCallback={submitCallback}
        />
      </AdressePanel>
      { regBarn && regBarn.length > 0 && (
        <BarnePanel barneListe={regBarn} />
      )}
      {ytelser && ytelser.length > 0 && (
        <FaktaGruppe titleCode="PersonYtelserTable.Ytelser">
          <PersonYtelserTable
            ytelser={ytelser}
            relatertYtelseTypes={relatertYtelseTypes}
            relatertYtelseStatus={relatertYtelseStatus}
          />
        </FaktaGruppe>
      )}
    </div>
  );
};

FullPersonInfoImpl.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  personopplysning: PropTypes.shape({}).isRequired,
  ytelser: PropTypes.arrayOf(PropTypes.shape({})),
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  relatertYtelseStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  regBarn: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func,
  utlandSakstype: PropTypes.string.isRequired,
  isPrimaryParent: PropTypes.bool.isRequired,
  sivilstandTypes: kodeverkPropType.isRequired,
  personstatusTypes: kodeverkPropType.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

FullPersonInfoImpl.defaultProps = {
  ytelser: undefined,
  submitCallback: undefined,
};

export default injectKodeverk(getAlleKodeverk)(FullPersonInfoImpl);
