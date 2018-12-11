import { createSelector } from 'reselect';
import fpsakApi from 'data/fpsakApi';
import { getAksjonspunkter } from 'behandlingFpsak/behandlingSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

/* Action types */
export const RESET_REGISTRERING = 'RESET_REGISTRERING';
export const SET_SOKNAD_DATA = 'SET_SOKNAD_DATA';

/* Action creators */
export const resetRegistrering = () => ({
  type: RESET_REGISTRERING,
});

export const setSoknadData = soknadData => ({
  type: SET_SOKNAD_DATA,
  data: soknadData,
});

export const submitRegistrering = fpsakApi.SAVE_AKSJONSPUNKT.makeRestApiRequest();

export const resetRegistreringSuccess = fpsakApi.SAVE_AKSJONSPUNKT.resetRestApi();


/* Reducer */
const initialState = {
  soknadData: null,
};

export const papirsoknadReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SOKNAD_DATA:
      return {
        ...state,
        soknadData: action.data,
      };
    case RESET_REGISTRERING:
      return initialState;
    default:
      return state;
  }
};

/* Selectors */
const getPapirsoknadContext = state => state.default.papirsoknadContext;

export const getSoknadData = createSelector(
  [getPapirsoknadContext],
  (papirsoknadContext = {}) => papirsoknadContext.soknadData,
);

export const getPapirsoknadEnabled = createSelector(
  [getAksjonspunkter],
  (aksjonspunkter = []) => (
    aksjonspunkter.some(ap => (ap.definisjon.kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD
    || ap.definisjon.kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_FORELDREPENGER
      || ap.definisjon.kode === aksjonspunktCodes.REGISTRER_PAPIR_ENDRINGSØKNAD_FORELDREPENGER) && ap.status.kode === aksjonspunktStatus.OPPRETTET)
  ),
);

const getFormState = state => state.form;
export const getRegisteredFields = formName => createSelector(
  [getFormState],
  (formState = {}) => (formState[formName] ? formState[formName].registeredFields : {}),
);
