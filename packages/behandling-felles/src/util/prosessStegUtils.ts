import { SetStateAction } from 'react';
import { Dispatch } from 'redux';
import { StepType } from '@navikt/nap-process-menu/dist/Step';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import {
  Behandling, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import readOnlyUtils from './readOnlyUtils';
import FagsakInfo from '../types/fagsakInfoTsType';
import ProsessStegData from '../types/prosessStegDataTsType';
import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';
import Rettigheter from '../types/rettigheterTsType';
import { ProsessStegPanelDef, ProsessStegPanelerDef } from './ProsessStegPanelDef';

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

const lagPanelData = (
  prosessStegDef: ProsessStegPanelDef,
  overstyrteAksjonspunktKoder: string[],
  harMinstEttPanelApentAksjonspunkt: boolean,
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void,
  isReadOnlyCheck: (aksjonspunkterForSteg: Aksjonspunkt[], vilkarForSteg: Vilkar[]) => boolean,
  kanOverstyreAccess: {},
  dataForUtledingAvPanel: {
    aksjonspunkter: Aksjonspunkt[];
    vilkar: Vilkar[];
  },
) => (panelDef: ProsessStegPanelerDef) => {
  const aksjonspunkterForSteg = panelDef.finnAksjonspunkterForSteg(dataForUtledingAvPanel.aksjonspunkter);
  const vilkarForSteg = panelDef.finnVilkarForSteg(dataForUtledingAvPanel.vilkar);

  const dataForUtledingAvStatus = { ...dataForUtledingAvPanel, aksjonspunkterForSteg, vilkarForSteg };
  const overstyrtStatus = panelDef.getOverstyrtStatus(dataForUtledingAvStatus);
  const status = overstyrtStatus || finnStatus(vilkarForSteg, aksjonspunkterForSteg);

  const opneAksjonspunkter = aksjonspunkterForSteg.filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET && ap.kanLoses);
  const erAksjonspunktOpen = panelDef.getAksjonspunktKoder().some((a) => overstyrteAksjonspunktKoder.includes(a))
      || opneAksjonspunkter.length > 0;

  const isReadOnly = isReadOnlyCheck(aksjonspunkterForSteg, vilkarForSteg);

  const indekser = opneAksjonspunkter.map((a) => panelDef.getAksjonspunktKoder().findIndex((ac) => a.definisjon.kode === ac));
  const aksjonspunktHelpTextCodes = panelDef.getAksjonspunktTekstkoder().filter((a, index) => indekser.includes(index));

  return {
    status,
    isReadOnly,
    code: panelDef.getId() ? panelDef.getId() : prosessStegDef.getUrlKode(),
    endpoints: panelDef.getEndepunkter(),
    renderComponent: panelDef.getKomponent,
    aksjonspunkter: aksjonspunkterForSteg,
    isAksjonspunktOpen: erAksjonspunktOpen,
    aksjonspunktHelpTextCodes,
    komponentData: {
      status,
      isReadOnly,
      readOnlySubmitButton: (!(aksjonspunkterForSteg.some((ap) => ap.kanLoses)) || vilkarUtfallType.OPPFYLT === status),
      aksjonspunkter: aksjonspunkterForSteg,
      vilkar: vilkarForSteg,
      isAksjonspunktOpen: erAksjonspunktOpen,
      overrideReadOnly: isReadOnly || (harMinstEttPanelApentAksjonspunkt && !erAksjonspunktOpen),
      kanOverstyreAccess,
      toggleOverstyring,
      ...panelDef.getData({
        ...dataForUtledingAvPanel,
        aksjonspunkterForSteg,
        vilkarForSteg,
        overstyrteAksjonspunktKoder,
        prosessStegTekstKode: prosessStegDef.getTekstKode(),
      }),
    },
  };
};

export const utledProsessStegPaneler = (
  prosessStegPanelDefinisjoner: ProsessStegPanelDef[],
  dataForUtledingAvPaneler: {},
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void,
  overstyrteAksjonspunktKoder: string[],
  fagsak: FagsakInfo,
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  rettigheter: Rettigheter,
  hasFetchError: boolean,
) => {
  const isReadOnlyCheck = (aksjonspunkterForSteg, vilkarForSteg) => readOnlyUtils.erReadOnly(
    behandling, aksjonspunkterForSteg, vilkarForSteg, rettigheter, hasFetchError,
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
    .filter((prosessStegDef) => prosessStegDef.skalViseMinstEttPanelForSteg(behandling, aksjonspunkter, vilkar))
    .map((prosessStegDef) => {
      const harMinstEttPanelApentAksjonspunkt = prosessStegDef.harMinstEttApentAksjonspunkt(aksjonspunkter, overstyrteAksjonspunktKoder);

      const panelData = prosessStegDef.getPanelDefinisjoner()
        .filter((pDef) => pDef.skalVisePanel(behandling, aksjonspunkter, vilkar))
        .map(lagPanelData(prosessStegDef, overstyrteAksjonspunktKoder, harMinstEttPanelApentAksjonspunkt, toggleOverstyring,
          isReadOnlyCheck, rettigheter.kanOverstyreAccess, dataForUtleding));

      const harStatusIkkeVurdert = panelData.some((p) => p.status === vilkarUtfallType.IKKE_VURDERT);
      const harStatusAvslatt = panelData.some((p) => p.status === vilkarUtfallType.IKKE_OPPFYLT);
      const harStatusOppfylt = panelData.some((p) => p.status === vilkarUtfallType.OPPFYLT);
      const tempStatus = harStatusOppfylt && !harStatusIkkeVurdert ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;
      const status = harStatusAvslatt ? vilkarUtfallType.IKKE_OPPFYLT : tempStatus;

      const harUlikeStatuserIPanela = harStatusIkkeVurdert && harStatusOppfylt && !harStatusAvslatt;
      const erAksjonspunktOpen = harUlikeStatuserIPanela || panelData.some((p) => p.isAksjonspunktOpen);

      return {
        urlCode: prosessStegDef.getUrlKode(),
        erStegBehandlet: status !== vilkarUtfallType.IKKE_VURDERT || erAksjonspunktOpen,
        prosessStegTittelKode: prosessStegDef.getTekstKode(),
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
    if (index !== -1) {
      return prosessStegPaneler[index];
    }
    const sistePanel = prosessStegPaneler[prosessStegPaneler.length - 1];
    return sistePanel.erStegBehandlet ? sistePanel : undefined;
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
