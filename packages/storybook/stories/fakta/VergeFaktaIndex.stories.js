import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import vergeType from '@fpsak-frontend/fakta-verge/src/kodeverk/vergeType';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.AVKLAR_VERGE,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
  },
  begrunnelse: undefined,
  kanLoses: true,
  erAktivt: true,
}];

const verge = {};

const alleKodeverk = {
  [kodeverkTyper.VERGE_TYPE]: [{
    kode: vergeType.BARN,
    navn: 'Barn',
  }, {
    kode: vergeType.FBARN,
    navn: 'Foreldreløst barn',
  }, {
    kode: vergeType.VOKSEN,
    navn: 'Voksen',
  }, {
    kode: vergeType.ADVOKAT,
    navn: 'Advokat',
  }, {
    kode: vergeType.ANNEN_F,
    navn: 'Annen foreldre',
  },
  ],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/fakta-verge',
  component: VergeFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAvklaringAvVerge = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.VERGE]);
  return (
    <VergeFaktaIndex
      behandling={behandling}
      verge={verge}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.AVKLAR_VERGE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};
