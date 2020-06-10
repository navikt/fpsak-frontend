import React from 'react';

import { LegendBox } from '@fpsak-frontend/tidslinje';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import fodselUrl from '@fpsak-frontend/assets/images/fodsel.svg';
import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import soknadUrl from '@fpsak-frontend/assets/images/soknad.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import revurderingUrl from '@fpsak-frontend/assets/images/endringstidspunkt.svg';
import gradertImage from '@fpsak-frontend/assets/images/periode_gradert.svg';
import manueltAvklart from '@fpsak-frontend/assets/images/periode_manuelt_avklart.svg';

export default {
  title: 'tidslinje/Legendbox',
  component: LegendBox,
};

const legends = [
  {
    src: oppfyltUrl,
    text: 'Oppfylt periode',
  },
  {
    src: fodselUrl,
    text: 'Familiehendelse',
  },
  {
    src: ikkeOppfyltUrl,
    text: 'Ikke oppfylt periode',
  },
  {
    src: soknadUrl,
    text: 'Random periode',
  },
  {
    src: uavklartUrl,
    text: 'Something else periode',
  },
  {
    src: revurderingUrl,
    text: 'Revurderings periode',
  },
  {
    src: gradertImage,
    text: 'Gradert periode',
  },
  {
    src: manueltAvklart,
    text: 'Manuell periode',
  },
];

export const normal = () => (
  <div style={{ width: '200px' }}>
    <LegendBox legends={legends} />
  </div>
);
