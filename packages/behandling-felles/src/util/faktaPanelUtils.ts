import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import { erReadOnly } from './erReadOnly';
import getAlleMerknaderFraBeslutter from './getAlleMerknaderFraBeslutter';

const utledFaktaPaneler = (faktaPanelDefinisjoner, ekstraPanelData, fagsak, behandling, navAnsatt, aksjonspunkter, hasFetchError) => {
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  return faktaPanelDefinisjoner
    .filter((panel) => panel.aksjonspunkterCodes.some((a) => apCodes.includes(a)) || panel.showComponent(ekstraPanelData))
    .map((panel) => {
      const filtrerteAksjonspunkter = aksjonspunkter.filter((ap) => panel.aksjonspunkterCodes.includes(ap.definisjon.kode));
      const harApneAksjonspunkter = filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
      return {
        urlCode: panel.urlCode,
        textCode: panel.textCode,
        endpoints: panel.endpoints,
        renderComponent: panel.renderComponent,
        harApneAksjonspunkter,
        componentData: {
          aksjonspunkter: filtrerteAksjonspunkter,
          readOnly: erReadOnly(behandling, filtrerteAksjonspunkter, [], navAnsatt, fagsak, hasFetchError),
          submittable: !filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) || filtrerteAksjonspunkter.some((ap) => ap.kanLoses),
          harApneAksjonspunkter,
          alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, filtrerteAksjonspunkter),
          ...panel.getData(ekstraPanelData),
        },
      };
    });
};

const finnValgtPanel = (faktaPaneler, valgtFaktaPanelKode) => {
  if (valgtFaktaPanelKode === 'default') {
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

const faktaPanelUtils = {
  utledFaktaPaneler,
  finnValgtPanel,
  formaterPanelerForSidemeny,
};

export default faktaPanelUtils;
