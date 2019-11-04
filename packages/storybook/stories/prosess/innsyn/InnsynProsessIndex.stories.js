import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingPaaVent: false,
};

const alleKodeverk = {};

export default {
  title: 'prosess/innsyn/InnsynProsessIndex',
  component: InnsynProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visFormkravPanelForAksjonspunktNfp = () => (
  <InnsynProsessIndex
    behandling={behandling}
    innsyn={object('innsyn', {
      dokumenter: [],
      innsynMottattDato: '2019-01-01',
      innsynResultatType: {
        kode: 'test',
      },
      vedtaksdokumentasjon: {},
    })}
    saksnummer="123434"
    aksjonspunkter={[]}
    alleDokumenter={[]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isSubmittable={boolean('isSubmittable', true)}
  />
);
