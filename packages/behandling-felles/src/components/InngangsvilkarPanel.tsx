import React, { FunctionComponent, useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import { FadingPanel, VerticalSpacer, AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Behandling, Kodeverk } from '@fpsak-frontend/types';

import { ProsessStegPanelData } from '../types/prosessStegDataTsType';
import DataFetcherBehandlingDataV2 from '../DataFetcherBehandlingDataV2';

import styles from './inngangsvilkarPanel.less';

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  prosessStegData: ProsessStegPanelData[];
  submitCallback: (data: {}) => Promise<any>;
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

  const erIkkeFerdigbehandlet = useMemo(() => filteredPanels.some((p) => p.status === vilkarUtfallType.IKKE_VURDERT), [behandling.versjon]);

  return (
    <FadingPanel>
      {((apentFaktaPanelInfo && erIkkeFerdigbehandlet) || aksjonspunktTekstKoder.length > 0) && (
        <>
          <AksjonspunktHelpTextHTML>
            {apentFaktaPanelInfo && erIkkeFerdigbehandlet
              ? [
                <>
                  <FormattedMessage id="InngangsvilkarPanel.AvventerAvklaringAv" />
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
          {panels.filter((_panel, index) => index < 2)
            .map((panel, index) => (
              <div key={panel.key} className={index === 0 ? styles.panelLeftTop : styles.panelLeftBottom}>
                {panel}
              </div>
            ))}
        </Column>
        <Column xs="6">
          {panels.filter((_panel, index) => index > 1)
            .map((panel, index) => (
              <div key={panel.key} className={index === 0 ? styles.panelRightTop : styles.panelRightBottom}>
                {panel}
              </div>
            ))}
        </Column>
      </Row>
    </FadingPanel>
  );
};

export default InngangsvilkarPanel;
