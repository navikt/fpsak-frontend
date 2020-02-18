import React, { useMemo } from 'react';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { getLanguageCodeFromSprakkode, getAddresses } from '@fpsak-frontend/utils';

import styles from './visittkortDetaljerPopup.less';

const borSokerMedBarnet = (adresser, personopplysningerForBarn = []) => personopplysningerForBarn
  .some((barn) => adresser[opplysningAdresseType.BOSTEDSADRESSE] === getAddresses(barn.adresser)[opplysningAdresseType.BOSTEDSADRESSE]);

const VisittkortDetaljerPopup = ({
  intl,
  personopplysninger,
  alleKodeverk,
  sprakkode,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const adresser = useMemo(() => getAddresses(personopplysninger.adresser), [personopplysninger.adresser]);
  const borMedBarnet = useMemo(() => borSokerMedBarnet(adresser, personopplysninger.barn), [personopplysninger]);
  const midlertidigAdresse = adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
    ? adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
    : adresser[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE];

  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          {personopplysninger.region && (
          <FlexColumn>
            <EtikettInfo
              className={styles.etikett}
              typo="undertekst"
              title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Statsborgerskap.Hjelpetekst' })}
            >
              {getKodeverknavn(personopplysninger.region)}
            </EtikettInfo>
          </FlexColumn>
          )}
          <FlexColumn>
            <EtikettInfo
              className={styles.etikett}
              typo="undertekst"
              title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Personstatus.Hjelpetekst' })}
            >
              {getKodeverknavn(personopplysninger.personstatus)}
            </EtikettInfo>
          </FlexColumn>
          {personopplysninger.sivilstand && (
          <FlexColumn>
            <EtikettInfo
              className={styles.etikett}
              typo="undertekst"
              title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Sivilstand.Hjelpetekst' })}
            >
              {getKodeverknavn(personopplysninger.sivilstand)}
            </EtikettInfo>
          </FlexColumn>
          )}
          {borMedBarnet && (
            <FlexColumn>
              <EtikettInfo
                className={styles.etikett}
                typo="undertekst"
                title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.BorMedBarnet' })}
              >
                <FormattedMessage id="VisittkortDetaljerPopup.BorMedBarnet" />
              </EtikettInfo>
            </FlexColumn>
          )}
          <FlexColumn>
            <EtikettInfo
              className={styles.etikett}
              typo="undertekst"
              title={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Malform.Beskrivelse' })}
            >
              <FormattedMessage id={getLanguageCodeFromSprakkode(sprakkode)} />
            </EtikettInfo>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.bostedsadresse" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>
              {adresser[opplysningAdresseType.BOSTEDSADRESSE] || '-'}
            </Element>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.postadresseNorge" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>
              {adresser[opplysningAdresseType.POSTADRESSE] || '-'}
            </Element>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.midlertidigAdresse" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>
              {midlertidigAdresse || '-'}
            </Element>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn className={styles.labels}>
            <Normaltekst>
              <FormattedMessage id="VisittkortDetaljerPopup.AdressePanel.postadresseUtland" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Element>
              {adresser[opplysningAdresseType.UTENLANDSK_POSTADRESSE] || '-'}
            </Element>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default injectIntl(VisittkortDetaljerPopup);
