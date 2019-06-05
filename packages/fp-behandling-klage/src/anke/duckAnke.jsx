import { reducerRegistry } from '@fpsak-frontend/fp-felles';

const reducerName = 'ankeBehandling';

/* Reducer */
const initialState = {
  behandlingId: undefined,
  fagsakSaksnummer: undefined,
  featureToggles: {},
  kodeverk: {},
  fagsak: {},
  hasShownBehandlingPaVent: false,
  avsluttedeBehandlinger: [],
};

const fpsakBehandlingReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, fpsakBehandlingReducer);
