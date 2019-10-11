import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import MeldingerSakIndex, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import withReduxProvider from '../../decorators/withRedux';

const recipients = ['Søker'];
const templates = [{
  kode: dokumentMalType.INNHENT_DOK,
  navn: 'Innhent dokumentasjon',
  tilgjengelig: true,
}, {
  kode: dokumentMalType.REVURDERING_DOK,
  navn: 'Revurderingsdokumentasjon',
  tilgjengelig: true,
}];

const sprakKode = {};

export default {
  title: 'sak/MeldingerSakIndex',
  component: MeldingerSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visMeldingerPanel = () => (
  <div style={{
    width: '600px', margin: '50px', padding: '20px', backgroundColor: 'white',
  }}
  >
    <MeldingerSakIndex
      submitCallback={action('button-click')}
      recipients={object('recipients', recipients)}
      templates={object('templates', templates)}
      sprakKode={object('sprakKode', sprakKode)}
      previewCallback={action('button-click')}
      behandlingId={1}
      behandlingVersjon={1}
      isKontrollerRevurderingApOpen={false}
      revurderingVarslingArsak={[{
        kode: ugunstAarsakTyper.BARN_IKKE_REGISTRERT_FOLKEREGISTER,
        navn: 'Barn ikke registrert i folkeregisteret',
        kodeverk: 'UGUNST',
      }, {
        kode: ugunstAarsakTyper.ANNET,
        navn: 'Annet',
        kodeverk: 'UGUNST',
      }]}
    />
  </div>
);

export const visMeldingModal = () => (
  <MessagesModalSakIndex
    showModal
    closeEvent={action('button-click')}
  />
);
