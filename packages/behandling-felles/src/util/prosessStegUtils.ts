import { SetStateAction } from 'react';
import { Dispatch } from 'redux';
import { StepType } from '@navikt/nap-process-menu/dist/Step';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { allAccessRights } from '@fpsak-frontend/fp-felles';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';

import ProsessStegDefinisjon, { ProsessStegPanelDefinisjon } from '../types/prosessStegDefinisjonTsType';
import readOnlyUtils from './readOnlyUtils';
import Behandling from '../types/behandlingTsType';
import FagsakInfo from '../types/fagsakInfoTsType';
import NavAnsatt from '../types/navAnsattTsType';
import Aksjonspunkt from '../types/aksjonspunktTsType';
import Vilkar from '../types/vilkarTsType';
import ProsessStegData from '../types/prosessStegDataTsType';
import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';

const DEFAULT_PROSESS_STEG_KODE = 'default';

const finnStatus = (vilkar: Vilkar[], aksjonspunkter: Aksjonspunkt[]) => {
  if (vilkar.length > 0) {
    const vilkarStatusCodes = vilkar.map((v) => v.vilkarStatus.kode);
    if (vilkarStatusCodes.some((vsc) => vsc === vilkarUtfallType.IKKE_VURDERT)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    return vilkarStatusCodes.every((vsc) => vsc === vilkarUtfallType.OPPFYLT) ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (aksjonspunkter.length > 0) {
    return aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) ? vilkarUtfallType.IKKE_VURDERT : vilkarUtfallType.OPPFYLT;
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

const finnAksjonspunkterForSteg = (panel, aksjonspunkter) => aksjonspunkter.filter((ap) => panel.aksjonspunkterCodes.includes(ap.definisjon.kode));
const finnVilkarForSteg = (panel, vilkar) => vilkar.filter((v) => panel.vilkarCodes.includes(v.vilkarType.kode));

const skalVisePanel = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[], vilkar: Vilkar[]) => (panel: ProsessStegPanelDefinisjon) => {
  if (panel.showComponent) {
    const data = {
      behandling,
      aksjonspunktDefKoderForSteg: panel.aksjonspunkterCodes,
      aksjonspunkterForSteg: finnAksjonspunkterForSteg(panel, aksjonspunkter),
      vilkarForSteg: finnVilkarForSteg(panel, vilkar),
    };
    return panel.showComponent(data);
  }

  const harAksjonspunkter = panel.aksjonspunkterCodes.some((ac) => aksjonspunkter.some((a) => a.definisjon.kode === ac));
  if (panel.vilkarCodes.length === 0) {
    return harAksjonspunkter;
  }

  const harVilkar = panel.vilkarCodes.some((vc) => vilkar.some((v) => v.vilkarType.kode === vc));
  if (harVilkar && !harAksjonspunkter && panel.overridePanel) {
    return true;
  }

  return harAksjonspunkter && harVilkar;
};

const skalViseProsessSteg = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[], vilkar: Vilkar[]) => (
  panelDefinisjon: ProsessStegDefinisjon,
) => panelDefinisjon.panels.some(skalVisePanel(behandling, aksjonspunkter, vilkar));

const brukOverstyringspanelOmApIkkeFinnes = (aksjonspunkter: Aksjonspunkt[]) => (panelDefinisjon: ProsessStegDefinisjon) => {
  const panels = panelDefinisjon.panels
    .map((panel) => (panel.overridePanel && !panel.aksjonspunkterCodes.some((ac) => aksjonspunkter.some((a) => a.definisjon.kode === ac))
      ? {
        ...panel,
        ...panel.overridePanel,
      } : panel));
  return {
    ...panelDefinisjon,
    panels,
  };
};

const lagPanelData = (overstyrteAksjonspunktKoder, urlCode, harMinstEttPanelApentAksjonspunkt, toggleOverstyring,
  isReadOnlyCheck, kanOverstyreAccess, dataForUtledingAvPanel) => (panel) => {
  const aksjonspunkterForSteg = finnAksjonspunkterForSteg(panel, dataForUtledingAvPanel.aksjonspunkter);
  const vilkarForSteg = finnVilkarForSteg(panel, dataForUtledingAvPanel.vilkar);
  const dataForUtledingAvOverstyring = {
    ...dataForUtledingAvPanel,
    aksjonspunkterForSteg,
    vilkarForSteg,
  };

  const status = panel.overrideStatus ? panel.overrideStatus(dataForUtledingAvOverstyring) : finnStatus(vilkarForSteg, aksjonspunkterForSteg);
  const opneAksjonspunkter = aksjonspunkterForSteg.filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET && ap.kanLoses);
  const erAksjonspunktOpen = panel.aksjonspunkterCodes.some((a) => overstyrteAksjonspunktKoder.includes(a))
      || opneAksjonspunkter.length > 0;
  const isReadOnly = isReadOnlyCheck(aksjonspunkterForSteg, vilkarForSteg);

  const indekser = opneAksjonspunkter.map((a) => panel.aksjonspunkterCodes.findIndex((ac) => a.definisjon.kode === ac));
  const aksjonspunktHelpTextCodes = panel.aksjonspunkterTextCodes.filter((a, index) => indekser.includes(index));

  const prosessStegPanel = {
    code: panel.code ? panel.code : urlCode,
    endpoints: panel.endpoints,
    renderComponent: panel.renderComponent,
    aksjonspunkter: aksjonspunkterForSteg,
    isAksjonspunktOpen: erAksjonspunktOpen,
    aksjonspunktHelpTextCodes,
    isReadOnly,
    status,
  };

  const dataTilKomponent = {
    ...dataForUtledingAvOverstyring,
    aksjonspunktDefKoderForSteg: panel.aksjonspunkterCodes,
    labelCode: panel.textCode,
    code: panel.code,
    overstyrteAksjonspunktKoder,
  };

  const komponentData = {
    status,
    isReadOnly,
    readOnlySubmitButton: (!(aksjonspunkterForSteg.some((ap) => ap.kanLoses)) || vilkarUtfallType.OPPFYLT === status),
    aksjonspunkter: aksjonspunkterForSteg,
    vilkar: vilkarForSteg,
    isAksjonspunktOpen: erAksjonspunktOpen,
    ...panel.getData(dataTilKomponent),
  };

  return panel.isOverridable ? {
    ...prosessStegPanel,
    komponentData: {
      overrideReadOnly: isReadOnly || (harMinstEttPanelApentAksjonspunkt && !erAksjonspunktOpen),
      kanOverstyreAccess,
      toggleOverstyring,
      ...komponentData,
    },
  } : {
    ...prosessStegPanel,
    komponentData,
  };
};

