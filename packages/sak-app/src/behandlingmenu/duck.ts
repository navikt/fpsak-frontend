import moment from 'moment';

import { getLocationWithDefaultProsessStegAndFakta, pathToBehandling } from '../app/paths';
import fpsakApi from '../data/fpsakApi';
import behandlingEventHandler from '../behandling/BehandlingEventHandler';

const findNewBehandlingId = (behandlingerResponse) => {
  const sortedBehandlinger = behandlingerResponse.payload
    .sort((b1, b2) => moment(b2.opprettet).diff(moment(b1.opprettet)));
  return sortedBehandlinger[0].id;
};

export const createNewBehandling = (location, push) => (saksnummer, behandlingId,
  behandlingVersion, isTilbakekreving, params) => (dispatch) => dispatch((isTilbakekreving
  ? fpsakApi.NEW_BEHANDLING_FPTILBAKE : fpsakApi.NEW_BEHANDLING_FPSAK).makeRestApiRequest()(params))
  .then((response) => {
    const updateBehandlinger = isTilbakekreving ? fpsakApi.BEHANDLINGER_FPTILBAKE : fpsakApi.BEHANDLINGER_FPSAK;
    if (response.payload.saksnummer) { // NEW_BEHANDLING har returnert fagsak
      const meta = {
        keepData: true,
        cacheParams: { behandlingId, behandlingVersion },
      };
      return dispatch(updateBehandlinger.makeRestApiRequest()({ saksnummer }, meta))
        .then((behandlingerResponse) => {
          const pathname = pathToBehandling(saksnummer, findNewBehandlingId(behandlingerResponse));
          push(getLocationWithDefaultProsessStegAndFakta({ ...location, pathname }));
          return Promise.resolve(behandlingerResponse);
        });
    }
    // NEW_BEHANDLING har returnert behandling
    return dispatch(updateBehandlinger.makeRestApiRequest()({ saksnummer }))
      .then(() => push(getLocationWithDefaultProsessStegAndFakta({
        ...location,
        pathname: pathToBehandling(saksnummer, response.payload.id),
      })));
  });

export const sjekkOmTilbakekrevingKanOpprettes = (params) => (dispatch) => dispatch(
  fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.makeRestApiRequest()(params),
);
export const sjekkOmTilbakekrevingRevurderingKanOpprettes = (params) => (dispatch) => dispatch(
  fpsakApi.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES.makeRestApiRequest()(params),
);

export const hentVergeMenyvalg = (params: {}) => (dispatch) => dispatch(fpsakApi.VERGE_MENYVALG.makeRestApiRequest()(params));
export const resetVergeMenyvalg = () => (dispatch) => dispatch(fpsakApi.VERGE_MENYVALG.resetRestApi()());

export const shelveBehandling = (params: {}) => behandlingEventHandler.henleggBehandling(params);

export const setBehandlingOnHold = (params: {}) => behandlingEventHandler.settBehandlingPaVent(params);

export const resumeBehandling = (params: {}) => behandlingEventHandler.taBehandlingAvVent(params);

export const nyBehandlendeEnhet = (params: {}) => behandlingEventHandler.endreBehandlendeEnhet(params);

export const openBehandlingForChanges = (params: {}) => behandlingEventHandler.opneBehandlingForEndringer(params);

export const opprettVerge = (location, push, saksnummer, behandlingId, versjon) => () => behandlingEventHandler.opprettVerge({
  behandlingId,
  behandlingVersjon: versjon,
}).then(() => push(getLocationWithDefaultProsessStegAndFakta({
  ...location,
  pathname: pathToBehandling(saksnummer, behandlingId),
})));

export const fjernVerge = (location, push, saksnummer, behandlingId, versjon) => () => behandlingEventHandler.fjernVerge({
  behandlingId,
  behandlingVersjon: versjon,
}).then(() => push(getLocationWithDefaultProsessStegAndFakta({
  ...location,
  pathname: pathToBehandling(saksnummer, behandlingId),
})));
