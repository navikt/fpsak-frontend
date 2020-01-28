import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingArsaker: [{
    erAutomatiskRevurdering: true,
  }],
  sprakkode: {
    kode: 'NN',
  },
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
};

const familieHendelse = {
  register: {
    avklartBarn: [{
      fodselsdato: '2019-01-10',
      dodsdato: undefined,
    }],
  },
  gjeldende: {
    termindato: '2019-01-01',
    vedtaksDatoSomSvangerskapsuke: '2019-01-01',
  },
};

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
};

const soknadOriginalBehandling = {
  ...soknad,
};
const familiehendelseOriginalBehandling = {
  termindato: '2019-01-01',
  fodselsdato: '2019-01-10',
  antallBarnTermin: 1,
  antallBarnFodsel: 1,
};

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.VARSEL_REVURDERING_MANUELL,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
  },
  begrunnelse: undefined,
}];

export default {
  title: 'prosess/prosess-varsel-om-revurdering',
  component: VarselOmRevurderingProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visForFørstegangsbehandling = () => (
  <VarselOmRevurderingProsessIndex
    behandling={behandling}
    familiehendelse={object('familieHendelse', familieHendelse)}
    soknad={object('soknad', soknad)}
    soknadOriginalBehandling={object('soknadOriginalBehandling', soknadOriginalBehandling)}
    familiehendelseOriginalBehandling={object('familiehendelseOriginalBehandling', familiehendelseOriginalBehandling)}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    dispatchSubmitFailed={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);

export const visForRevurdering = () => (
  <VarselOmRevurderingProsessIndex
    behandling={{
      ...behandling,
      behandlingType: {
        kode: behandlingType.REVURDERING,
      },
    }}
    familiehendelse={object('familieHendelse', familieHendelse)}
    soknad={object('soknad', soknad)}
    soknadOriginalBehandling={object('soknadOriginalBehandling', soknadOriginalBehandling)}
    familiehendelseOriginalBehandling={object('familiehendelseOriginalBehandling', familiehendelseOriginalBehandling)}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    dispatchSubmitFailed={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);
