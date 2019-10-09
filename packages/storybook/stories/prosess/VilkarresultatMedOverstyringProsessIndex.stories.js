import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

import withReduxProvider from '../../decorators/withRedux';

const avslagsarsaker = {
  [vilkarType.FODSELSVILKARET_MOR]: [{
    kode: 'test',
    navn: 'test',
  }],
};

export default {
  title: 'prosess/VilkarresultatMedOverstyringProsessIndex',
  component: VilkarresultatMedOverstyringProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <VilkarresultatMedOverstyringProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      type: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
    }}
    medlemskap={{
      fom: '2019-01-01',
    }}
    submitCallback={action('button-click')}
    overrideReadOnly={boolean('overrideReadOnly', false)}
    kanOverstyreAccess={object('kanOverstyreAccess', {
      isEnabled: true,
    })}
    toggleOverstyring={action('button-click')}
    fagsakYtelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
    }}
    avslagsarsaker={avslagsarsaker}
    aksjonspunkter={[]}
    behandlingspunktAksjonspunkter={[]}
    behandlingspunktStatus={vilkarUtfallType.OPPFYLT}
    behandlingspunktVilkar={[{
      vilkarType: {
        kode: vilkarType.FODSELSVILKARET_MOR,
      },
      lovReferanse: '§§ Dette er en lovreferanse',
    }]}
    behandlingspunktOverridden={false}
    behandlingspunktOverrideReadOnly={boolean('behandlingspunktOverrideReadOnly', false)}
    behandlingspunktTitleCode="test"
    behandlingspunkt={behandlingspunktCodes.FOEDSEL}
  />
);
