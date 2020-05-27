import React, { FunctionComponent } from 'react';
import { Dispatch } from 'redux';

import { injectIntl, WrappedComponentProps } from 'react-intl';
import {
  FagsakInfo, FaktaPanel, DataFetcherBehandlingData, DataFetcherTriggers, faktaHooks, Rettigheter,
} from '@fpsak-frontend/behandling-felles';
import { KodeverkMedNavn, Behandling } from '@fpsak-frontend/types';

import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaTilbakekrevingPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [];

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  fpsakKodeverk: {[key: string]: KodeverkMedNavn[]};
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  dispatch: Dispatch;
}

const TilbakekrevingFakta: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  data,
  fagsak,
  behandling,
  rettigheter,
  alleKodeverk,
  fpsakKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  hasFetchError,
  dispatch,
}) => {
  const {
    aksjonspunkter, perioderForeldelse, beregningsresultat, feilutbetalingFakta,
  } = data;

  const dataTilUtledingAvTilbakekrevingPaneler = {
    fagsak, behandling, perioderForeldelse, beregningsresultat, feilutbetalingFakta, fpsakKodeverk,
  };

  const [faktaPaneler, valgtPanel, formaterteFaktaPaneler] = faktaHooks.useFaktaPaneler(faktaPanelDefinisjoner, dataTilUtledingAvTilbakekrevingPaneler,
<<<<<<< HEAD
    behandling, rettigheter, aksjonspunkter, hasFetchError, valgtFaktaSteg, intl);
=======
    behandling, rettigheter, aksjonspunkter, 'default', intl);
>>>>>>> FIX div

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks
    .useCallbacks(faktaPaneler, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, 'default', overstyringApCodes, tilbakekrevingApi, dispatch);

  if (valgtPanel) {
    return (
      <FaktaPanel paneler={formaterteFaktaPaneler} onClick={velgFaktaPanelCallback}>
        <DataFetcherBehandlingData
          key={valgtPanel.getUrlKode()}
          fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
          endpoints={valgtPanel.getPanelDef().getEndepunkter()}
          render={(dataProps) => valgtPanel.getPanelDef().getKomponent({
            ...dataProps,
            behandling,
            alleKodeverk,
            fpsakKodeverk,
            submitCallback: bekreftAksjonspunktCallback,
            ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvTilbakekrevingPaneler, hasFetchError),
          })}
        />
      </FaktaPanel>
    );
  }
  return null;
};

export default injectIntl(TilbakekrevingFakta);
