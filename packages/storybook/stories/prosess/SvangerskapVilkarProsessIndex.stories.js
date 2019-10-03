import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SvangerskapVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-svangerskap';

import withReduxProvider from '../../decorators/withRedux';

const alleKodeverk = {
  [kodeverkTyper.AVSLAGSARSAK]: {
    [vilkarType.SVANGERSKAPVILKARET]: [{
      kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
      navn: 'Ingen beregningsregler',
      kodeverk: kodeverkTyper.AVSLAGSARSAK,
    }],
  },
};


export default {
  title: 'prosess/SvangerskapVilkarProsessIndex',
  component: SvangerskapVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <SvangerskapVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', true)}
    status={vilkarUtfallType.IKKE_VURDERT}
    vilkar={[{
      lovReferanse: '§§Dette er en lovreferanse',
    }]}
  />
);

export const visOppfyltVilkår = () => (
  <SvangerskapVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er godkjent',
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', false)}
    status={vilkarUtfallType.OPPFYLT}
    vilkar={[{
      lovReferanse: '§§Dette er en lovreferanse',
    }]}
  />
);

export const visAvslåttVilkår = () => (
  <SvangerskapVilkarProsessIndex
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
        kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er avslått',
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', false)}
    status={vilkarUtfallType.IKKE_OPPFYLT}
    vilkar={[{
      lovReferanse: '§§Dette er en lovreferanse',
    }]}
  />
);
