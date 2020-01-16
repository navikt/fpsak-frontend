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
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  setApentFaktaAksjonspunkt: (erApApent: boolean) => void;
}

const EngangsstonadFakta: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  behandling,
  navAnsatt,
  alleKodeverk,
  oppdaterFaktaPanelIUrl,
  valgtFaktaSteg,
  hasFetchError,
  setApentFaktaAksjonspunkt,
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
    setApentFaktaAksjonspunkt(faktaPaneler.some((p) => p.harApneAksjonspunkter));
  }, [faktaPaneler]);

  const velgFaktaPanelCallback = useCallback((index) => oppdaterFaktaPanelIUrl(faktaPaneler[index].urlCode), [behandling.versjon]);
  const bekreftAksjonspunktCallback = useCallback(faktaPanelUtils
    .getBekreftAksjonspunktCallback(dispatch, fagsak, behandling, oppdaterFaktaPanelIUrl, overstyringApCodes, esBehandlingApi),
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
