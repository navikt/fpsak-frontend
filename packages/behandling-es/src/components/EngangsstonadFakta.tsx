import React, {
  FunctionComponent, useMemo, useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  FagsakInfo, Behandling, Aksjonspunkt, Vilkar, FaktaPanel, Kodeverk, NavAnsatt, DataFetcherBehandlingDataV2,
  Soknad, Personopplysninger, InntektArbeidYtelse, getAlleMerknaderFraBeslutter, erReadOnly,
} from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../data/esBehandlingApi';
import faktaPaneler from '../definition/faktaPaneler';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  soknad: Soknad;
  personopplysninger: Personopplysninger;
  inntektArbeidYtelse: InntektArbeidYtelse;
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  hasFetchError: boolean;
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  valgtFaktaSteg?: string;
}

const utledFaktaPanelInfo = (fagsak, behandling, navAnsatt, aksjonspunkter, extraData, hasFetchError) => {
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  return faktaPaneler
    .filter((panel) => panel.aksjonspunkterCodes.some((a) => apCodes.includes(a)) || panel.showComponent(extraData))
    .map((panel) => {
      const filtrerteAksjonspunkter = aksjonspunkter.filter((ap) => panel.aksjonspunkterCodes.includes(ap.definisjon.kode));
      return {
        textCode: panel.textCode,
        endpoints: panel.endpoints,
        renderComponent: panel.renderComponent,
        urlCode: panel.urlCode,
        aksjonspunkter: filtrerteAksjonspunkter,
        readOnly: erReadOnly(behandling, filtrerteAksjonspunkter, [], navAnsatt, fagsak, hasFetchError),
        submittable: !filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) || filtrerteAksjonspunkter.some((ap) => ap.kanLoses),
        harApneAksjonspunkter: filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses),
        extraData: panel.getExtraData(extraData),
      };
    });
};

const utledValgtPanel = (info, valgtFaktaSteg) => {
  if (valgtFaktaSteg === 'default') {
    const index = info.findIndex((i) => i.hasApneAksjonspunkter);
    return index !== -1 ? info[index] : info[0];
  }
  return info.find((i) => i.urlCode === valgtFaktaSteg);
};

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
  kodeverk,
  oppdaterFaktaPanelIUrl,
  valgtFaktaSteg,
  hasFetchError,
}) => {
  const intl = useIntl();

  const extraData = {
    fagsak, soknad, vilkarListe: vilkar, personopplysninger, inntektArbeidYtelse,
  };
  const faktaPanelInfo = useMemo(() => utledFaktaPanelInfo(fagsak, behandling, navAnsatt, aksjonspunkter, extraData, hasFetchError),
    [behandling.versjon]);

  const alleMerknaderFraBeslutter = useMemo(() => getAlleMerknaderFraBeslutter(behandling, aksjonspunkter), [behandling.versjon]);
  const valgtPanel = utledValgtPanel(faktaPanelInfo, valgtFaktaSteg);

  const valgFaktaPanelCallback = useCallback((index) => oppdaterFaktaPanelIUrl(faktaPanelInfo[index].urlCode), [faktaPanelInfo]);

  const dispatch = useDispatch();
  const bekreftCallback = useCallback(getBekreftFaktaCallback(dispatch, fagsak, behandling, oppdaterFaktaPanelIUrl), [behandling.versjon]);

  const formaterteFaktaPaneler = useMemo(() => faktaPanelInfo.map((fpi) => ({
    tekst: intl.formatMessage({ id: fpi.textCode }),
    erAktiv: fpi.textCode === valgtPanel.textCode,
    harAksjonspunkt: fpi.harApneAksjonspunkter,
  })), [behandling.versjon, valgtPanel.textCode]);

  return (
    <FaktaPanel paneler={formaterteFaktaPaneler} onClick={valgFaktaPanelCallback}>
      <DataFetcherBehandlingDataV2
        key={valgtPanel.textCode}
        behandlingVersion={behandling.versjon}
        endpoints={valgtPanel.endpoints}
        render={(dataProps) => valgtPanel.renderComponent({
          ...dataProps,
          aksjonspunkter: valgtPanel.aksjonspunkter,
          harApneAksjonspunkter: valgtPanel.harApneAksjonspunkter,
          submitCallback: bekreftCallback,
          readOnly: valgtPanel.readOnly,
          submittable: valgtPanel.submittable,
          alleKodeverk: kodeverk,
          alleMerknaderFraBeslutter,
          ...valgtPanel.extraData,
        })}
      />
    </FaktaPanel>
  );
};

export default EngangsstonadFakta;
