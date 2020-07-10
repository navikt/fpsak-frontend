import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SoknadsfristVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-soknadsfrist';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const vilkar = [{
  vilkarType: {
    kode: vilkarType.SOKNADFRISTVILKARET,
  },
  merknadParametere: {
    antallDagerSoeknadLevertForSent: '2',
  },
}];
const soknad = {
  soknadType: {
    kode: soknadType.FODSEL,
  },
  mottattDato: '2019-01-01',
  fodselsdatoer: { 1: '2019-01-01' },
  begrunnelseForSenInnsending: 'Dette er en begrunnelse',
};
const familiehendelse = {
  gjeldende: {
    fodselsdato: '2019-01-02',
  },
};

export default {
  title: 'prosess/prosess-vilkar-soknadsfrist',
  component: SoknadsfristVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <SoknadsfristVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    vilkar={vilkar}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familiehendelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
      },
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    status={vilkarUtfallType.IKKE_VURDERT}
  />
);

export const visOppfyltVilkår = () => (
  <SoknadsfristVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    vilkar={vilkar}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familiehendelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er godkjent',
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
      },
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.OPPFYLT}
  />
);

export const visAvslåttVilkår = () => (
  <SoknadsfristVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {
        avslagsarsak: {
          kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
        },
      },
    }}
    vilkar={vilkar}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familiehendelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette vilkåret er avslått',
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
      },
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.IKKE_OPPFYLT}
  />
);
