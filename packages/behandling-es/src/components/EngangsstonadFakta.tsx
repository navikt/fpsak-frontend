import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Dispatch } from 'redux';

import {
  FagsakInfo, FaktaPanel, DataFetcherBehandlingData, faktaHooks,
} from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  Kodeverk, NavAnsatt, Behandling,
} from '@fpsak-frontend/types';

import esBehandlingApi from '../data/esBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaEsPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_STARTDATO, ac.OVERSTYR_AVKLAR_STARTDATO, ac.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE];

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
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
  navAnsatt,
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

  const [faktaPaneler, valgtPanel, formaterteFaktaPaneler] = faktaHooks
    .useFaktaPaneler(faktaPanelDefinisjoner, dataTilUtledingAvEsPaneler, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError, valgtFaktaSteg, intl);

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks
    .useCallbacks(faktaPaneler, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, overstyringApCodes, esBehandlingApi, dispatch);

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
            submitCallback: bekreftAksjonspunktCallback,
            ...valgtPanel.komponentData,
          })}
        />
      </FaktaPanel>
    );
  }
  return null;
};

export default injectIntl(EngangsstonadFakta);
