import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';


import readOnlyUtils from './readOnlyUtils';

const DEFAULT_PROSESS_STEG_KODE = 'default';

const SUCCESS = 'success';
const WARNING = 'warning';
const DANGER = 'danger';
const DEFAULT = 'default';

const finnProsessmenyType = (status, harApentAksjonspunkt) => {
  if (harApentAksjonspunkt) {
    return WARNING;
  }
  if (status === vilkarUtfallType.OPPFYLT) {
    return SUCCESS;
  } if (status === vilkarUtfallType.IKKE_OPPFYLT) {
    return DANGER;
  }
  return DEFAULT;
};

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

const erProsessStegSynlig = (vilkarTypes, bpVilkar, bpAksjonspunkter) => {
  const hasVilkar = vilkarTypes.length > 0 && bpVilkar.length > 0;
  const hasNoVilkarDefinitionButAksjonspunkter = vilkarTypes.length === 0 && bpAksjonspunkter.length > 0;
  return hasVilkar || hasNoVilkarDefinitionButAksjonspunkter;
};

const createData = (panel, aksjonspunkter, vilkar, ekstraPanelData, intl) => ({
  ...ekstraPanelData,
  aksjonspunkterForSteg: aksjonspunkter.filter((ap) => panel.aksjonspunkterCodes.includes(ap.definisjon.kode)),
  aksjonspunktDefKoderForSteg: panel.aksjonspunkterCodes,
  vilkarForSteg: vilkar.filter((v) => panel.vilkarCodes.includes(v.vilkarType.kode)),
  label: intl.formatMessage({ id: panel.textCode }),
});

const utledProsessStegPaneler = (prosessStegPanelDefinisjoner, ekstraPanelData, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl) => {
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  const vilkarCodes = vilkar.map((v) => v.vilkarType.kode);

  return prosessStegPanelDefinisjoner
    .filter((panel) => {
      if (panel.showComponent) {
        return panel.showComponent(createData(panel, aksjonspunkter, vilkar, ekstraPanelData, intl));
      }
      return panel.vilkarCodes.some((v) => vilkarCodes.includes(v)) && panel.aksjonspunkterCodes.some((a) => apCodes.includes(a));
    })
    .map((panel) => {
      const ekstra = createData(panel, aksjonspunkter, vilkar, ekstraPanelData, intl);
      const filtrerteAksjonspunkter = aksjonspunkter.filter((ap) => panel.aksjonspunkterCodes.includes(ap.definisjon.kode));
      const filtrerteVilkar = vilkar.filter((v) => panel.vilkarCodes.includes(v.vilkarType.kode));
      const status = panel.overrideStatus ? panel.overrideStatus(ekstra, filtrerteAksjonspunkter) : finnStatus(filtrerteVilkar, filtrerteAksjonspunkter);
      const erAksjonspunktOpen = filtrerteAksjonspunkter.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);

      if (!erProsessStegSynlig(panel.vilkarCodes, filtrerteVilkar, filtrerteAksjonspunkter)) {
        return {
          urlCode: panel.urlCode,
          label: intl.formatMessage({ id: panel.textCode }),
          status,
          isAksjonspunktOpen: erAksjonspunktOpen,
        };
      }

      const isReadOnly = readOnlyUtils.erReadOnly(behandling, filtrerteAksjonspunkter, filtrerteVilkar, navAnsatt, fagsak, hasFetchError);
      const isOverrideReadOnly = readOnlyUtils.erOverrideReadOnly(behandling, filtrerteAksjonspunkter, filtrerteVilkar, navAnsatt, fagsak, hasFetchError);
      const isSubmittable = filtrerteAksjonspunkter.some((ap) => ap.kanLoses) || vilkarUtfallType.OPPFYLT === status;

      return {
        urlCode: panel.urlCode,
        label: intl.formatMessage({ id: panel.textCode }),
        endpoints: panel.endpoints,
        renderComponent: panel.renderComponent,
        isReadOnly,
        status,
        aksjonspunkter: filtrerteAksjonspunkter,
        erStegBehandlet: status !== vilkarUtfallType.IKKE_VURDERT || erAksjonspunktOpen,
        isAksjonspunktOpen: erAksjonspunktOpen,
        componentData: {
          aksjonspunkter: filtrerteAksjonspunkter,
          vilkar: filtrerteVilkar,
          status,
          isReadOnly,
          readOnlySubmitButton: (!(filtrerteAksjonspunkter.some((ap) => ap.kanLoses)) || vilkarUtfallType.OPPFYLT === status),
          overrideReadOnly: isOverrideReadOnly,
          isAksjonspunktOpen: erAksjonspunktOpen,
          isSubmittable,
          ...panel.getData(ekstra),
        },
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

const formaterPanelerForProsessmeny = (intl, prosessStegPaneler, valgtProsessStegPanelKode) => prosessStegPaneler.map((panel) => {
  const type = finnProsessmenyType(panel.status, panel.isAksjonspunktOpen);
  return {
    label: panel.label,
    isActive: panel.urlCode === valgtProsessStegPanelKode,
    isDisabled: false,
    isFinished: type === SUCCESS,
    type,
  };
});

const prosessStegPanelUtils = {
  utledProsessStegPaneler,
  finnValgtPanel,
  formaterPanelerForProsessmeny,
};

export default prosessStegPanelUtils;
