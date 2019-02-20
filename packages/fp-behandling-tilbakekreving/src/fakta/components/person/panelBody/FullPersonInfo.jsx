import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { getAddresses } from '@fpsak-frontend/utils';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import opplysningsKilde from '@fpsak-frontend/kodeverk/src/opplysningsKilde';
import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';
import kodeverkPropType from '@fpsak-frontend/kodeverk/src/kodeverkPropType';

import { AdressePanel, BarnePanel, PersonYtelserTable } from '@fpsak-frontend/person-info';

import PersonArbeidsforholdPanel from './arbeidsforhold/PersonArbeidsforholdPanel';

const findPersonStatus = (personopplysning) => {
  if (personopplysning.avklartPersonstatus) {
    return personopplysning.avklartPersonstatus.overstyrtPersonstatus;
  }
  return personopplysning.personstatus ? personopplysning.personstatus : undefined;
};

export const getBarnFraTPS = barneListe => barneListe.filter(barn => barn.opplysningsKilde.kode === opplysningsKilde.TPS);

/**
 *
 * FullPersonInfo
 *
 * Presentasjonskomponent. Tar inn et personopplysningsobjekt som brukes til å populere adressepanelet og barnepanelet med data som blir vist
 * når NAV-ansatt utvider nedtrekksfanen med personopplysninger.
 *
 */
const FullPersonInfo = ({
  sprakkode,
  personopplysning,
  ytelser,
  relatertYtelseTypes,
  relatertYtelseStatus,
  hasOpenAksjonspunkter,
  hasAksjonspunkter,
  readOnly,
  isPrimaryParent,
  sivilstandTypes,
  personstatusTypes,
}) => {
  if (!personopplysning) {
    return null;
  }
  const adresseListe = getAddresses(personopplysning.adresser);
  const barnFraTPS = getBarnFraTPS(personopplysning.barn);
  const harBarnITPSSjekk = barnFraTPS.length !== 0;

  return (
    <div>
      {isPrimaryParent && hasAksjonspunkter && (
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter && !readOnly}>
          {[<FormattedMessage key="AvklarArbeidsforhold" id="FullPersonInfo.AvklarArbeidsforhold" />]}
        </AksjonspunktHelpText>
      )}
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
        region={personopplysning.region ? personopplysning.region.navn : null}
        sprakkode={sprakkode}
        isPrimaryParent={isPrimaryParent}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
      />
      {harBarnITPSSjekk && <BarnePanel barneListe={barnFraTPS} />}
      {isPrimaryParent && (
        <PersonArbeidsforholdPanel
          readOnly={readOnly}
          hasAksjonspunkter={hasAksjonspunkter}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        />
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

FullPersonInfo.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  personopplysning: PropTypes.shape({}).isRequired,
  ytelser: PropTypes.arrayOf(PropTypes.shape({})),
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  relatertYtelseStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasAksjonspunkter: PropTypes.bool.isRequired,
  isPrimaryParent: PropTypes.bool.isRequired,
  sivilstandTypes: kodeverkPropType.isRequired,
  personstatusTypes: kodeverkPropType.isRequired,
};

FullPersonInfo.defaultProps = {
  ytelser: undefined,
};

export default FullPersonInfo;
