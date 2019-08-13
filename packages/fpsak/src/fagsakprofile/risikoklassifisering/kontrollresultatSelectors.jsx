import { createSelector } from 'reselect';
import { getAksjonspunkter, getBehandlingAnsvarligSaksbehandler } from 'behandling/duck';
import { getRettigheter, getNavAnsatt } from 'navAnsatt/duck';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import fpsakApi from '../../data/fpsakApi';

export const getRisikoaksjonspunkt = createSelector([getAksjonspunkter], aksjonspunkter => (aksjonspunkter
    ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FARESIGNALER)
    : undefined));

export const getReadOnly = createSelector([getRettigheter, getNavAnsatt, getBehandlingAnsvarligSaksbehandler],
     (rettigheter, navAnsatt, ansvarligSaksbehandler) => {
    const { brukernavn, kanSaksbehandle } = navAnsatt;
    if (ansvarligSaksbehandler) {
        return brukernavn !== ansvarligSaksbehandler || !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
    }
    return !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
});

export const getKontrollresultat = createSelector([fpsakApi.KONTROLLRESULTAT.getRestApiData()],
    (kontrollresultat = {}) => (kontrollresultat || undefined));
