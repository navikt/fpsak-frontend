import React, {
  FunctionComponent, useMemo, useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import {
  FagsakInfo, Behandling, Aksjonspunkt, Vilkar, FaktaPanel, Kodeverk, NavAnsatt, DataFetcherBehandlingDataV2,
  Soknad, Personopplysninger, InntektArbeidYtelse, faktaPanelUtils,
} from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../data/esBehandlingApi';
import faktaPanelDefinisjoner from '../definition/faktaPanelDefinisjoner';

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

const getBekreftFaktaCallback = (dispatch, fagsak, behandling, oppdaterFaktaPanelIUrl) => (aksjonspunkter) => {
  const model = aksjonspunkter.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
    bekreftedeAksjonspunktDtoer: model,
  };

  return dispatch(esBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }))
    .then(() => oppdaterFaktaPanelIUrl('default'));
};

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
  const bekreftAksjonspunktCallback = useCallback(getBekreftFaktaCallback(dispatch, fagsak, behandling, oppdaterFaktaPanelIUrl), [behandling.versjon]);

  const valgtPanel = useMemo(() => faktaPanelUtils.finnValgtPanel(faktaPaneler, valgtFaktaSteg),
    [behandling.versjon, valgtFaktaSteg]);

  const formaterteFaktaPaneler = useMemo(() => faktaPanelUtils.formaterPanelerForSidemeny(intl, faktaPaneler, valgtFaktaSteg),
    [behandling.versjon, valgtFaktaSteg]);

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
