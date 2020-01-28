import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ForeldreansvarVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-foreldreansvar';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'prosess/prosess-vilkar-foreldreansvar',
  component: ForeldreansvarVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt2Ledd = () => (
  <ForeldreansvarVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    status={vilkarUtfallType.IKKE_VURDERT}
    isEngangsstonad={boolean('isEngangsstonad', false)}
    isForeldreansvar2Ledd={boolean('isForeldreansvar2Ledd', true)}
  />
);

export const visOppfyltVilkår2Ledd = () => (
  <ForeldreansvarVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er godkjent',
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.OPPFYLT}
    isEngangsstonad={boolean('isEngangsstonad', false)}
    isForeldreansvar2Ledd={boolean('isForeldreansvar2Ledd', true)}
  />
);

export const visAvslåttVilkår2Ledd = () => (
  <ForeldreansvarVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {
        avslagsarsak: {
          kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
        },
      },
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er avslått',
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.IKKE_OPPFYLT}
    isEngangsstonad={boolean('isEngangsstonad', false)}
    isForeldreansvar2Ledd={boolean('isForeldreansvar2Ledd', true)}
  />
);

export const visÅpentAksjonspunkt4Ledd = () => (
  <ForeldreansvarVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    status={vilkarUtfallType.IKKE_VURDERT}
    isEngangsstonad={false}
    isForeldreansvar2Ledd={boolean('isForeldreansvar2Ledd', false)}
  />
);

export const visOppfyltVilkår4Ledd = () => (
  <ForeldreansvarVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er godkjent',
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.OPPFYLT}
    isEngangsstonad={false}
    isForeldreansvar2Ledd={boolean('isForeldreansvar2Ledd', false)}
  />
);

export const visAvslåttVilkår4Ledd = () => (
  <ForeldreansvarVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {
        avslagsarsak: {
          kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
        },
      },
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er avslått',
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.IKKE_OPPFYLT}
    isEngangsstonad={false}
    isForeldreansvar2Ledd={boolean('isForeldreansvar2Ledd', false)}
  />
);
