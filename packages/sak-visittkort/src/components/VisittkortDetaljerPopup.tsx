import React, { useMemo, FunctionComponent } from 'react';
import { injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { Kodeverk, KodeverkMedNavn, Personopplysninger } from '@fpsak-frontend/types';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer, Tooltip,
} from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { getKodeverknavnFn, getLanguageCodeFromSprakkode, getAddresses } from '@fpsak-frontend/utils';

import styles from './visittkortDetaljerPopup.less';

const borSokerMedBarnet = (adresser, personopplysningerForBarn = []) => personopplysningerForBarn
  .some((barn) => adresser[opplysningAdresseType.BOSTEDSADRESSE] === getAddresses(barn.adresser)[opplysningAdresseType.BOSTEDSADRESSE]);

const findPersonStatus = (personopplysning) => {
  if (personopplysning.avklartPersonstatus) {
    return personopplysning.avklartPersonstatus.overstyrtPersonstatus;
  }
  return personopplysning.personstatus ? personopplysning.personstatus : undefined;
};

interface OwnProps {
  personopplysninger: Personopplysninger;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  sprakkode: Kodeverk;
}

const VisittkortDetaljerPopup: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  personopplysninger,
  alleKodeverk,
  sprakkode,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const adresser = useMemo(() => getAddresses(personopplysninger.adresser), [personopplysninger.adresser]);
  const borMedBarnet = useMemo(() => borSokerMedBarnet(adresser, personopplysninger.barnSoktFor), [personopplysninger]);
  const midlertidigAdresse = adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
    ? adresser[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
    : adresser[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE];

  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          {personopplysninger.region && (
          <FlexColumn>
            <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Statsborgerskap.Hjelpetekst' })} alignBottom>
              <EtikettInfo
                className={styles.etikett}
                typo="undertekst"
              >
                {getKodeverknavn(personopplysninger.region)}
              </EtikettInfo>
            </Tooltip>
          </FlexColumn>
          )}
          <FlexColumn>
            <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Personstatus.Hjelpetekst' })} alignBottom>
              <EtikettInfo
                className={styles.etikett}
                typo="undertekst"
              >
                {getKodeverknavn(findPersonStatus(personopplysninger))}
              </EtikettInfo>
            </Tooltip>
          </FlexColumn>
          {personopplysninger.sivilstand && (
          <FlexColumn>
            <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Sivilstand.Hjelpetekst' })} alignBottom>
              <EtikettInfo
                className={styles.etikett}
                typo="undertekst"
              >
                {getKodeverknavn(personopplysninger.sivilstand)}
              </EtikettInfo>
            </Tooltip>
          </FlexColumn>
          )}
          {borMedBarnet && (
            <FlexColumn>
              <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.BorMedBarnet' })} alignBottom>
                <EtikettInfo
                  className={styles.etikett}
                  typo="undertekst"
                >
                  <FormattedMessage id="VisittkortDetaljerPopup.BorMedBarnet" />
                </EtikettInfo>
              </Tooltip>
            </FlexColumn>
          )}
          <FlexColumn>
            <Tooltip content={intl.formatMessage({ id: 'VisittkortDetaljerPopup.Malform.Beskrivelse' })} alignBottom>
              <EtikettInfo
                className={styles.etikett}
                typo="undertekst"
              >
                <FormattedMessage id={getLanguageCodeFromSprakkode(sprakkode)} />
              </EtikettInfo>
            </Tooltip>
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
