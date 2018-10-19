import innvilgetIkonUrl from 'images/tilkjent_ytelse.svg';
import innvilgetValgtIkonUrl from 'images/tilkjent_ytelse_valgt.svg';
import ikkeVurdertIkonUrl from 'images/tilkjent_ytelse_disable.svg';
import innvilgetHoverIkonUrl from 'images/tilkjent_ytelse_hover.svg';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';

const tilkjentYtelseImages = {
  imageMap: {
    [vilkarUtfallType.OPPFYLT]: innvilgetIkonUrl,
    [vilkarUtfallType.IKKE_VURDERT]: { true: innvilgetIkonUrl, false: ikkeVurdertIkonUrl },
  },
  selectImageMap: {
    [vilkarUtfallType.OPPFYLT]: innvilgetValgtIkonUrl,
    [vilkarUtfallType.IKKE_VURDERT]: { true: ikkeVurdertIkonUrl, false: innvilgetIkonUrl },
  },
  hooverImageMap: {
    [vilkarUtfallType.OPPFYLT]: innvilgetHoverIkonUrl,
    [vilkarUtfallType.IKKE_VURDERT]: { true: innvilgetHoverIkonUrl, false: ikkeVurdertIkonUrl },
  },
};

export default tilkjentYtelseImages;
