import { createSelector } from 'reselect';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import tilbakekrevingBehandlingApi, { TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';

const reducerName = 'tilbakekrevingBehandling';

const additionalInitialState = {
  fagsakBehandlingerInfo: [],
};

const behandlingRedux = getBehandlingRedux(reducerName, tilbakekrevingBehandlingApi, TilbakekrevingBehandlingApiKeys, additionalInitialState);

// Eksportert kun for test
export const { reducer } = behandlingRedux;

reducerRegistry.register(reducerName, behandlingRedux.reducer);

export const {
  fetchBehandling,
  resetBehandling,
  resetBehandlingFpsakContext,
  setBehandlingInfo,
  setHasShownBehandlingPaVent,
  updateBehandling,
  updateOnHold,
} = behandlingRedux.actionCreators;
export const {
  getBehandlingIdentifier,
  getFagsakPerson,
  getFagsakStatus,
  getFagsakYtelseType,
  getHasShownBehandlingPaVent,
  getSelectedBehandlingId,
  getNavAnsatt,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
} = behandlingRedux.selectors;

export const fetchPreviewVedtaksbrev = (vedtaksbrevdata) => (dispatch) => dispatch(
  tilbakekrevingBehandlingApi.PREVIEW_VEDTAKSBREV.makeRestApiRequest()(vedtaksbrevdata),
);

export const getTilbakekrevingKodeverk = (kodeverkType) => createSelector(
  [tilbakekrevingBehandlingApi.TILBAKE_KODEVERK.getRestApiData()], (kodeverk = {}) => kodeverk[kodeverkType],
);
export const getAlleTilbakekrevingKodeverk = createSelector(
  [tilbakekrevingBehandlingApi.TILBAKE_KODEVERK.getRestApiData()], (kodeverk = {}) => kodeverk,
);

export const hasOpenRevurdering = createSelector([behandlingRedux.selectors.getBehandlingContext],
  (behandlingContext) => behandlingContext.fagsakBehandlingerInfo
    .some((b) => b.type.kode === behandlingType.REVURDERING && b.status.kode !== behandlingStatus.AVSLUTTET));
