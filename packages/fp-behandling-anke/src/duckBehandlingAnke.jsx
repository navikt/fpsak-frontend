import { getBehandlingRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import ankeBehandlingApi, { AnkeBehandlingApiKeys } from './data/ankeBehandlingApi';

const reducerName = 'ankeBehandling';

const behandlingRedux = getBehandlingRedux(reducerName, ankeBehandlingApi, AnkeBehandlingApiKeys);

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
  getSelectedBehandlingId,
} = behandlingRedux.selectors;
