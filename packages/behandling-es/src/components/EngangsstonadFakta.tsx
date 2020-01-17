import React, {
  FunctionComponent, useMemo, useCallback, useEffect,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, Behandling, FaktaPanel, Kodeverk, NavAnsatt, DataFetcherBehandlingDataV2, faktaPanelUtils,
} from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import esBehandlingApi from '../data/esBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaEsPanelDefinisjoner';
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

const EngangsstonadFakta: FunctionComponent<OwnProps> = ({
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
}) => {
  const {
    aksjonspunkter, soknad, vilkar, personopplysninger, inntektArbeidYtelse,
  } = data;
  const intl = useIntl();
  const dispatch = useDispatch();

  const esPanelerData = {
    fagsak, behandling, soknad, vilkar, personopplysninger, inntektArbeidYtelse, hasFetchError,
  };
  const faktaPaneler = useMemo(() => faktaPanelUtils
    .utledFaktaPaneler(faktaPanelDefinisjoner, esPanelerData, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError),
  [behandling.versjon]);

  useEffect(() => {
    const panelMedApentAp = faktaPaneler.find((p) => p.harApneAksjonspunkter);
    if (panelMedApentAp) {
      setApentFaktaPanel({ urlCode: panelMedApentAp.urlCode, textCode: panelMedApentAp.textCode });
    }
  }, [behandling.versjon]);

  const velgFaktaPanelCallback = useCallback((index) => oppdaterProsessStegOgFaktaPanelIUrl(valgtProsessSteg, faktaPaneler[index].urlCode),
    [behandling.versjon, valgtProsessSteg]);
  const bekreftAksjonspunktCallback = useCallback(faktaPanelUtils
    .getBekreftAksjonspunktCallback(dispatch, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, overstyringApCodes, esBehandlingApi),
  [behandling.versjon]);

  const valgtPanel = useMemo(() => faktaPanelUtils.finnValgtPanel(faktaPaneler, valgtFaktaSteg), [behandling.versjon, valgtFaktaSteg]);

  const formaterteFaktaPaneler = useMemo(() => faktaPanelUtils.formaterPanelerForSidemeny(intl, faktaPaneler, valgtPanel.urlCode),
    [behandling.versjon, valgtPanel.urlCode]);

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

export default EngangsstonadFakta;
