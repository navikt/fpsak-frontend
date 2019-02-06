import avslattIkonUrl from '@fpsak-frontend/assets/images/uttak_ikke_oppfylt.svg';
import avslattValgtIkonUrl from '@fpsak-frontend/assets/images/uttak_valgt_ikke_oppfylt.svg';
import avslattHoverIkonUrl from '@fpsak-frontend/assets/images/uttak_valgt_ikke_oppfylt_hover.svg';
import behandleIkonUrl from '@fpsak-frontend/assets/images/uttak_aksjonspunkt.svg';
import behandleValgtIkonUrl from '@fpsak-frontend/assets/images/uttak_valgt_aksjon.svg';
import innvilgetIkonUrl from '@fpsak-frontend/assets/images/uttak.svg';
import innvilgetValgtIkonUrl from '@fpsak-frontend/assets/images/uttak_valgt.svg';
import ikkeVurdertIkonUrl from '@fpsak-frontend/assets/images/uttak_disable.svg';
import innvilgetHoverIkonUrl from '@fpsak-frontend/assets/images/uttak_hover.svg';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const uttakImages = {
  imageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleIkonUrl, false: innvilgetIkonUrl },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattIkonUrl,
  },
  selectImageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleValgtIkonUrl, false: innvilgetValgtIkonUrl },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleValgtIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattValgtIkonUrl,
  },
  hooverImageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleValgtIkonUrl, false: innvilgetHoverIkonUrl },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleValgtIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattHoverIkonUrl,
  },
};

export default uttakImages;
