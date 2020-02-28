import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';

import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'sak/sak-visittkort',
  component: VisittkortSakIndex,
  decorators: [withKnobs],
};

const fagsak = {};
const familieHendelse = {};

export const visVisittkortNårEnHarBegrensetMedInformasjon = () => (
  <VisittkortSakIndex
    fagsak={fagsak}
    familieHendelse={familieHendelse}
    lenkeTilAnnenPart="testlenke til annen part"
    alleKodeverk={alleKodeverk}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
  />
);
