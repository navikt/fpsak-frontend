import { createSelector } from 'reselect';
import moment from 'moment';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { reducerRegistry, pathToBehandling, getLocationWithDefaultBehandlingspunktAndFakta } from '@fpsak-frontend/fp-felles';
import fpsakApi from 'data/fpsakApi';
import { updateFagsakInfo, updateBehandlinger } from 'fagsak/duck';
import { updateBehandlingsupportInfo } from 'behandlingsupport/duck';
import behandlingUpdater from 'behandling/BehandlingUpdater';

const findNewBehandlingId = (behandlingerResponse) => {
  const sortedBehandlinger = behandlingerResponse.payload
    .sort((b1, b2) => moment(b2.opprettet, ISO_DATE_FORMAT).diff(moment(b1.opprettet, ISO_DATE_FORMAT)));
  return sortedBehandlinger[0].id;
};

const reducerName = 'behandlingMenu';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const HAS_SUBMITTED_PA_VENT_FORM = actionType('HAS_SUBMITTED_PA_VENT_FORM');
const RESET_BEHANDLING_MENU = actionType('RESET_BEHANDLING_MENU');

/* Action creators */
export const setHasSubmittedPaVentForm = () => ({
  type: HAS_SUBMITTED_PA_VENT_FORM,
});

export const resetBehandlingMenuData = () => ({
  type: RESET_BEHANDLING_MENU,
});

export const shelveBehandling = (params) => (dispatch) => dispatch(fpsakApi.HENLEGG_BEHANDLING.makeRestApiRequest()(params));

// TODO (TOR) Refaktorer denne! Og burde heller kalla dispatch(resetBehandlingContext()) enn behandlingUpdater.resetBehandling(dispatch) (ta vekk if/else)
export const createNewForstegangsbehandling = (push, saksnummer, erBehandlingValgt, params) => (dispatch) => {
  const resetOrNothing = erBehandlingValgt ? behandlingUpdater.resetBehandling(dispatch) : Promise.resolve();
  return resetOrNothing
    .then(() => dispatch(fpsakApi.NEW_BEHANDLING.makeRestApiRequest()(params)))
    .then((response) => {
      if (response.payload.saksnummer) { // NEW_BEHANDLING har returnert fagsak
        return dispatch(updateBehandlingsupportInfo(saksnummer))
          .then(() => dispatch(fpsakApi.FETCH_FAGSAK.setDataRestApi()(response.payload, { saksnummer }, { keepData: true })))
          .then(() => dispatch(updateBehandlinger(saksnummer)))
          .then((behandlingerResponse) => {
            const pathname = pathToBehandling(saksnummer, findNewBehandlingId(behandlingerResponse));
            push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname }));
            return Promise.resolve(behandlingerResponse);
          });
      }
      // NEW_BEHANDLING har returnert behandling
      return dispatch(updateFagsakInfo(saksnummer))
        .then(() => {
          push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, response.payload.id) }));
          return Promise.resolve(response.payload);
        });
    });
};

const updateFagsakAndBehandlingInfo = (behandlingIdentifier) => (dispatch) => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier));

export const setBehandlingOnHold = (params, behandlingIdentifier) => (dispatch) => dispatch(fpsakApi.BEHANDLING_ON_HOLD.makeRestApiRequest()(params))
  .then(() => dispatch(setHasSubmittedPaVentForm()))
  .then(() => dispatch(updateFagsakAndBehandlingInfo(behandlingIdentifier)));

export const resumeBehandling = (behandlingIdentifier, params) => (dispatch) => dispatch(fpsakApi.RESUME_BEHANDLING.makeRestApiRequest()(params))
  .then((response) => Promise.all([
    dispatch(updateBehandlingsupportInfo(behandlingIdentifier.saksnummer)),
    behandlingUpdater.setBehandlingResult(dispatch, response.payload, behandlingIdentifier.toJson(), { keepData: true }),
  ]));

export const nyBehandlendeEnhet = (params, behandlingIdentifier) => (dispatch) => dispatch(
  fpsakApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest()(params),
)
  .then(() => dispatch(updateFagsakAndBehandlingInfo(behandlingIdentifier)));

export const openBehandlingForChanges = (params, behandlingIdentifier) => (dispatch) => dispatch(fpsakApi.OPEN_BEHANDLING_FOR_CHANGES
  .makeRestApiRequest()(params))
  .then((response) => behandlingUpdater.setBehandlingResult(dispatch, response.payload, behandlingIdentifier.toJson(), { keepData: true }))
  .then(() => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer)));

export const previewHenleggBehandling = (behandlingId, brevmalkode) => (dispatch) => behandlingUpdater.previewMessage(dispatch, {
  behandlingId,
  brevmalkode,
  fritekst: ' ',
  mottaker: 'Søker',
});

/* Reducer */
const initialState = {
  hasSubmittedPaVentForm: false,
};

export const behandlingMenuReducer = (state = initialState, action = {}) => {
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case HAS_SUBMITTED_PA_VENT_FORM:
      return {
        ...state,
        hasSubmittedPaVentForm: true,
      };
    case RESET_BEHANDLING_MENU:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, behandlingMenuReducer);

// Selectors (Kun de knyttet til reducer)
const getBehandlingMenuContext = (state) => state.default[reducerName];

export const getHasSubmittedPaVentForm = createSelector([getBehandlingMenuContext], (behandlingMenuContext) => behandlingMenuContext.hasSubmittedPaVentForm);
