import React, { FunctionComponent } from 'react';

import {
  FagsakInfo, Behandling, FaktaPanel, Kodeverk, NavAnsatt, DataFetcherBehandlingDataV2, faktaHooks,
} from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import fpBehandlingApi from '../data/fpBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaFpPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_STARTDATO];

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
}

const ForeldrepengerFakta: FunctionComponent<OwnProps> = ({
  data,
  behandling,
  fagsak,
  navAnsatt,
  alleKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  valgtProsessSteg,
  hasFetchError,
  setApentFaktaPanel,
}) => {
  const {
    aksjonspunkter, soknad, vilkar, personopplysninger, inntektArbeidYtelse, ytelsefordeling, beregningsgrunnlag,
  } = data;

  const dataTilUtledingAvFpPaneler = {
    fagsak, behandling, soknad, vilkar, personopplysninger, inntektArbeidYtelse, ytelsefordeling, beregningsgrunnlag, hasFetchError,
  };

  const [faktaPaneler, valgtPanel, formaterteFaktaPaneler] = faktaHooks
    .useFaktaPaneler(faktaPanelDefinisjoner, dataTilUtledingAvFpPaneler, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError, valgtFaktaSteg);

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks
    .useCallbacks(faktaPaneler, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg, overstyringApCodes, fpBehandlingApi);

  return (
    <FaktaPanel paneler={formaterteFaktaPaneler} onClick={velgFaktaPanelCallback}>
      <DataFetcherBehandlingDataV2
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
};

export default ForeldrepengerFakta;
