import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import getAddresses from 'utils/personUtils';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import opplysningsKilde from 'kodeverk/opplysningsKilde';
import AdressePanel from './AdressePanel';
import Barnepanel from './Barnepanel';
import PersonYtelserTable from './PersonYtelserTable';
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
}) => {
  if (!personopplysning) {
    return null;
  }
  const adresseListe = getAddresses(personopplysning.adresser);
  const barnFraTPS = getBarnFraTPS(personopplysning.barn);
  const harBarnITPSSjekk = barnFraTPS.length !== 0;

  return (
    <div>
      {isPrimaryParent && hasAksjonspunkter
      && (
      <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter && !readOnly}>
        {[<FormattedMessage key="AvklarArbeidsforhold" id="FullPersonInfo.AvklarArbeidsforhold" />]}
      </AksjonspunktHelpText>
      )
      }
      <AdressePanel
        bostedsadresse={adresseListe[opplysningAdresseType.BOSTEDSADRESSE]}
        postAdresseNorge={adresseListe[opplysningAdresseType.POSTADRESSE]}
        postadresseUtland={adresseListe[opplysningAdresseType.UTENLANDSK_POSTADRESSE]}
        midlertidigAdresse={adresseListe[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
          ? adresseListe[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
          : adresseListe[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE]}
        personstatus={findPersonStatus(personopplysning)}
        sivilstandtype={personopplysning.sivilstand}
        region={personopplysning.region ? personopplysning.region.navn : null}
        sprakkode={sprakkode}
        isPrimaryParent={isPrimaryParent}
      />
      {harBarnITPSSjekk
        && <Barnepanel barneListe={barnFraTPS} />
      }
      {isPrimaryParent
      && (
      <PersonArbeidsforholdPanel
        readOnly={readOnly}
        hasAksjonspunkter={hasAksjonspunkter}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      />
      )
      }
      {ytelser && ytelser.length > 0
        && (
        <PersonYtelserTable
          ytelser={ytelser}
          relatertYtelseTypes={relatertYtelseTypes}
          relatertYtelseStatus={relatertYtelseStatus}
        />
        )
      }
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
};

FullPersonInfo.defaultProps = {
  ytelser: undefined,
};

export default FullPersonInfo;
