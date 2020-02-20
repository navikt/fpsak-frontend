import React, { FunctionComponent, useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import arrowReturnImageUrl from '@fpsak-frontend/assets/images/arrow-return.svg';
import emailSendImageUrl from '@fpsak-frontend/assets/images/email-send-1.svg';
import folderBigImageUrl from '@fpsak-frontend/assets/images/folder-big.svg';
import personFavoriteStarImageUrl from '@fpsak-frontend/assets/images/person-favorite-star-2.svg';
import synchronizeTimerImageUrl from '@fpsak-frontend/assets/images/synchronize-time.svg';

import TabMeny from './components/TabMeny';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const TIL_BESLUTTER_TAB = {
  image: personFavoriteStarImageUrl,
  tooltipTextCode: 'SupportMenySakIndex.Godkjenning',
};
const FRA_BESLUTTER_TAB = {
  image: arrowReturnImageUrl,
  tooltipTextCode: 'SupportMenySakIndex.FraBeslutter',
};
const HISTORIKK_TAB = {
  image: synchronizeTimerImageUrl,
  tooltipTextCode: 'SupportMenySakIndex.Historikk',
};
const SEND_MELDING_TAB = {
  image: emailSendImageUrl,
  tooltipTextCode: 'SupportMenySakIndex.Melding',
};
const DOKUMENTER_TAB = {
  image: folderBigImageUrl,
  tooltipTextCode: 'SupportMenySakIndex.Dokumenter',
};

const lagTab = (tab, isDisabled) => ({
  image: tab.image,
  tooltip: intl.formatMessage({ id: tab.tooltipTextCode }),
  isDisabled,
});

const lagTabs = (erTilBeslutter, erFraBeslutter, erSendMeldingAktiv, valgtIndex) => {
  const tabs = [];
  if (erTilBeslutter) {
    tabs.push(lagTab(TIL_BESLUTTER_TAB, false));
  }
  if (erFraBeslutter) {
    tabs.push(lagTab(FRA_BESLUTTER_TAB, false));
  }
  tabs.push(lagTab(HISTORIKK_TAB, false));
  tabs.push(lagTab(SEND_MELDING_TAB, erSendMeldingAktiv));
  tabs.push(lagTab(DOKUMENTER_TAB, false));
  return tabs.map((tab, index) => ({
    ...tab,
    isActive: index === valgtIndex,
  }));
};

interface OwnProps {
  erTilBeslutter: boolean;
  erFraBeslutter: boolean;
  erSendMeldingAktiv: boolean;
  valgtIndex: number;
  onClick: (index: number) => void;
}

const SupportMenySakIndex: FunctionComponent<OwnProps> = ({
  erTilBeslutter,
  erFraBeslutter,
  erSendMeldingAktiv,
  valgtIndex,
  onClick,
}) => {
  const tabs = useMemo(() => lagTabs(erTilBeslutter, erFraBeslutter, erSendMeldingAktiv, valgtIndex),
    [erTilBeslutter, erFraBeslutter, erSendMeldingAktiv, erSendMeldingAktiv, valgtIndex]);

  return (
    <RawIntlProvider value={intl}>
      <TabMeny
        tabs={tabs}
        onClick={onClick}
      />
    </RawIntlProvider>
  );
};

export default SupportMenySakIndex;
