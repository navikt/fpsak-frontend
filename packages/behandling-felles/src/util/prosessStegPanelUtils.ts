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

const erProsessStegTrykkbart = (vilkarTypes, bpVilkar, bpAksjonspunkter) => {
  const hasVilkar = vilkarTypes.length > 0 && bpVilkar.length > 0;
  const hasNoVilkarDefinitionButAksjonspunkter = vilkarTypes.length === 0 && bpAksjonspunkter.length > 0;
  return hasVilkar || hasNoVilkarDefinitionButAksjonspunkter;
};

const settOppDataBruktTilUtledingAvSteg = (panelDefinisjon, ekstraPanelData, fagsak, behandling, aksjonspunkter, vilkar, rettigheter, intl) => ({
  ...ekstraPanelData,
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  aksjonspunktDefKoderForSteg: panelDefinisjon.aksjonspunkterCodes,
  aksjonspunkterForSteg: aksjonspunkter.filter((ap) => panelDefinisjon.aksjonspunkterCodes.includes(ap.definisjon.kode)),
  vilkarForSteg: vilkar.filter((v) => panelDefinisjon.vilkarCodes.includes(v.vilkarType.kode)),
  label: intl.formatMessage({ id: panelDefinisjon.textCode }),
  rettigheter,
});

const skalVisePanel = (aksjonspunkter, vilkar) => (panel) => {
  if (panel.showComponent) {
    return panel.showComponent(panel.dataTilUtleding);
  }

  const harAksjonspunkter = panel.aksjonspunkterCodes.some((ac) => aksjonspunkter.some((a) => a.definisjon.kode === ac));
  if (panel.vilkarCodes.length === 0) {
    return harAksjonspunkter;
  }
  const harVilkar = panel.vilkarCodes.some((vc) => vilkar.some((v) => v.vilkarType.kode === vc));
  return harAksjonspunkter && harVilkar;
};

const utledProsessStegPaneler = (prosessStegPanelDefinisjoner, ekstraPanelData, toggleOverstyring, behandling, aksjonspunkter, vilkar,
  navAnsatt, fagsak, hasFetchError, intl) => {
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);

  return prosessStegPanelDefinisjoner
    .map((panelDefinisjon) => ({
      ...panelDefinisjon,
      dataTilUtleding: settOppDataBruktTilUtledingAvSteg(panelDefinisjon, ekstraPanelData, fagsak, behandling, aksjonspunkter, vilkar, rettigheter, intl),
    }))
    .filter(skalVisePanel(aksjonspunkter, vilkar))
    .map((panel) => {
      const { vilkarForSteg, aksjonspunkterForSteg } = panel.dataTilUtleding;

      const status = panel.overrideStatus ? panel.overrideStatus(panel.dataTilUtleding) : finnStatus(vilkarForSteg, aksjonspunkterForSteg);
      const erAksjonspunktOpen = aksjonspunkterForSteg.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
      const isReadOnly = readOnlyUtils.erReadOnly(behandling, aksjonspunkterForSteg, vilkarForSteg, navAnsatt, fagsak, hasFetchError);

      const prosessStegPanel = {
        urlCode: panel.urlCode,
        endpoints: panel.endpoints,
        renderComponent: panel.renderComponent,
        aksjonspunkter: aksjonspunkterForSteg,
        erStegBehandlet: status !== vilkarUtfallType.IKKE_VURDERT || erAksjonspunktOpen,
        label: intl.formatMessage({ id: panel.textCode }),
        isAksjonspunktOpen: erAksjonspunktOpen,
        isReadOnly,
        status,
      };

      if (!erProsessStegTrykkbart(panel.vilkarCodes, vilkarForSteg, aksjonspunkterForSteg)) {
        return prosessStegPanel;
      }

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
          overrideReadOnly: readOnlyUtils.erOverrideReadOnly(behandling, aksjonspunkterForSteg, vilkarForSteg, navAnsatt, fagsak, hasFetchError),
          kanOverstyreAccess: rettigheter.kanOverstyreAccess,
          toggleOverstyring,
          ...komponentData,
        },
      } : {
        ...prosessStegPanel,
        komponentData,
      };
    });
};

const finnValgtPanel = (prosessStegPaneler, valgtProsessStegPanelKode) => {
  if (valgtProsessStegPanelKode === DEFAULT_PROSESS_STEG_KODE) {
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