export const utledProsessStegPaneler = (
  prosessStegPanelDefinisjoner: ProsessStegDefinisjon[],
  dataForUtledingAvPaneler: {},
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void,
  overstyrteAksjonspunktKoder: string[],
  fagsak: FagsakInfo,
  navAnsatt: NavAnsatt,
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  hasFetchError: boolean,
) => {
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);
  const isReadOnlyCheck = (aksjonspunkterForSteg, vilkarForSteg) => readOnlyUtils.erReadOnly(
    behandling, aksjonspunkterForSteg, vilkarForSteg, navAnsatt, fagsak, hasFetchError,
  );

  const dataForUtleding = {
    ...dataForUtledingAvPaneler,
    fagsak,
    behandling,
    aksjonspunkter,
    vilkar,
    rettigheter,
  };

  return prosessStegPanelDefinisjoner
    .map(brukOverstyringspanelOmApIkkeFinnes(aksjonspunkter))
    .filter(skalViseProsessSteg(behandling, aksjonspunkter, vilkar))
    .map((panelDefinisjon) => {
      const harMinstEttPanelApentAksjonspunkt = panelDefinisjon.panels.some((panel) => panel.aksjonspunkterCodes
        .some((apKode) => overstyrteAksjonspunktKoder.includes(apKode))
          || finnAksjonspunkterForSteg(panel, aksjonspunkter).some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET));

      const panelData = panelDefinisjon.panels
        .filter(skalVisePanel(behandling, aksjonspunkter, vilkar))
        .map(lagPanelData(overstyrteAksjonspunktKoder, panelDefinisjon.urlCode, harMinstEttPanelApentAksjonspunkt, toggleOverstyring,
          isReadOnlyCheck, rettigheter.kanOverstyreAccess, dataForUtleding));

      const harStatusIkkeVurdert = panelData.some((p) => p.status === vilkarUtfallType.IKKE_VURDERT);
      const harStatusAvslatt = panelData.some((p) => p.status === vilkarUtfallType.IKKE_OPPFYLT);
      const harStatusOppfylt = panelData.some((p) => p.status === vilkarUtfallType.OPPFYLT);
      const tempStatus = harStatusOppfylt && !harStatusIkkeVurdert ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;
      const status = harStatusAvslatt ? vilkarUtfallType.IKKE_OPPFYLT : tempStatus;

      const harUlikeStatuserIPanela = harStatusIkkeVurdert && harStatusOppfylt && !harStatusAvslatt;
      const erAksjonspunktOpen = harUlikeStatuserIPanela || panelData.some((p) => p.isAksjonspunktOpen);

      return {
        urlCode: panelDefinisjon.urlCode,
        erStegBehandlet: status !== vilkarUtfallType.IKKE_VURDERT || erAksjonspunktOpen,
        prosessStegTittelKode: panelDefinisjon.textCode,
        isAksjonspunktOpen: erAksjonspunktOpen,
        isReadOnly: panelData.every((p) => p.isReadOnly),
        aksjonspunkter: panelData.filter((pd) => pd.aksjonspunkter).reduce((acc, pd) => [...acc, ...pd.aksjonspunkter], []),
        status,
        panelData,
      };
    });
};

