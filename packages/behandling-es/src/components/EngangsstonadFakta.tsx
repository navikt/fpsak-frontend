import React, {
  FunctionComponent, useMemo, useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, Behandling, Aksjonspunkt, Vilkar, FaktaPanel, Kodeverk, NavAnsatt, DataFetcherBehandlingDataV2,
  Soknad, Personopplysninger, InntektArbeidYtelse, faktaPanelUtils,
} from '@fpsak-frontend/behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import esBehandlingApi from '../data/esBehandlingApi';
import faktaPanelDefinisjoner from '../definition/faktaPanelDefinisjoner';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_STARTDATO];

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  soknad: Soknad;
  personopplysninger: Personopplysninger;
  inntektArbeidYtelse: InntektArbeidYtelse;
  alleKodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  hasFetchError: boolean;
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  valgtFaktaSteg?: string;
}

const EngangsstonadFakta: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  soknad,
  personopplysninger,
  navAnsatt,
  inntektArbeidYtelse,
  alleKodeverk,
  oppdaterFaktaPanelIUrl,
  valgtFaktaSteg,
  hasFetchError,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const esPanelerData = {
    fagsak, behandling, soknad, vilkar, personopplysninger, inntektArbeidYtelse, hasFetchError,
  };
  const faktaPaneler = useMemo(() => faktaPanelUtils
    .utledFaktaPaneler(faktaPanelDefinisjoner, esPanelerData, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError),
  [behandling.versjon]);

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
          alleKodeverk,
          submitCallback: bekreftAksjonspunktCallback,
          ...valgtPanel.componentData,
        })}
      />
    </FaktaPanel>
  );
};

export default EngangsstonadFakta;
