import { createSelector } from 'reselect';

import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import tilbakekrevingBehandlingApi, { TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';

const reducerName = 'tilbakekrevingBehandling';

const behandlingRedux = getBehandlingRedux(reducerName, tilbakekrevingBehandlingApi, TilbakekrevingBehandlingApiKeys);

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
  getFagsakYtelseType,
  getHasShownBehandlingPaVent,
  getSelectedBehandlingId,
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
