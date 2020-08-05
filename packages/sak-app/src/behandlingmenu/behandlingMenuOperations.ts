import { getLocationWithDefaultProsessStegAndFakta, pathToBehandling } from '../app/paths';
import behandlingEventHandler from '../behandling/BehandlingEventHandler';

export const shelveBehandling = (params: any) => behandlingEventHandler.henleggBehandling(params);

export const setBehandlingOnHold = (params: any) => behandlingEventHandler.settBehandlingPaVent(params);

export const resumeBehandling = (params: any) => behandlingEventHandler.taBehandlingAvVent(params);

export const nyBehandlendeEnhet = (params: any) => behandlingEventHandler.endreBehandlendeEnhet(params);

export const openBehandlingForChanges = (params: any) => behandlingEventHandler.opneBehandlingForEndringer(params);

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
