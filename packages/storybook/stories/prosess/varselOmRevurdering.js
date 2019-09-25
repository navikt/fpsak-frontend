import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';

import withReduxProvider from '../../decorators/withRedux';

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

const originalBehandling = {
  soknad,
  familiehendelse: {
    termindato: '2019-01-01',
    fodselsdato: '2019-01-10',
    antallBarnTermin: 1,
    antallBarnFodsel: 1,
  },
};

const alleKodeverk = {
  [kodeverkTyper.VENTEARSAK]: [{
    kode: 'test',
  }],
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

const stories = storiesOf('prosess/VarselOmRevurderingProsessIndex', module)
  .addDecorator(withKnobs)
  .addDecorator(withReduxProvider);

stories.add('Vis for Førstegangsbehandling', () => (
  <VarselOmRevurderingProsessIndex
    behandling={behandling}
    familiehendelse={object('familieHendelse', familieHendelse)}
    soknad={object('soknad', soknad)}
    originalBehandling={object('originalBehandling', originalBehandling)}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    dispatchSubmitFailed={action('button-click')}
    readOnly={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
));

stories.add('Vis for Revurdering', () => (
  <VarselOmRevurderingProsessIndex
    behandling={{
      ...behandling,
      behandlingType: {
        kode: behandlingType.REVURDERING,
      },
    }}
    familiehendelse={object('familieHendelse', familieHendelse)}
    soknad={object('soknad', soknad)}
    originalBehandling={object('originalBehandling', originalBehandling)}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    dispatchSubmitFailed={action('button-click')}
    readOnly={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
));
