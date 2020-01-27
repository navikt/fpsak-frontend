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

const settOppDataBruktTilUtledingAvSteg = (dataForUtleding: {}, vilkar: Vilkar[], aksjonspunkter: Aksjonspunkt[], intl) => (panelDefinisjon) => {
  const panels = panelDefinisjon.panels.map((pDef) => ({
    ...pDef,
    dataTilUtleding: {
      ...dataForUtleding,
      aksjonspunktDefKoderForSteg: pDef.aksjonspunkterCodes,
      aksjonspunkterForSteg: aksjonspunkter.filter((ap) => pDef.aksjonspunkterCodes.includes(ap.definisjon.kode)),
      vilkarForSteg: vilkar.filter((v) => pDef.vilkarCodes.includes(v.vilkarType.kode)),
      label: pDef.textCode ? intl.formatMessage({ id: pDef.textCode }) : undefined,
      code: pDef.code,
    },
  }), {});

  return {
    ...panelDefinisjon,
    panels,
    label: intl.formatMessage({ id: panelDefinisjon.textCode }),
  };
};

const skalViseDelPanel = (aksjonspunkter: Aksjonspunkt[], vilkar: Vilkar[]) => (panel: ProsessStegPanelDefinisjon) => {
  if (panel.showComponent) {
    return panel.showComponent(panel.dataTilUtleding);
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

const skalVisePanel = (aksjonspunkter: Aksjonspunkt[], vilkar: Vilkar[]) => (panelDefinisjon: ProsessStegDefinisjon) => panelDefinisjon
  .panels.some(skalViseDelPanel(aksjonspunkter, vilkar));

const tilOverstyringspanel = (aksjonspunkter: Aksjonspunkt[]) => (panel: ProsessStegDefinisjon) => {
  const panels = panel.panels.map((p) => {
    if (p.overridePanel && !p.aksjonspunkterCodes.some((ac) => aksjonspunkter.some((a) => a.definisjon.kode === ac))) {
      return {
        ...p,
        ...p.overridePanel,
      };
    }
    return p;
  });

  return {
    ...panel,
    panels,
  };
};

const lagPanelData = (overstyrteAksjonspunktKoder, urlCode, harMinstEttPanelApentAksjonspunkt, toggleOverstyring,
  isReadOnlyCheck, kanOverstyreAccess) => (panel) => {
  const {
    vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg,
  } = panel.dataTilUtleding;

  const status = panel.overrideStatus ? panel.overrideStatus(panel.dataTilUtleding) : finnStatus(vilkarForSteg, aksjonspunkterForSteg);
  const opneAksjonspunkter = aksjonspunkterForSteg.filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET && ap.kanLoses);
  const erAksjonspunktOpen = aksjonspunktDefKoderForSteg.some((a) => overstyrteAksjonspunktKoder.includes(a))
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

  const komponentData = {
    status,
    isReadOnly,
    readOnlySubmitButton: (!(aksjonspunkterForSteg.some((ap) => ap.kanLoses)) || vilkarUtfallType.OPPFYLT === status),
    aksjonspunkter: aksjonspunkterForSteg,
    vilkar: vilkarForSteg,
    isAksjonspunktOpen: erAksjonspunktOpen,
    ...panel.getData(panel.dataTilUtleding),
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
  intl,
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
    .map(tilOverstyringspanel(aksjonspunkter))
    .map(settOppDataBruktTilUtledingAvSteg(dataForUtleding, vilkar, aksjonspunkter, intl))
    .filter(skalVisePanel(aksjonspunkter, vilkar))
    .map((panelDef) => {
      const harMinstEttPanelApentAksjonspunkt = panelDef.panels.some((p) => p.dataTilUtleding.aksjonspunktDefKoderForSteg
        .some((a) => overstyrteAksjonspunktKoder.includes(a))
          || p.dataTilUtleding.aksjonspunkterForSteg.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET));

      const panelData = panelDef.panels
        .filter(skalViseDelPanel(aksjonspunkter, vilkar))
        .map(lagPanelData(overstyrteAksjonspunktKoder, panelDef.urlCode, harMinstEttPanelApentAksjonspunkt, toggleOverstyring,
          isReadOnlyCheck, rettigheter.kanOverstyreAccess));

      const statusIkkeVurdert = panelData.some((p) => p.status === vilkarUtfallType.IKKE_VURDERT);
      const statusAvslatt = panelData.some((p) => p.status === vilkarUtfallType.IKKE_OPPFYLT);
      const statusOppfylt = panelData.some((p) => p.status === vilkarUtfallType.OPPFYLT);
      const tempStatus = statusOppfylt && !statusIkkeVurdert ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;
      const status = statusAvslatt ? vilkarUtfallType.IKKE_OPPFYLT : tempStatus;

      const harForkjelligeStatuserIUnderPanela = statusIkkeVurdert && statusOppfylt && !statusAvslatt;
      const erAksjonspunktOpen = harForkjelligeStatuserIUnderPanela || panelData.some((p) => p.isAksjonspunktOpen);

      return {
        urlCode: panelDef.urlCode,
        erStegBehandlet: status !== vilkarUtfallType.IKKE_VURDERT || erAksjonspunktOpen,
        label: intl.formatMessage({ id: panelDef.textCode }),
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
  valgtProsessStegPanelKode?: string,
): ProsessStegMenyRad[] => prosessStegPaneler.map((panel) => {
  const type = finnProsessmenyType(panel.status, panel.isAksjonspunktOpen);
  return {
    label: panel.label,
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
