import { SetStateAction } from 'react';
import { Dispatch } from 'redux';
import { StepType } from '@navikt/nap-process-menu/dist/Step';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { Behandling, Aksjonspunkt, Vilkar } from '@fpsak-frontend/types';

import readOnlyUtils from '../readOnlyUtils';
import FagsakInfo from '../../types/fagsakInfoTsType';
import ProsessStegMenyRad from '../../types/prosessStegMenyRadTsType';
import Rettigheter from '../../types/rettigheterTsType';
import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';
import { ProsessStegPanelUtledet, ProsessStegUtledet } from './ProsessStegUtledet';

const DEFAULT_PROSESS_STEG_KODE = 'default';

export const utledProsessStegPaneler = (
  prosessStegPanelDefinisjoner: ProsessStegDef[],
  dataForUtledingAvPaneler: {},
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void,
  overstyrteAksjonspunktKoder: string[],
  behandling: Behandling,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  rettigheter: Rettigheter,
  hasFetchError: boolean,
): ProsessStegUtledet[] => {
  const isReadOnlyCheck = (aksjonspunkterForPanel, vilkarForPanel) => readOnlyUtils.erReadOnly(
    behandling, aksjonspunkterForPanel, vilkarForPanel, rettigheter, hasFetchError,
  );

  return prosessStegPanelDefinisjoner
    .filter((prosessStegDef: ProsessStegDef) => prosessStegDef.skalViseProsessSteg(behandling, aksjonspunkter, vilkar))
    .map((prosessStegDef: ProsessStegDef) => {
      const delPaneler = prosessStegDef.getPanelDefinisjoner()
        .filter((panelDef: ProsessStegPanelDef) => panelDef.skalVisePanel(behandling, aksjonspunkter, vilkar))
        .map((panelDef: ProsessStegPanelDef) => {
          const pDef = panelDef.skalBrukeOverstyringspanel(aksjonspunkter) ? panelDef.getOverstyringspanelDef() : panelDef;
          return new ProsessStegPanelUtledet(prosessStegDef, pDef, isReadOnlyCheck, aksjonspunkter, vilkar,
            dataForUtledingAvPaneler, toggleOverstyring, rettigheter.kanOverstyreAccess, overstyrteAksjonspunktKoder);
        });
      return new ProsessStegUtledet(prosessStegDef, delPaneler);
    });
};

export const finnValgtPanel = (
  prosessStegPaneler: ProsessStegUtledet[],
  erBehandlingHenlagt: boolean,
  valgtProsessStegPanelKode?: string,
  apentFaktaPanelInfo?: { urlCode: string; textCode: string},
): ProsessStegUtledet => {
  if (valgtProsessStegPanelKode === DEFAULT_PROSESS_STEG_KODE) {
    if (erBehandlingHenlagt) {
      return prosessStegPaneler[prosessStegPaneler.length - 1];
    }
    if (apentFaktaPanelInfo) {
      return undefined;
    }
    const index = prosessStegPaneler.findIndex((i) => i.getErAksjonspunktOpen());
    if (index !== -1) {
      return prosessStegPaneler[index];
    }
    const sistePanel = prosessStegPaneler[prosessStegPaneler.length - 1];
    return sistePanel.getErStegBehandlet() ? sistePanel : undefined;
  }
  return prosessStegPaneler.find((i) => i.getUrlKode() === valgtProsessStegPanelKode);
};

const finnProsessmenyType = (
  status: vilkarUtfallType.OPPFYLT | vilkarUtfallType.IKKE_OPPFYLT | vilkarUtfallType.IKKE_VURDERT,
  harApentAksjonspunkt: boolean,
): StepType => {
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
  prosessStegPaneler: ProsessStegUtledet[],
  valgtProsessStegPanelKode?: string,
): ProsessStegMenyRad[] => prosessStegPaneler.map((panel) => {
  const type = finnProsessmenyType(panel.getStatus(), panel.getErAksjonspunktOpen());
  return {
    labelId: panel.getTekstKode(),
    isActive: panel.getUrlKode() === valgtProsessStegPanelKode,
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
