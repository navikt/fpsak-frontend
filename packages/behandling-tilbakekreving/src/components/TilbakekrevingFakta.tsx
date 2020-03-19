import React, { FunctionComponent } from 'react';
import { Dispatch } from 'redux';

import { injectIntl, WrappedComponentProps } from 'react-intl';
import {
  FagsakInfo, FaktaPanel, DataFetcherBehandlingData, faktaHooks, Rettigheter,
} from '@fpsak-frontend/behandling-felles';
import { Kodeverk, Behandling } from '@fpsak-frontend/types';

import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaTilbakekrevingPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [];

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  fpsakKodeverk: {[key: string]: Kodeverk[]};
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
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
    behandling, rettigheter, aksjonspunkter, hasFetchError, 'default', intl);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks
    .useCallbacks(faktaPaneler, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, 'default', overstyringApCodes, tilbakekrevingApi, dispatch);

  if (valgtPanel) {
    return (
      <FaktaPanel paneler={formaterteFaktaPaneler} onClick={velgFaktaPanelCallback}>
        <DataFetcherBehandlingData
          key={valgtPanel.urlCode}
          behandlingVersion={behandling.versjon}
          endpoints={valgtPanel.endpoints}
          render={(dataProps) => valgtPanel.renderComponent({
            ...dataProps,
            behandling,
            alleKodeverk,
            fpsakKodeverk,
            submitCallback: bekreftAksjonspunktCallback,
            ...valgtPanel.komponentData,
          })}
        />
      </FaktaPanel>
    );
  }
  return null;
};

export default injectIntl(TilbakekrevingFakta);
