import { createSelector } from 'reselect';
import moment from 'moment';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { pathToBehandling, getLocationWithDefaultBehandlingspunktAndFakta } from 'app/paths';
import fpsakApi from 'data/fpsakApi';
import { updateFagsakInfo, updateBehandlinger } from 'fagsak/duck';
import { updateBehandlingsupportInfo } from 'behandlingsupport/duck';
import behandlingUpdater from 'behandling/BehandlingUpdater';
import reducerRegistry from '../ReducerRegistry';

const findNewBehandlingId = (behandlingerResponse) => {
  const sortedBehandlinger = behandlingerResponse.payload
    .sort((b1, b2) => moment(b2.opprettet, ISO_DATE_FORMAT).diff(moment(b1.opprettet, ISO_DATE_FORMAT)));
  return sortedBehandlinger[0].id;
};

const reducerName = 'behandlingMenu';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
const HAS_SUBMITTED_PA_VENT_FORM = actionType('HAS_SUBMITTED_PA_VENT_FORM');
const RESET_BEHANDLING_MENU = actionType('RESET_BEHANDLING_MENU');

/* Action creators */
export const setHasSubmittedPaVentForm = () => ({
  type: HAS_SUBMITTED_PA_VENT_FORM,
});

export const resetBehandlingMenuData = () => ({
  type: RESET_BEHANDLING_MENU,
});

export const shelveBehandling = params => dispatch => behandlingUpdater.shelveBehandling(dispatch, params);

export const createNewForstegangsbehandling = (push, saksnummer, params) => dispatch => behandlingUpdater.resetBehandling(dispatch)
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
      .then(() => behandlingUpdater.setBehandlingResult(dispatch, response.payload,
        { behandlingId: response.payload.id, saksnummer }, { keepData: true }))
      .then(() => {
        push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, response.payload.id) }));
        return Promise.resolve(response.payload);
      });
  });

const updateFagsakAndBehandlingInfo = behandlingIdentifier => dispatch => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier));

export const setBehandlingOnHold = (params, behandlingIdentifier) => dispatch => behandlingUpdater.setBehandlingOnHold(dispatch, params)
  .then(() => dispatch(setHasSubmittedPaVentForm()))
  .then(() => dispatch(updateFagsakAndBehandlingInfo(behandlingIdentifier)));

export const resumeBehandling = (behandlingIdentifier, params) => dispatch => behandlingUpdater.resumeBehandling(dispatch, params)
  .then(response => Promise.all([
    dispatch(updateBehandlingsupportInfo(behandlingIdentifier.saksnummer)),
    behandlingUpdater.setBehandlingResult(dispatch, response.payload, behandlingIdentifier.toJson(), { keepData: true }),
  ]));

export const nyBehandlendeEnhet = (params, behandlingIdentifier) => dispatch => behandlingUpdater.changeBehandlendeEnhet(dispatch, params)
  .then(() => dispatch(updateFagsakAndBehandlingInfo(behandlingIdentifier)));

export const openBehandlingForChanges = (params, behandlingIdentifier) => dispatch => behandlingUpdater.openBehandlingForChanges(dispatch, params)
  .then(response => behandlingUpdater.setBehandlingResult(dispatch, response.payload, behandlingIdentifier.toJson(), { keepData: true }))
  .then(() => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer)));

export const previewHenleggBehandling = (behandlingId, brevmalkode) => dispatch => behandlingUpdater.previewMessage(dispatch, {
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
const getBehandlingMenuContext = state => state.default[reducerName];

export const getHasSubmittedPaVentForm = createSelector([getBehandlingMenuContext], behandlingMenuContext => behandlingMenuContext.hasSubmittedPaVentForm);
