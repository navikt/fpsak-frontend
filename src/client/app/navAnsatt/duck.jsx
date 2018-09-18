import { createSelector } from 'reselect';

import { getSelectedFagsakStatus, getSelectedFagsak } from 'fagsak/fagsakSelectors';
import {
  getSoknad, getAksjonspunkter, getBehandlingType, getBehandlingStatus,
  getBehandlingAnsvarligSaksbehandler,
} from 'behandling/behandlingSelectors';
import { getRestApiData, makeRestApiRequest } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';

import { allAccessRights } from './access';

/* Action creators */
export const fetchNavAnsatt = makeRestApiRequest(FpsakApi.NAV_ANSATT);

/* selectors */
export const getNavAnsatt = createSelector(
  [getRestApiData(FpsakApi.NAV_ANSATT)],
  navAnsattData => navAnsattData || {},
);
export const getRettigheter = createSelector([getNavAnsatt, getSelectedFagsakStatus, getBehandlingStatus, getSoknad,
  getAksjonspunkter, getBehandlingType, getBehandlingAnsvarligSaksbehandler, getSelectedFagsak], allAccessRights);
