import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const soknad = {
  manglendeVedlegg: [{
    dokumentType: {
      kode: dokumentTypeId.INNTEKTSMELDING,
    },
    arbeidsgiver: {
      organisasjonsnummer: '1234',
      fødselsdato: '2019-01-01',
      navn: 'arbeidsgiver1',
    },
  }],
};

export default {
  title: 'prosess/prosess-vilkar-sokers-opplysningsplikt',
  component: SokersOpplysningspliktVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <SokersOpplysningspliktVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    soknad={soknad}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
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
  <SokersOpplysningspliktVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    soknad={soknad}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
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
  <SokersOpplysningspliktVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {
        avslagsarsak: {
          kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
        },
      },
    }}
    soknad={soknad}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
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
