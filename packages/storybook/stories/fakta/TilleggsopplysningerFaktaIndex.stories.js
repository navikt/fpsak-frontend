import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
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

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/fakta-tilleggsopplysninger',
  component: TilleggsopplysningerFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForTilleggsopplysninger = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.TILLEGGSOPPLYSNINGER]);
  return (
    <TilleggsopplysningerFaktaIndex
      behandling={behandling}
      soknad={object('soknad', soknad)}
      aksjonspunkter={aksjonspunkter}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};
