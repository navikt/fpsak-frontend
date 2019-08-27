import { createSelector } from 'reselect';

import { getSelectedFagsakStatus, getSelectedFagsak } from 'fagsak/fagsakSelectors';
import {
  getSoknad, getAksjonspunkter, getBehandlingType, getBehandlingStatus,
  getBehandlingAnsvarligSaksbehandler,
} from 'behandling/duck';
import fpsakApi from 'data/fpsakApi';

import { allAccessRights } from './access';

/* Action creators */
export const fetchNavAnsatt = fpsakApi.NAV_ANSATT.makeRestApiRequest();

/* selectors */
export const getNavAnsatt = createSelector(
  [fpsakApi.NAV_ANSATT.getRestApiData()],
  (navAnsattData) => navAnsattData || {},
);
export const getRettigheter = createSelector([getNavAnsatt, getSelectedFagsakStatus, getBehandlingStatus, getSoknad,
  getAksjonspunkter, getBehandlingType, getBehandlingAnsvarligSaksbehandler, getSelectedFagsak], allAccessRights);
