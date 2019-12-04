import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak';

import withReduxProvider from '../../decorators/withRedux';

const alleKodeverk
  = require('../mocks/alleKodeverk.json'); // eslint-disable-line
const aksjonspunkterVurderAnnenPartHarRett
  = require('./mocks/uttak/vurderAnnenPartHarRett/aksjonspunkter.json'); // eslint-disable-line
const behandlingVurderAnnenPartHarRett
  = require('./mocks/uttak/vurderAnnenPartHarRett/behandling.json'); // eslint-disable-line
const uttakKontrollerFaktaPerioderVurderAnnenPartHarRett
  = require('./mocks/uttak/vurderAnnenPartHarRett/kontrollerFaktaPerioder.json'); // eslint-disable-line
const ytelsefordelingVurderAnnenPartHarRett
  = require('./mocks/uttak/vurderAnnenPartHarRett/ytelsefordeling.json'); // eslint-disable-line
const faktaArbeidsforholdVurderAnnenPartHarRett
  = require('./mocks/uttak/vurderAnnenPartHarRett/faktaArbeidsforhold.json'); // eslint-disable-line
const personopplysningerVurderAnnenPartHarRett
  = require('./mocks/uttak/vurderAnnenPartHarRett/personopplysninger.json'); // eslint-disable-line
const familiehendelseVurderAnnenPartHarRett
  = require('./mocks/uttak/vurderAnnenPartHarRett/familiehendelse.json'); // eslint-disable-line

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/fakta-uttak',
  component: UttakFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const vurderOmAnnenPartHarRett = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.UTTAK]);
  const readOnly = false;

  return (
    <UttakFaktaIndex
      behandling={behandlingVurderAnnenPartHarRett}
      aksjonspunkter={aksjonspunkterVurderAnnenPartHarRett}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      shouldOpenDefaultInfoPanels={false}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      ytelsefordeling={ytelsefordelingVurderAnnenPartHarRett}
      uttakKontrollerFaktaPerioder={uttakKontrollerFaktaPerioderVurderAnnenPartHarRett}
      alleKodeverk={alleKodeverk}
      faktaArbeidsforhold={faktaArbeidsforholdVurderAnnenPartHarRett}
      personopplysninger={personopplysningerVurderAnnenPartHarRett}
      familiehendelse={familiehendelseVurderAnnenPartHarRett}
      readOnly={boolean('readOnly', readOnly)}
      kanOverstyre={false}
    />
  );
};
