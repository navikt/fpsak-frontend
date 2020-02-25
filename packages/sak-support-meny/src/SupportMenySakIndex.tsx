import React, { FunctionComponent, useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { ReactComponent as FraBeslutterSvg } from '@fpsak-frontend/assets/images/arrow-return.svg';
import { ReactComponent as SendMeldingSvg } from '@fpsak-frontend/assets/images/email-send-1.svg';
import { ReactComponent as DokumenterSvg } from '@fpsak-frontend/assets/images/folder-big.svg';
import { ReactComponent as TilBeslutterSvg } from '@fpsak-frontend/assets/images/person-favorite-star-2.svg';
import { ReactComponent as HistorikkSvg } from '@fpsak-frontend/assets/images/synchronize-time.svg';

import TabMeny from './components/TabMeny';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const getStyle = (isActive, isDisabled) => {
  if (isDisabled) {
    return { fill: '#c6c2bf' };
  }
  if (isActive) {
    return { fill: '#0067c5' };
  }
  return { fill: '#3e3832' };
};

const TIL_BESLUTTER_TAB = {
  getSvg: (isActive, isDisabled, props) => <TilBeslutterSvg {...props} style={getStyle(isActive, isDisabled)} />,
  tooltipTextCode: 'SupportMenySakIndex.Godkjenning',
};
const FRA_BESLUTTER_TAB = {
  getSvg: (isActive, isDisabled, props) => <FraBeslutterSvg {...props} style={getStyle(isActive, isDisabled)} />,
  tooltipTextCode: 'SupportMenySakIndex.FraBeslutter',
};
const HISTORIKK_TAB = {
  getSvg: (isActive, isDisabled, props) => <HistorikkSvg {...props} style={getStyle(isActive, isDisabled)} />,
  tooltipTextCode: 'SupportMenySakIndex.Historikk',
};
const SEND_MELDING_TAB = {
  getSvg: (isActive, isDisabled, props) => <SendMeldingSvg {...props} style={getStyle(isActive, isDisabled)} />,
  tooltipTextCode: 'SupportMenySakIndex.Melding',
};
const DOKUMENTER_TAB = {
  getSvg: (isActive, isDisabled, props) => <DokumenterSvg {...props} style={getStyle(isActive, isDisabled)} />,
  tooltipTextCode: 'SupportMenySakIndex.Dokumenter',
};

const lagTab = (tab, isDisabled) => ({
  getSvg: tab.getSvg,
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
