import React, { FunctionComponent } from 'react';

import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import { FadingPanel } from '@fpsak-frontend/shared-components';

import FagsakInfo from '../types/fagsakInfoTsType';
import Behandling from '../types/behandlingTsType';
import Kodeverk from '../types/kodeverkTsType';
import Aksjonspunkt from '../types/aksjonspunktTsType';
import MargMarkering from './MargMarkering';
import InngangsvilkarPanel from './InngangsvilkarPanel';
import DataFetcherBehandlingDataV2 from '../DataFetcherBehandlingDataV2';
import BehandlingHenlagtPanel from './BehandlingHenlagtPanel';
import ProsessStegIkkeBehandletPanel from './ProsessStegIkkeBehandletPanel';
import prosessStegHooks from '../util/prosessStegHooks';
import ProsessStegData from '../types/prosessStegDataTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  valgtPanel?: {
    urlCode: string;
    erStegBehandlet: boolean;
    aksjonspunkter: Aksjonspunkt[];
    isReadOnly: boolean;
    panelData: ProsessStegData[];
  };
  apentFaktaPanelInfo: any;
  oppdaterProsessStegOgFaktaPanelIUrl: () => void;
  lagringSideeffekterCallback: (aksjonspunktModeller: []) => any;
  behandlingApi: {};
  dispatch: (data: any) => void;
}

const ProsessStegPanel: FunctionComponent<OwnProps> = ({
  valgtPanel = {},
  fagsak,
  behandling,
  alleKodeverk,
  apentFaktaPanelInfo,
  oppdaterProsessStegOgFaktaPanelIUrl,
  lagringSideeffekterCallback,
  behandlingApi,
  dispatch,
}) => {
  const erHenlagtOgVedtakStegValgt = behandling.behandlingHenlagt && valgtPanel.urlCode === bpc.VEDTAK;
  const bekreftAksjonspunktCallback = prosessStegHooks.useBekreftAksjonspunkt(valgtPanel, fagsak, behandling, behandlingApi, lagringSideeffekterCallback,
    dispatch);
  return (
    <>
      {valgtPanel.erStegBehandlet && (
        <MargMarkering
          behandlingStatus={behandling.status}
          aksjonspunkter={valgtPanel.aksjonspunkter}
          isReadOnly={valgtPanel.isReadOnly}
          visAksjonspunktMarkering={valgtPanel.panelData.length === 1}
        >
          {valgtPanel.panelData.length === 1 && (
            <FadingPanel>
              <DataFetcherBehandlingDataV2
                key={valgtPanel.panelData[0].code}
                behandlingVersion={behandling.versjon}
                endpoints={valgtPanel.panelData[0].endpoints}
                render={(dataProps) => valgtPanel.panelData[0].renderComponent({
                  ...dataProps,
                  behandling,
                  alleKodeverk,
                  submitCallback: bekreftAksjonspunktCallback,
                  ...valgtPanel.panelData[0].komponentData,
                })}
              />
            </FadingPanel>
          )}
          {valgtPanel.panelData.length > 1 && (
            <InngangsvilkarPanel
              behandling={behandling}
              alleKodeverk={alleKodeverk}
              prosessStegData={valgtPanel.panelData}
              submitCallback={bekreftAksjonspunktCallback}
              apentFaktaPanelInfo={apentFaktaPanelInfo}
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            />
          )}
        </MargMarkering>
      )}
      {erHenlagtOgVedtakStegValgt && (
        <BehandlingHenlagtPanel />
      )}
      {(valgtPanel.urlCode && !valgtPanel.erStegBehandlet && !erHenlagtOgVedtakStegValgt) && (
        <ProsessStegIkkeBehandletPanel />
      )}
    </>
  );
};

export default ProsessStegPanel;
