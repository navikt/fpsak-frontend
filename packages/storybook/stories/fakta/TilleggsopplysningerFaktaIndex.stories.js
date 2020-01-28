import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const soknad = {
  tilleggsopplysninger: 'Dette er en tilleggsopplysning',
};

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.TILLEGGSOPPLYSNINGER,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
  },
  kanLoses: true,
  erAktivt: true,
}];

export default {
  title: 'fakta/fakta-tilleggsopplysninger',
  component: TilleggsopplysningerFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForTilleggsopplysninger = () => (
  <TilleggsopplysningerFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
  />
);
