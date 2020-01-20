import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { allAccessRights } from '@fpsak-frontend/fp-felles';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';

import readOnlyUtils from './readOnlyUtils';

const DEFAULT_PROSESS_STEG_KODE = 'default';

const finnStatus = (bpVilkar, bpAksjonspunkter) => {
  if (bpVilkar.length > 0) {
    const vilkarStatusCodes = bpVilkar.map((v) => v.vilkarStatus.kode);
    if (vilkarStatusCodes.some((vsc) => vsc === vilkarUtfallType.IKKE_VURDERT)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    return vilkarStatusCodes.every((vsc) => vsc === vilkarUtfallType.OPPFYLT) ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (bpAksjonspunkter.length > 0) {
    return bpAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) ? vilkarUtfallType.IKKE_VURDERT : vilkarUtfallType.OPPFYLT;
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

const settOppDataBruktTilUtledingAvSteg = (ekstraData, intl) => (panelDefinisjon) => {
  const panels = panelDefinisjon.panels.map((pDef) => ({
    ...pDef,
    dataTilUtleding: {
      ...ekstraData,
      aksjonspunktDefKoderForSteg: pDef.aksjonspunkterCodes,
      aksjonspunkterForSteg: ekstraData.aksjonspunkter.filter((ap) => pDef.aksjonspunkterCodes.includes(ap.definisjon.kode)),
      vilkarForSteg: ekstraData.vilkar.filter((v) => pDef.vilkarCodes.includes(v.vilkarType.kode)),
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

const skalViseDelPanel = (aksjonspunkter, vilkar, panel) => {
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

const skalVisePanel = (aksjonspunkter, vilkar) => (panelDefinisjon) => panelDefinisjon.panels.some((p) => skalViseDelPanel(aksjonspunkter, vilkar, p));

const tilOverstyringspanel = (aksjonspunkter) => (panel) => {
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

const finnHjelpetekster = (opneAksjonspunkter, aksjonspunkterCodes, aksjonspunkterTextCodes = []) => {
  const indekser = opneAksjonspunkter.map((a) => aksjonspunkterCodes.findIndex((ac) => a.definisjon.kode === ac));
  return aksjonspunkterTextCodes.filter((a, index) => indekser.includes(index));
};


const utledProsessStegPaneler = (prosessStegPanelDefinisjoner, ekstraPanelData, toggleOverstyring, overstyrteAksjonspunkter,
  behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl) => {
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);
  const data = {
    ...ekstraPanelData,
    fagsak,
    behandling,
    aksjonspunkter,
    vilkar,
    rettigheter,
  };

  return prosessStegPanelDefinisjoner
    .map(tilOverstyringspanel(aksjonspunkter))
    .map(settOppDataBruktTilUtledingAvSteg(data, intl))
    .filter(skalVisePanel(aksjonspunkter, vilkar))
    .map((panelDef) => {
      const harMinstEttPanelApentAksjonspunkt = panelDef.panels.some((p) => p.dataTilUtleding.aksjonspunktDefKoderForSteg
        .some((a) => overstyrteAksjonspunkter.includes(a))
          || p.dataTilUtleding.aksjonspunkterForSteg.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET));

      const panelData = panelDef.panels.map((panel) => {
        if (!skalViseDelPanel(aksjonspunkter, vilkar, panel)) {
          return {
            code: panel.code ? panel.code : panelDef.urlCode,
          };
        }
        const {
          vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg,
        } = panel.dataTilUtleding;

        const status = panel.overrideStatus ? panel.overrideStatus(panel.dataTilUtleding) : finnStatus(vilkarForSteg, aksjonspunkterForSteg);
        const opneAksjonspunkter = aksjonspunkterForSteg.filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
        const erAksjonspunktOpen = aksjonspunktDefKoderForSteg.some((a) => overstyrteAksjonspunkter.includes(a))
          || opneAksjonspunkter.length > 0;
        const isReadOnly = readOnlyUtils.erReadOnly(behandling, aksjonspunkterForSteg, vilkarForSteg, navAnsatt, fagsak, hasFetchError);

        const prosessStegPanel = {
          code: panel.code ? panel.code : panelDef.urlCode,
          endpoints: panel.endpoints,
          renderComponent: panel.renderComponent,
          aksjonspunkter: aksjonspunkterForSteg,
          isAksjonspunktOpen: erAksjonspunktOpen,
          aksjonspunktHelpTextCodes: finnHjelpetekster(opneAksjonspunkter, panel.aksjonspunkterCodes, panel.aksjonspunkterTextCodes),
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
            overrideReadOnly: readOnlyUtils.erOverrideReadOnly(behandling, aksjonspunkterForSteg, vilkarForSteg, navAnsatt, fagsak, hasFetchError)
             || (harMinstEttPanelApentAksjonspunkt && !erAksjonspunktOpen),
            kanOverstyreAccess: rettigheter.kanOverstyreAccess,
            toggleOverstyring,
            ...komponentData,
          },
        } : {
          ...prosessStegPanel,
          komponentData,
        };
      });

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
        aksjonspunkter: panelData.length === 1 ? panelData[0].aksjonspunkter : [],
        status,
        panelData,
      };
    });
};

const finnValgtPanel = (prosessStegPaneler, valgtProsessStegPanelKode, erBehandlingHenlagt, apentFaktaPanelInfo) => {
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


// TODO (TOR) Hent desse statusane fra process-menu komponent
export enum StepType {
  warning = 'warning',
  success = 'success',
  danger = 'danger',
  default = 'default',
}

const finnProsessmenyType = (status, harApentAksjonspunkt) => {
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

const formaterPanelerForProsessmeny = (intl, prosessStegPaneler, valgtProsessStegPanelKode) => prosessStegPaneler.map((panel) => {
  const type = finnProsessmenyType(panel.status, panel.isAksjonspunktOpen);
  return {
    label: panel.label,
    isActive: panel.urlCode === valgtProsessStegPanelKode,
    isDisabled: false,
    isFinished: type === StepType.success,
    type,
  };
});

const getBekreftAksjonspunktCallback = (dispatch, lagringSideEffectsCallback, fagsak, behandling, aksjonspunkter, api) => (aksjonspunktModels) => {
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


const prosessStegPanelUtils = {
  utledProsessStegPaneler,
  finnValgtPanel,
  formaterPanelerForProsessmeny,
  getBekreftAksjonspunktCallback,
};

export default prosessStegPanelUtils;
