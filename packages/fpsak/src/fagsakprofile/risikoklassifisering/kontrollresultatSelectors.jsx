import { createSelector } from 'reselect';
import { getAksjonspunkter, getSelectedBehandlingId } from 'behandling/duck';
import { getRettigheter, getNavAnsatt } from 'navAnsatt/duck';

import { getBehandlingerErPaaVentStatusMappedById } from 'behandling/selectors/behandlingerSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import fpsakApi from '../../data/fpsakApi';

export const getRisikoaksjonspunkt = createSelector([getAksjonspunkter], (aksjonspunkter) => (aksjonspunkter
  ? aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.VURDER_FARESIGNALER)
  : undefined));

export const getReadOnly = createSelector([getRettigheter, getNavAnsatt, getBehandlingerErPaaVentStatusMappedById, getSelectedBehandlingId],
  (rettigheter, navAnsatt, erPaaVentMap, selectedBehandlingId) => {
    const erPaaVent = erPaaVentMap && getSelectedBehandlingId ? erPaaVentMap[selectedBehandlingId] : false;
    if (erPaaVent) {
      return true;
    }
    const { kanSaksbehandle } = navAnsatt;
    return !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
  });

export const getKontrollresultat = createSelector([fpsakApi.KONTROLLRESULTAT.getRestApiData()],
  (kontrollresultat = {}) => (kontrollresultat || undefined));
