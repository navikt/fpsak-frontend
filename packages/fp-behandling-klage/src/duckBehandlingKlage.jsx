import { createSelector } from 'reselect';

import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import klageBehandlingApi, { KlageBehandlingApiKeys } from './data/klageBehandlingApi';

const reducerName = 'klageBehandling';

const additionalInitalState = {
  avsluttedeBehandlinger: [],
};

const behandlingRedux = getBehandlingRedux(reducerName, klageBehandlingApi, KlageBehandlingApiKeys, additionalInitalState);

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
  getKodeverk,
  getAlleKodeverk,
  getSelectedBehandlingId,
  getSelectedSaksnummer,
} = behandlingRedux.selectors;

export const getAvsluttedeBehandlinger = createSelector([behandlingRedux.selectors.getBehandlingContext],
  behandlingContext => behandlingContext.avsluttedeBehandlinger);
