import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
};

const familieHendelse = {
  gjeldende: {
    omsorgsovertakelseDato: undefined,
    barnetsAnkomstTilNorgeDato: '2019-01-01',
    adopsjonFodelsedatoer: {
      1: '2018-01-01',
      2: '2000-01-02',
    },
    ektefellesBarn: undefined,
    mannAdoptererAlene: undefined,
  },
};

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
  farSokerType: {
    kode: 'ADOPTERER_ALENE',
    kodeverk: 'FAR_SOEKER_TYPE',
  },
};

const personopplysninger = {
  barnSoktFor: [],
};
const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-adopsjon',
  component: AdopsjonFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAdopsjonsvilkåret = () => (
  <AdopsjonFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    personopplysninger={personopplysninger}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.ADOPSJONSDOKUMENTAJON]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isForeldrepengerFagsak
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);

export const visAksjonspunktForOmSøkerErMannSomAdoptererAlene = () => (
  <AdopsjonFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    personopplysninger={personopplysninger}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isForeldrepengerFagsak
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);

export const visAksjonspunktForOmAdopsjonGjelderEktefellesBarn = () => (
  <AdopsjonFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    personopplysninger={personopplysninger}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isForeldrepengerFagsak={boolean('isForeldrepengerFagsak', true)}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);
