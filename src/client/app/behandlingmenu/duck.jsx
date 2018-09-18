import { createSelector } from 'reselect';
import moment from 'moment';

import { ISO_DATE_FORMAT } from 'utils/formats';
import { pathToBehandling, getLocationWithDefaultBehandlingspunktAndFakta } from 'app/paths';
import { makeRestApiRequest, setDataRestApi } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';
import { updateFagsakInfo, updateBehandlinger } from 'fagsak/duck';
import { updateBehandlingsupportInfo } from 'behandlingsupport/duck';
import { updateBehandling, resetBehandling } from 'behandling/duck';

const findNewBehandlingId = (behandlingerResponse) => {
  const sortedBehandlinger = behandlingerResponse.payload
    .sort((b1, b2) => moment(b2.opprettet, ISO_DATE_FORMAT).diff(moment(b1.opprettet, ISO_DATE_FORMAT)));
  return sortedBehandlinger[0].id;
};

/* Action types */
const HAS_SUBMITTED_PA_VENT_FORM = 'HAS_SUBMITTED_PA_VENT_FORM';
const RESET_BEHANDLING_MENU = 'RESET_BEHANDLING_MENU';

/* Action creators */
export const setHasSubmittedPaVentForm = () => ({
  type: HAS_SUBMITTED_PA_VENT_FORM,
});

export const resetBehandlingMenuData = () => ({
  type: RESET_BEHANDLING_MENU,
});

export const shelveBehandling = makeRestApiRequest(FpsakApi.HENLEGG_BEHANDLING);

export const createNewForstegangsbehandling = (push, saksnummer, params) => dispatch => dispatch(resetBehandling)
  .then(() => dispatch(makeRestApiRequest(FpsakApi.NEW_BEHANDLING)(params)))
  .then((response) => {
    if (response.payload.saksnummer) { // NEW_BEHANDLING har returnert fagsak
      return dispatch(updateBehandlingsupportInfo(saksnummer))
        .then(() => dispatch(setDataRestApi(FpsakApi.FETCH_FAGSAK)(response.payload, { saksnummer }, { keepData: true })))
        .then(() => dispatch(updateBehandlinger(saksnummer)))
        .then((behandlingerResponse) => {
          const pathname = pathToBehandling(saksnummer, findNewBehandlingId(behandlingerResponse));
          push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname }));
          return Promise.resolve(behandlingerResponse);
        });
    }
    // NEW_BEHANDLING har returnert behandling
    return dispatch(updateFagsakInfo(saksnummer))
      .then(() => dispatch(setDataRestApi(FpsakApi.BEHANDLING)(
        response.payload,
        { behandlingId: response.payload.id, saksnummer }, { keepData: true },
      )))
      .then(() => {
        push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, response.payload.id) }));
        return Promise.resolve(response.payload);
      });
  });

const updateFagsakAndBehandlingInfo = behandlingIdentifier => dispatch => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
  .then(() => dispatch(updateBehandling(behandlingIdentifier)));

export const setBehandlingOnHold = (params, behandlingIdentifier) => dispatch => dispatch(makeRestApiRequest(FpsakApi.BEHANDLING_ON_HOLD)(params))
  .then(() => dispatch(setHasSubmittedPaVentForm()))
  .then(() => dispatch(updateFagsakAndBehandlingInfo(behandlingIdentifier)));

export const resumeBehandling = (behandlingIdentifier, params) => dispatch => dispatch(makeRestApiRequest(FpsakApi.RESUME_BEHANDLING)(params))
  .then(response => Promise.all([
    dispatch(updateBehandlingsupportInfo(behandlingIdentifier.saksnummer)),
    dispatch(setDataRestApi(FpsakApi.BEHANDLING)(response.payload, behandlingIdentifier.toJson(), { keepData: true })),
  ]));

export const fetchPreview = makeRestApiRequest(FpsakApi.PREVIEW_MESSAGE);

export const nyBehandlendeEnhet = (params, behandlingIdentifier) => dispatch => dispatch(makeRestApiRequest(FpsakApi.NY_BEHANDLENDE_ENHET)(params))
  .then(() => dispatch(updateFagsakAndBehandlingInfo(behandlingIdentifier)));

export const openBehandlingForChanges = (params, behandlingIdentifier) => dispatch => dispatch(makeRestApiRequest(FpsakApi.OPEN_BEHANDLING_FOR_CHANGES)(params))
  .then(response => dispatch(setDataRestApi(FpsakApi.BEHANDLING)(response.payload, behandlingIdentifier.toJson(), { keepData: true })))
  .then(() => dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer)));

export const previewHenleggBehandling = (behandlingId, brevmalkode) => fetchPreview({
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

// Selectors (Kun de knyttet til reducer)
const getBehandlingMenuContext = state => state.default.behandlingMenuContext;

export const getHasSubmittedPaVentForm = createSelector([getBehandlingMenuContext], behandlingMenuContext => behandlingMenuContext.hasSubmittedPaVentForm);
