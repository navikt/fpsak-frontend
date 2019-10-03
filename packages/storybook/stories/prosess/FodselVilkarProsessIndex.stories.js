import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';

import withReduxProvider from '../../decorators/withRedux';

const alleKodeverk = {
  [kodeverkTyper.AVSLAGSARSAK]: {
    [vilkarType.FODSELSVILKARET_MOR]: [{
      kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
      navn: 'Ingen beregningsregler',
      kodeverk: kodeverkTyper.AVSLAGSARSAK,
    }],
  },
};


export default {
  title: 'prosess/FodselVilkarProsessIndex',
  component: FodselVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <FodselVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
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
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
  />
);

export const visOppfyltVilkår = () => (
  <FodselVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
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
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
  />
);

export const visAvslåttVilkår = () => (
  <FodselVilkarProsessIndex
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
        kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
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
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
  />
);
