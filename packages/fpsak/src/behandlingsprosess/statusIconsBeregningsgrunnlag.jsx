import avslattIkonUrl from 'images/beregn_ikke_oppfylt.svg';
import avslattValgtIkonUrl from 'images/beregn_valgt_ikke_oppfylt.svg';
import avslattHoverIkonUrl from 'images/beregn_valgt_ikke_oppfylt_hover.svg';
import behandleIkonUrl from 'images/beregn_aksjonspunkt.svg';
import behandleValgtIkonUrl from 'images/beregn_valgt_aksjon.svg';
import innvilgetIkonUrl from 'images/beregn.svg';
import innvilgetValgtIkonUrl from 'images/beregn_valgt.svg';
import ikkeVurdertIkonUrl from 'images/beregn_disable.svg';
import innvilgetHoverIkonUrl from 'images/beregn_hover.svg';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';

const beregningsgrunnlagImages = {
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

export default beregningsgrunnlagImages;
