import React from 'react';
import { injectIntl } from 'react-intl';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Undertekst } from 'nav-frontend-typografi';

import {
  FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { getLanguageCodeFromSprakkode, getAddresses } from '@fpsak-frontend/utils';

const VisittkortDetaljerPopup = ({
  intl,
  personopplysninger,
  alleKodeverk,
  sprakkode,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const adresser = getAddresses(personopplysninger.adresser);

  return (
    <FlexContainer>
      <FlexRow>
        {personopplysninger.region && (
          <FlexColumn>
            <EtikettInfo
              typo="undertekst"
              title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Statsborgerskap.Hjelpetekst' })}
            >
              {getKodeverknavn(personopplysninger.region)}
            </EtikettInfo>
          </FlexColumn>
        )}
        <FlexColumn>
          <EtikettInfo
            typo="undertekst"
            title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Personstatus.Hjelpetekst' })}
          >
            {getKodeverknavn(personopplysninger.personstatus)}
          </EtikettInfo>
        </FlexColumn>
        {personopplysninger.sivilstand && (
          <FlexColumn>
            <EtikettInfo
              typo="undertekst"
              title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Sivilstand.Hjelpetekst' })}
            >
              {getKodeverknavn(personopplysninger.sivilstand)}
            </EtikettInfo>
          </FlexColumn>
        )}
        <FlexColumn>
          <EtikettInfo
            typo="undertekst"
            title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Malform.Beskrivelse' })}
          >
            {intl.formatMessage({ id: getLanguageCodeFromSprakkode(sprakkode) })}
          </EtikettInfo>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Undertekst>
            {intl.formatMessage({ id: 'VisittkortDetaljerPopup.AdressePanel.bostedsadresse' })}
          </Undertekst>
        </FlexColumn>
        <FlexColumn>
          {adresser[opplysningAdresseType.BOSTEDSADRESSE]}
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Undertekst>
            {intl.formatMessage({ id: 'VisittkortDetaljerPopup.AdressePanel.postadresseNorge' })}
          </Undertekst>
        </FlexColumn>
        <FlexColumn>
          {adresser[opplysningAdresseType.POSTADRESSE]}
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Undertekst>
            {intl.formatMessage({ id: 'VisittkortDetaljerPopup.AdressePanel.midlertidigAdresse' })}
          </Undertekst>
        </FlexColumn>
        <FlexColumn>
          {adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
            ? adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
            : adresser[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE]}
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Undertekst>
            {intl.formatMessage({ id: 'VisittkortDetaljerPopup.AdressePanel.postadresseUtland' })}
          </Undertekst>
        </FlexColumn>
        <FlexColumn>
          {adresser[opplysningAdresseType.UTENLANDSK_POSTADRESSE]}
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  );
};

export default injectIntl(VisittkortDetaljerPopup);
