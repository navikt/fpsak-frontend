import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandleIkonUrl from '@fpsak-frontend/assets/images/behandle.svg';
import innvilgetIkonUrl from '@fpsak-frontend/assets/images/innvilget.svg';
import ikkeVurdertIkonUrl from '@fpsak-frontend/assets/images/behandle_disable.svg';
import avslattIkonUrl from '@fpsak-frontend/assets/images/avslaatt.svg';
import behandleValgtIkonUrl from '@fpsak-frontend/assets/images/behandle_valgt.svg';
import innvilgetValgtIkonUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import avslattValgtIkonUrl from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import innvilgetHoverIkonUrl from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import avslattHoverIkonUrl from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';


// disabled

const findAnkeIcon = (behandlingspunkt, status, isSelectedBehandlingspunkt, isSelectedBehandlingHenlagt, hasOpenAksjonspunkt) => (isHovering) => {
  if (behandlingspunkt === behandlingspunktCodes.ANKEBEHANDLING) {
    return behandleValgtIkonUrl;
  }
  return ikkeVurdertIkonUrl;
};
export default findAnkeIcon;
