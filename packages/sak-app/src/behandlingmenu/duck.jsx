import moment from 'moment';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { getLocationWithDefaultBehandlingspunktAndFakta, pathToBehandling } from '@fpsak-frontend/fp-felles';

import fpsakApi from '../data/fpsakApi';
import behandlingEventHandler from '../behandling/BehandlingEventHandler';

const findNewBehandlingId = (behandlingerResponse) => {
  const sortedBehandlinger = behandlingerResponse.payload
    .sort((b1, b2) => moment(b2.opprettet, ISO_DATE_FORMAT).diff(moment(b1.opprettet, ISO_DATE_FORMAT)));
  return sortedBehandlinger[0].id;
};

export const createNewBehandling = (push, saksnummer, erBehandlingValgt, isTilbakekreving, params) => (dispatch) => dispatch((isTilbakekreving
  ? fpsakApi.NEW_BEHANDLING_FPTILBAKE : fpsakApi.NEW_BEHANDLING_FPSAK).makeRestApiRequest()(params))
  .then((response) => {
    const updateBehandlinger = isTilbakekreving ? fpsakApi.BEHANDLINGER_FPTILBAKE : fpsakApi.BEHANDLINGER_FPSAK;
    if (response.payload.saksnummer) { // NEW_BEHANDLING har returnert fagsak
      return dispatch(updateBehandlinger.makeRestApiRequest()({ saksnummer }))
        .then((behandlingerResponse) => {
          const pathname = pathToBehandling(saksnummer, findNewBehandlingId(behandlingerResponse));
          push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname }));
          return Promise.resolve(behandlingerResponse);
        });
    }
    // NEW_BEHANDLING har returnert behandling
    return dispatch(updateBehandlinger.makeRestApiRequest()({ saksnummer }))
      .then(() => push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, response.payload.id) })));
  });

export const sjekkOmTilbakekrevingKanOpprettes = (params) => (dispatch) => dispatch(
  fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.makeRestApiRequest()(params),
);
export const sjekkOmTilbakekrevingRevurderingKanOpprettes = (params) => (dispatch) => dispatch(
  fpsakApi.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES.makeRestApiRequest()(params),
);

export const shelveBehandling = (params) => behandlingEventHandler.henleggBehandling(params);

export const setBehandlingOnHold = (params) => behandlingEventHandler.settBehandlingPaVent(params);

export const resumeBehandling = (params) => behandlingEventHandler.taBehandlingAvVent(params);

export const nyBehandlendeEnhet = (params) => behandlingEventHandler.endreBehandlendeEnhet(params);

// FIXME (TOR) Korleis håndtere dette?
const behandlingUpdater = () => undefined;

export const openBehandlingForChanges = (params, behandlingIdentifier) => (dispatch) => dispatch(fpsakApi.OPEN_BEHANDLING_FOR_CHANGES
  .makeRestApiRequest()(params))
  .then((response) => behandlingUpdater.setBehandlingResult(dispatch, response.payload, behandlingIdentifier.toJson(), { keepData: true }));

export const hentVergeMenyvalg = (params) => (dispatch) => dispatch(fpsakApi.VERGE_MENYVALG.makeRestApiRequest()(params));
// TODO (TOR) To neste funksjonar skal flyttast inn i behandling-pakke etter at lenker ikkje lenger blir henta automatisk.
export const opprettVerge = (push, behandlingIdentifier, versjon) => (dispatch) => dispatch(fpsakApi.VERGE_OPPRETT.makeRestApiRequest()({
  behandlingId: behandlingIdentifier.behandlingId,
  behandlingVersjon: versjon,
})).then(() => Promise.all([
  behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier),
])).then(() => push(getLocationWithDefaultBehandlingspunktAndFakta({
  pathname: pathToBehandling(behandlingIdentifier.saksnummer, behandlingIdentifier.behandlingId),
})));
export const fjernVerge = (push, behandlingIdentifier, versjon) => (dispatch) => dispatch(fpsakApi.VERGE_FJERN.makeRestApiRequest()({
  behandlingId: behandlingIdentifier.behandlingId,
  behandlingVersjon: versjon,
})).then(() => Promise.all([
  behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier),
])).then(() => push(getLocationWithDefaultBehandlingspunktAndFakta({
  pathname: pathToBehandling(behandlingIdentifier.saksnummer, behandlingIdentifier.behandlingId),
})));
