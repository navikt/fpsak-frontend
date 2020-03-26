import { createSelector } from 'reselect';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Behandling, Kodeverk } from '@fpsak-frontend/types';

import fpsakApi from '../../data/fpsakApi';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';

const getBehandlingerData = createSelector(
  [fpsakApi.BEHANDLINGER_FPSAK.getRestApiData(), fpsakApi.BEHANDLINGER_FPTILBAKE.getRestApiData()],
  (behandlingerFpsak: Behandling[] = [], behandlingerTilbake: Behandling[] = []) => behandlingerFpsak.concat(behandlingerTilbake),
);

const getBehandlingerFpsakMeta = fpsakApi.BEHANDLINGER_FPSAK.getRestApiMeta();
const getBehandlingerTilbakeMeta = fpsakApi.BEHANDLINGER_FPTILBAKE.getRestApiMeta();

interface MetaData {
  params: {
    saksnummer?: number;
  };
}

// TODO (TOR) Denne bør ikkje eksporterast. Bryt opp i fleire selectors
export const getBehandlinger = createSelector(
  [getSelectedSaksnummer, getBehandlingerData, getBehandlingerFpsakMeta, getBehandlingerTilbakeMeta],
  (saksnummer, behandlingerData, behandlingerFpsakMeta: MetaData = { params: {} }, behandlingerTilbakeMeta: MetaData = { params: {} }) => {
    const hasRequestedBehandling = behandlingerFpsakMeta.params.saksnummer || behandlingerTilbakeMeta.params.saksnummer;
    const isFpsakOk = !behandlingerFpsakMeta.params.saksnummer || behandlingerFpsakMeta.params.saksnummer === saksnummer;
    const isTilbakeOk = !behandlingerTilbakeMeta.params.saksnummer || behandlingerTilbakeMeta.params.saksnummer === saksnummer;
    return hasRequestedBehandling && isFpsakOk && isTilbakeOk ? behandlingerData : undefined;
  },
);

export interface BehandlingerInfo {
  id: number;
  uuid: string;
  type: Kodeverk;
  status: Kodeverk;
  opprettet: string;
  avsluttet?: string;
}

// Skal kun brukes av BehandlingIndex
export const getBehandlingerInfo = createSelector([getBehandlinger], (behandlinger = []): BehandlingerInfo[] => behandlinger
  .map((behandling) => ({
    id: behandling.id,
    uuid: behandling.uuid,
    type: behandling.type,
    status: behandling.status,
    opprettet: behandling.opprettet,
    avsluttet: behandling.avsluttet,
  })));

export const getBehandlingerIds = createSelector([getBehandlinger], (behandlinger = []) => behandlinger.map((b) => b.id));

export const getBehandlingerTypesMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((acc, b) => ({ ...acc, [b.id]: b.type }), {}));

export const getBehandlingerStatusMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((acc, b) => ({ ...acc, [b.id]: b.status }), {}));

export const getBehandlingerAktivPapirsoknadMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((a, b) => ({ ...a, [b.id]: b.erAktivPapirsoknad }), {}));

export const getBehandlingerLinksMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((a, b) => ({ ...a, [b.id]: b.links }), {}));

export const getBehandlingerErPaaVentStatusMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((a, b) => ({ ...a, [b.id]: b.behandlingPaaVent }), {}));

export const getBehandlingerUuidsMappedById = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .reduce((a, b) => ({ ...a, [b.id]: b.uuid }), {}));

export const getNumBehandlinger = createSelector([getBehandlinger], (behandlinger = []) => behandlinger.length);

export const getNoExistingBehandlinger = createSelector([getBehandlinger], (behandlinger = []) => behandlinger.length === 0);

const getSisteLukkedeForsteEllerRevurd = createSelector([getBehandlinger], (behandlinger = []) => behandlinger
  .find((b) => b.gjeldendeVedtak && b.status.kode === behandlingStatus.AVSLUTTET
    && (b.type.kode === behandlingType.FORSTEGANGSSOKNAD || b.type.kode === behandlingType.REVURDERING)));

export const getUuidForSisteLukkedeForsteEllerRevurd = createSelector([getSisteLukkedeForsteEllerRevurd], (behandling) => (behandling
  ? behandling.uuid : undefined));
