import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Dispatch } from 'redux';

import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  FagsakInfo, Rettigheter, FaktaPanel, faktaHooks,
} from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { KodeverkMedNavn, Behandling } from '@fpsak-frontend/types';

import esBehandlingApi from '../data/esBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaEsPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_STARTDATO, ac.OVERSTYR_AVKLAR_STARTDATO, ac.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE];

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string}) => void;
  dispatch: Dispatch;
}

const EngangsstonadFakta: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  data,
  fagsak,
  behandling,
  rettigheter,
  alleKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  valgtProsessSteg,
  hasFetchError,
  setApentFaktaPanel,
  dispatch,
}) => {
  const {
    aksjonspunkter, soknad, vilkar, personopplysninger, inntektArbeidYtelse,
  } = data;

  const dataTilUtledingAvEsPaneler = {
    fagsak, behandling, soknad, vilkar, personopplysninger, inntektArbeidYtelse, hasFetchError,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks
    .useFaktaPaneler(faktaPanelDefinisjoner, dataTilUtledingAvEsPaneler, behandling, rettigheter, aksjonspunkter, valgtFaktaSteg, intl);

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks
    .useCallbacks(faktaPaneler, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, overstyringApCodes, esBehandlingApi, dispatch);

  if (sidemenyPaneler.length > 0) {
    return (
      <FaktaPanel paneler={sidemenyPaneler} onClick={velgFaktaPanelCallback}>
        {valgtPanel && (
          <DataFetcher
            key={valgtPanel.getUrlKode()}
            fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
            endpoints={valgtPanel.getPanelDef().getEndepunkter()}
            loadingPanel={<LoadingPanel />}
            render={(dataProps) => valgtPanel.getPanelDef().getKomponent({
              ...dataProps,
              behandling,
              alleKodeverk,
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvEsPaneler, hasFetchError),
            })}
          />
        )}
      </FaktaPanel>
    );
  }
  return null;
};

export default injectIntl(EngangsstonadFakta);
