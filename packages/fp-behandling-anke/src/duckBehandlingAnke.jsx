import { createSelector } from 'reselect';

import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import ankeBehandlingApi, { AnkeBehandlingApiKeys } from './data/ankeBehandlingApi';

const reducerName = 'ankeBehandling';

const additionalInitalState = {
  avsluttedeBehandlinger: [],
  ankevurdering: {},
};

const behandlingRedux = getBehandlingRedux(reducerName, ankeBehandlingApi, AnkeBehandlingApiKeys, additionalInitalState);

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
  getSelectedBehandlingId,
} = behandlingRedux.selectors;

export const getAvsluttedeBehandlinger = createSelector([behandlingRedux.selectors.getBehandlingContext],
  behandlingContext => behandlingContext.avsluttedeBehandlinger);
