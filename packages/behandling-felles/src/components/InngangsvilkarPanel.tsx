import React, { FunctionComponent, useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import { FadingPanel, VerticalSpacer, AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';

import Kodeverk from '../types/kodeverkTsType';
import Behandling from '../types/behandlingTsType';
import DataFetcherBehandlingDataV2 from '../DataFetcherBehandlingDataV2';

import styles from './inngangsvilkarPanel.less';

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  prosessStegData: any;
  submitCallback: (data: {}) => void;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string};
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
}

const InngangsvilkarPanel: FunctionComponent<OwnProps> = ({
  behandling,
  alleKodeverk,
  prosessStegData,
  submitCallback,
  apentFaktaPanelInfo,
  oppdaterProsessStegOgFaktaPanelIUrl,
}) => {
  const filteredPanels = prosessStegData.filter((stegData) => stegData.renderComponent);
  const panels = filteredPanels.map((stegData) => (
    <DataFetcherBehandlingDataV2
      key={stegData.code}
      behandlingVersion={behandling.versjon}
      endpoints={stegData.endpoints}
      render={(dataProps) => stegData.renderComponent({
        ...dataProps,
        behandling,
        alleKodeverk,
        submitCallback,
        ...stegData.komponentData,
      })}
    />
  ));

  const aksjonspunktTekstKoder = useMemo(() => filteredPanels
    .filter((p) => p.isAksjonspunktOpen && p.aksjonspunktHelpTextCodes.length > 0)
    .reduce((acc, p) => [...acc, p.aksjonspunktHelpTextCodes], []),
  [filteredPanels]);

  const oppdaterUrl = useCallback((evt) => {
    oppdaterProsessStegOgFaktaPanelIUrl(undefined, apentFaktaPanelInfo.urlCode);
    evt.preventDefault();
  }, [apentFaktaPanelInfo]);

  return (
    <FadingPanel>
      {(apentFaktaPanelInfo || aksjonspunktTekstKoder.length > 0) && (
        <>
          <AksjonspunktHelpTextHTML>
            {apentFaktaPanelInfo
              ? [
                <>
                  <FormattedMessage id="MultipleProcessPanel.AvventerAvklaringAv" />
                  <a href="" onClick={oppdaterUrl}><FormattedMessage id={apentFaktaPanelInfo.textCode} /></a>
                </>,
              ]
              : aksjonspunktTekstKoder.map((kode) => <FormattedMessage key={kode} id={kode} />)}
          </AksjonspunktHelpTextHTML>
          <VerticalSpacer thirtyTwoPx />
        </>
      )}
      <Row className="">
        <Column xs="6">
          {panels.filter((_p, index) => index < 2)
            .map((p, index) => (
              <div key={p.key} className={index === 0 ? styles.panelLeftTop : styles.panelLeftBottom}>
                {p}
              </div>
            ))}
        </Column>
        <Column xs="6">
          {panels.filter((_p, index) => index > 1)
            .map((p, index) => (
              <div key={p.key} className={index === 0 ? styles.panelRightTop : styles.panelRightBottom}>
                {p}
              </div>
            ))}
        </Column>
      </Row>
    </FadingPanel>
  );
};

export default InngangsvilkarPanel;
