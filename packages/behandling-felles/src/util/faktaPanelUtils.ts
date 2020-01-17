import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import readOnlyUtils from './readOnlyUtils';
import getAlleMerknaderFraBeslutter from './getAlleMerknaderFraBeslutter';

const DEFAULT_FAKTA_KODE = 'default';
const DEFAULT_PROSESS_STEG_KODE = 'default';

const utledFaktaPaneler = (faktaPanelDefinisjoner, ekstraPanelData, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError) => {
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);
  const utvidetEkstraPanelData = { ...ekstraPanelData, rettigheter };
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  return faktaPanelDefinisjoner
    .filter((panel) => panel.aksjonspunkterCodes.some((a) => apCodes.includes(a)) || panel.showComponent(utvidetEkstraPanelData))
    .map((panel) => {
      const filtrerteAksjonspunkter = aksjonspunkter.filter((ap) => panel.aksjonspunkterCodes.includes(ap.definisjon.kode));
      const harApneAksjonspunkter = filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
      return {
        urlCode: panel.urlCode,
        textCode: panel.textCode,
        endpoints: panel.endpoints,
        renderComponent: panel.renderComponent,
        harApneAksjonspunkter,
        komponentData: {
          aksjonspunkter: filtrerteAksjonspunkter,
          readOnly: readOnlyUtils.erReadOnly(behandling, filtrerteAksjonspunkter, [], navAnsatt, fagsak, hasFetchError),
          submittable: !filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) || filtrerteAksjonspunkter.some((ap) => ap.kanLoses),
          harApneAksjonspunkter,
          alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, filtrerteAksjonspunkter),
          ...panel.getData(utvidetEkstraPanelData),
        },
      };
    });
};

const finnValgtPanel = (faktaPaneler, valgtFaktaPanelKode) => {
  if (valgtFaktaPanelKode === DEFAULT_FAKTA_KODE) {
    const index = faktaPaneler.findIndex((i) => i.harApneAksjonspunkter);
    return index !== -1 ? faktaPaneler[index] : faktaPaneler[0];
  }
  return faktaPaneler.find((i) => i.urlCode === valgtFaktaPanelKode);
};

const formaterPanelerForSidemeny = (intl, faktaPaneler, valgtFaktaPanelKode) => faktaPaneler.map((panel) => ({
  tekst: intl.formatMessage({ id: panel.textCode }),
  erAktiv: panel.urlCode === valgtFaktaPanelKode,
  harAksjonspunkt: panel.harApneAksjonspunkter,
}));

const getBekreftAksjonspunktCallback = (dispatch, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl,
  overstyringApCodes, api) => (aksjonspunkter) => {
  const model = aksjonspunkter.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
  };

  if (model && overstyringApCodes.includes(model[0].kode)) {
    return dispatch(api.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()({
      ...params,
      overstyrteAksjonspunktDtoer: model,
    }, { keepData: true })).then(() => oppdaterProsessStegOgFaktaPanelIUrl(DEFAULT_PROSESS_STEG_KODE, DEFAULT_FAKTA_KODE));
  }

  return dispatch(api.SAVE_AKSJONSPUNKT.makeRestApiRequest()({
    ...params,
    bekreftedeAksjonspunktDtoer: model,
  }, { keepData: true })).then(() => oppdaterProsessStegOgFaktaPanelIUrl(DEFAULT_PROSESS_STEG_KODE, DEFAULT_FAKTA_KODE));
};


const faktaPanelUtils = {
  utledFaktaPaneler,
  finnValgtPanel,
  formaterPanelerForSidemeny,
  getBekreftAksjonspunktCallback,
};

export default faktaPanelUtils;
