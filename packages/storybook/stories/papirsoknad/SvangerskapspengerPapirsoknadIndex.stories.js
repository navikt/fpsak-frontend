import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';

import SvangerskapspengerPapirsoknadIndex from '@fpsak-frontend/papirsoknad-svp';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'papirsoknad/papirsoknad-svp',
  component: SvangerskapspengerPapirsoknadIndex,
  decorators: [withKnobs, withReduxProvider],
};

const fagsakPerson = {
  alder: 30,
  erDod: false,
  erKvinne: true,
  navn: 'Petra',
  personnummer: '1234567',
  personstatusType: {
    kode: personstatusType.BOSATT,
  },
};

export const visPapirsoknadForMorVedFødsel = () => (
  <SvangerskapspengerPapirsoknadIndex
    onSubmitUfullstendigsoknad={action('button-click')}
    onSubmit={action('button-click')}
    readOnly={boolean('readOnly', false)}
    soknadData={new SoknadData(fagsakYtelseType.SVANGERSKAPSPENGER, familieHendelseType.FODSEL, foreldreType.MOR)}
    alleKodeverk={alleKodeverk}
    fagsakPerson={fagsakPerson}
  />
);

export const visPapirsoknadForMorVedAdopsjon = () => (
  <SvangerskapspengerPapirsoknadIndex
    onSubmitUfullstendigsoknad={action('button-click')}
    onSubmit={action('button-click')}
    readOnly={boolean('readOnly', false)}
    soknadData={new SoknadData(fagsakYtelseType.SVANGERSKAPSPENGER, familieHendelseType.ADOPSJON, foreldreType.MOR)}
    alleKodeverk={alleKodeverk}
    fagsakPerson={fagsakPerson}
  />
);

export const visPapirsoknadForFarVedFodsel = () => (
  <SvangerskapspengerPapirsoknadIndex
    onSubmitUfullstendigsoknad={action('button-click')}
    onSubmit={action('button-click')}
    readOnly={boolean('readOnly', false)}
    soknadData={new SoknadData(fagsakYtelseType.SVANGERSKAPSPENGER, familieHendelseType.FODSEL, foreldreType.FAR)}
    alleKodeverk={alleKodeverk}
    fagsakPerson={{
      ...fagsakPerson,
      erKvinne: false,
    }}
  />
);
