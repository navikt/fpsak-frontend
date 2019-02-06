import avregningIkon from '@fpsak-frontend/assets/images/avregning.svg';
import behandleIkonUrl from '@fpsak-frontend/assets/images/avregning_aksjonspunkt.svg';
import behandleValgtIkonUrl from '@fpsak-frontend/assets/images/avregning_aksjonspunkt_valgt.svg';
import innvilgetValgtIkonUrl from '@fpsak-frontend/assets/images/avregning_valgt.svg';
import ikkeVurdertIkonUrl from '@fpsak-frontend/assets/images/avregning_disable.svg';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const avregningImages = {
  imageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleIkonUrl, false: avregningIkon },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avregningIkon,
  },
  selectImageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleValgtIkonUrl, false: innvilgetValgtIkonUrl },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleValgtIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avregningIkon,
  },
  hooverImageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleValgtIkonUrl, false: avregningIkon },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleValgtIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avregningIkon,
  },
};

export default avregningImages;
