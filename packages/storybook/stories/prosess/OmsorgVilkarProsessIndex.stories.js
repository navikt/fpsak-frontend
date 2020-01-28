import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OmsorgVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-omsorg';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'prosess/prosess-vilkar-omsorg',
  component: OmsorgVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <OmsorgVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
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
  />
);

export const visOppfyltVilkår = () => (
  <OmsorgVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
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
  />
);

export const visAvslåttVilkår = () => (
  <OmsorgVilkarProsessIndex
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
        kode: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
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
  />
);
