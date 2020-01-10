import React, {
  FunctionComponent, useMemo, useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, FaktaPanel, Kodeverk, NavAnsatt, DataFetcherBehandlingDataV2, faktaPanelUtils,
} from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import fpBehandlingApi from '../data/fpBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_STARTDATO];

interface OwnProps {
  data: FetchedData;
  fagsak: FagsakInfo;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  hasFetchError: boolean;
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  valgtFaktaSteg?: string;
}

const EngangsstonadFakta: FunctionComponent<OwnProps> = ({
  data,
  fagsak,
  navAnsatt,
  alleKodeverk,
  oppdaterFaktaPanelIUrl,
  valgtFaktaSteg,
  hasFetchError,
}) => {
  const {
    behandling, aksjonspunkter, soknad, vilkar, personopplysninger, inntektArbeidYtelse, ytelsefordeling,
  } = data;
  const intl = useIntl();
  const dispatch = useDispatch();

  const fpPanelerData = {
    fagsak, behandling, soknad, vilkar, personopplysninger, inntektArbeidYtelse, ytelsefordeling, hasFetchError,
  };
  const faktaPaneler = useMemo(() => faktaPanelUtils
    .utledFaktaPaneler(faktaPanelDefinisjoner, fpPanelerData, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError),
  [behandling.versjon]);

  const velgFaktaPanelCallback = useCallback((index) => oppdaterFaktaPanelIUrl(faktaPaneler[index].urlCode), [behandling.versjon]);
  const bekreftAksjonspunktCallback = useCallback(faktaPanelUtils
    .getBekreftAksjonspunktCallback(dispatch, fagsak, behandling, oppdaterFaktaPanelIUrl, overstyringApCodes, fpBehandlingApi),
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
          alleKodeverk,
          submitCallback: bekreftAksjonspunktCallback,
          ...valgtPanel.komponentData,
        })}
      />
    </FaktaPanel>
  );
};

export default EngangsstonadFakta;
