import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

export default {
  title: 'prosess/innsyn/VedtakInnsynProsessIndex',
  component: VedtakInnsynProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visFormkravPanelForAksjonspunktNfp = () => (
  <VedtakInnsynProsessIndex
    behandling={behandling}
    innsyn={object('innsyn', {
      dokumenter: [],
      innsynMottattDato: '2019-01-01',
      innsynResultatType: {
        kode: 'test',
      },
    })}
    saksnummer="123434"
    aksjonspunkter={[]}
    alleDokumenter={[]}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);
