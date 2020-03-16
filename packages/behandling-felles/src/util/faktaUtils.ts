import { Dispatch } from 'redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';

import readOnlyUtils from './readOnlyUtils';
import getAlleMerknaderFraBeslutter from './getAlleMerknaderFraBeslutter';
import FagsakInfo from '../types/fagsakInfoTsType';
import Rettigheter from '../types/rettigheterTsType';
import FaktaPanelDefinisjon from '../types/faktaPanelDefinisjonTsType';
import FaktaPanelUtledet from '../types/faktaPanelUtledetTsType';
import FaktaPanelFaktaPanelMenyRadMeny from '../types/faktaPanelMenyRadTsType';

export const DEFAULT_FAKTA_KODE = 'default';
export const DEFAULT_PROSESS_STEG_KODE = 'default';

export const utledFaktaPaneler = (
  faktaPanelDefinisjoner: FaktaPanelDefinisjon[],
  ekstraPanelData: {},
  behandling: Behandling,
  rettigheter: Rettigheter,
  aksjonspunkter: Aksjonspunkt[],
  hasFetchError: boolean,
): FaktaPanelUtledet[] => {
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
          readOnly: readOnlyUtils.erReadOnly(behandling, filtrerteAksjonspunkter, [], rettigheter, hasFetchError),
          submittable: !filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) || filtrerteAksjonspunkter.some((ap) => ap.kanLoses),
          harApneAksjonspunkter,
          alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, filtrerteAksjonspunkter),
          ...panel.getData(utvidetEkstraPanelData),
        },
      };
    });
};

export const finnValgtPanel = (faktaPaneler: FaktaPanelUtledet[], valgtFaktaPanelKode: string): FaktaPanelUtledet => {
  if (valgtFaktaPanelKode === DEFAULT_FAKTA_KODE) {
    const index = faktaPaneler.findIndex((i) => i.harApneAksjonspunkter);
    return index !== -1 ? faktaPaneler[index] : faktaPaneler[0];
  }
  if (valgtFaktaPanelKode) {
    return faktaPaneler.find((i) => i.urlCode === valgtFaktaPanelKode);
  }
  return faktaPaneler.length > 0 ? faktaPaneler[0] : undefined;
};

export const formaterPanelerForSidemeny = (intl, faktaPaneler: FaktaPanelUtledet[], valgtFaktaPanelKode: string):
FaktaPanelFaktaPanelMenyRadMeny[] => faktaPaneler.map((panel) => ({
  tekst: intl.formatMessage({ id: panel.textCode }),
  erAktiv: panel.urlCode === valgtFaktaPanelKode,
  harAksjonspunkt: panel.harApneAksjonspunkter,
}));

export const getBekreftAksjonspunktCallback = (
  dispatch: Dispatch,
  fagsak: FagsakInfo,
  behandling: Behandling,
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void,
  overstyringApCodes: string[],
  api: {[name: string]: EndpointOperations},
) => (aksjonspunkter) => {
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
