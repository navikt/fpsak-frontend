import React, { FunctionComponent } from 'react';
import { Dispatch } from 'redux';

import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import { FadingPanel, LoadingPanel } from '@fpsak-frontend/shared-components';
import { Behandling, KodeverkMedNavn } from '@fpsak-frontend/types';
import { DataFetcher, DataFetcherTriggers, EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import FagsakInfo from '../types/fagsakInfoTsType';
import MargMarkering from './MargMarkering';
import InngangsvilkarPanel from './InngangsvilkarPanel';

import BehandlingHenlagtPanel from './BehandlingHenlagtPanel';
import ProsessStegIkkeBehandletPanel from './ProsessStegIkkeBehandletPanel';
import prosessStegHooks from '../util/prosessSteg/prosessStegHooks';
import { ProsessStegUtledet } from '../util/prosessSteg/ProsessStegUtledet';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  valgtProsessSteg?: ProsessStegUtledet;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string};
  oppdaterProsessStegOgFaktaPanelIUrl?: (punktnavn?: string, faktanavn?: string) => void;
  lagringSideeffekterCallback: (aksjonspunktModeller: [{ kode: string; isVedtakSubmission?: boolean; sendVarsel?: boolean }]) => any;
  behandlingApi: {[name: string]: EndpointOperations};
  dispatch: Dispatch;
}

const ProsessStegPanel: FunctionComponent<OwnProps> = ({
  valgtProsessSteg,
  fagsak,
  behandling,
  alleKodeverk,
  apentFaktaPanelInfo,
  oppdaterProsessStegOgFaktaPanelIUrl,
  lagringSideeffekterCallback,
  behandlingApi,
  dispatch,
}) => {
  const erHenlagtOgVedtakStegValgt = behandling.behandlingHenlagt && valgtProsessSteg && valgtProsessSteg.getUrlKode() === prosessStegCodes.VEDTAK;
  if (erHenlagtOgVedtakStegValgt) {
    return <BehandlingHenlagtPanel />;
  }
  if (!valgtProsessSteg) {
    return null;
  }
  if (!valgtProsessSteg.getErStegBehandlet() && valgtProsessSteg.getUrlKode()) {
    return <ProsessStegIkkeBehandletPanel />;
  }

  const bekreftAksjonspunktCallback = prosessStegHooks.useBekreftAksjonspunkt(fagsak, behandling, behandlingApi, lagringSideeffekterCallback,
    dispatch, valgtProsessSteg);

  const delPaneler = valgtProsessSteg.getDelPaneler();

  return (
    <>
      {valgtProsessSteg.getErStegBehandlet() && (
        <MargMarkering
          behandlingStatus={behandling.status}
          aksjonspunkter={valgtProsessSteg.getAksjonspunkter()}
          isReadOnly={valgtProsessSteg.getErReadOnly()}
          visAksjonspunktMarkering={delPaneler.length === 1}
        >
          {delPaneler.length === 1 && (
            <FadingPanel>
              <DataFetcher
                key={valgtProsessSteg.getUrlKode()}
                fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
                endpoints={delPaneler[0].getProsessStegDelPanelDef().getEndepunkter()}
                loadingPanel={<LoadingPanel />}
                render={(dataProps) => delPaneler[0].getProsessStegDelPanelDef().getKomponent({
                  ...dataProps,
                  behandling,
                  alleKodeverk,
                  submitCallback: bekreftAksjonspunktCallback,
                  ...delPaneler[0].getKomponentData(),
                })}
              />
            </FadingPanel>
          )}
          {delPaneler.length > 1 && (
            <InngangsvilkarPanel
              behandling={behandling}
              alleKodeverk={alleKodeverk}
              prosessStegData={delPaneler}
              submitCallback={bekreftAksjonspunktCallback}
              apentFaktaPanelInfo={apentFaktaPanelInfo}
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            />
          )}
        </MargMarkering>
      )}
    </>
  );
};

export default ProsessStegPanel;