export const finnValgtPanel = (
  prosessStegPaneler: ProsessStegData[],
  erBehandlingHenlagt: boolean,
  valgtProsessStegPanelKode?: string,
  apentFaktaPanelInfo?: { urlCode: string; textCode: string},
) => {
  if (valgtProsessStegPanelKode === DEFAULT_PROSESS_STEG_KODE) {
    if (erBehandlingHenlagt) {
      return prosessStegPaneler[prosessStegPaneler.length - 1];
    }
    if (apentFaktaPanelInfo) {
      return undefined;
    }
    const index = prosessStegPaneler.findIndex((i) => i.isAksjonspunktOpen);
    return index !== -1 ? prosessStegPaneler[index] : prosessStegPaneler[0];
  }
  return prosessStegPaneler.find((i) => i.urlCode === valgtProsessStegPanelKode);
};

const finnProsessmenyType = (
  status: vilkarUtfallType.OPPFYLT | vilkarUtfallType.IKKE_OPPFYLT | vilkarUtfallType.IKKE_VURDERT,
  harApentAksjonspunkt: boolean,
) => {
  if (harApentAksjonspunkt) {
    return StepType.warning;
  }
  if (status === vilkarUtfallType.OPPFYLT) {
    return StepType.success;
  } if (status === vilkarUtfallType.IKKE_OPPFYLT) {
    return StepType.danger;
  }
  return StepType.default;
};

export const formaterPanelerForProsessmeny = (
  prosessStegPaneler: ProsessStegData[],
  intl,
  valgtProsessStegPanelKode?: string,
): ProsessStegMenyRad[] => prosessStegPaneler.map((panel) => {
  const type = finnProsessmenyType(panel.status, panel.isAksjonspunktOpen);
  return {
    label: intl.formatMessage({ id: panel.prosessStegTittelKode }),
    isActive: panel.urlCode === valgtProsessStegPanelKode,
    isDisabled: false,
    isFinished: type === StepType.success,
    type,
  };
});

export const getBekreftAksjonspunktCallback = (
  dispatch: Dispatch,
  lagringSideEffectsCallback: (aksjonspunktModeller: {}) => () => void,
  fagsak: FagsakInfo,
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  api: {[name: string]: EndpointOperations},
) => (aksjonspunktModels) => {
  const models = aksjonspunktModels.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
  };

  const etterLagringCallback = lagringSideEffectsCallback(aksjonspunktModels);

  if (api.SAVE_OVERSTYRT_AKSJONSPUNKT) {
    const aksjonspunkterTilLagring = aksjonspunkter.filter((ap) => aksjonspunktModels.some((apModel) => apModel.kode === ap.definisjon.kode));
    const erOverstyringsaksjonspunkter = aksjonspunkterTilLagring
      .some((ap) => ap.aksjonspunktType.kode === aksjonspunktType.OVERSTYRING || ap.aksjonspunktType.kode === aksjonspunktType.SAKSBEHANDLEROVERSTYRING);

    if (aksjonspunkterTilLagring.length === 0 || erOverstyringsaksjonspunkter) {
      return dispatch(api.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()({
        ...params,
        overstyrteAksjonspunktDtoer: models,
      }, { keepData: true })).then(etterLagringCallback);
    }
  }

  return dispatch(api.SAVE_AKSJONSPUNKT.makeRestApiRequest()({
    ...params,
    bekreftedeAksjonspunktDtoer: models,
  }, { keepData: true })).then(etterLagringCallback);
};
