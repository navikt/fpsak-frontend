import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak';

import withReduxProvider from '../../decorators/withRedux';

const alleKodeverk
  = require('../mocks/alleKodeverk.json'); // eslint-disable-line
const aksjonspunkterVurderAnnenPartHarRett
  = require('./mocks/uttak/vurder-annen-part-har-rett/aksjonspunkter.json'); // eslint-disable-line
const behandlingVurderAnnenPartHarRett
  = require('./mocks/uttak/vurder-annen-part-har-rett/behandling.json'); // eslint-disable-line
const uttakKontrollerFaktaPerioderVurderAnnenPartHarRett
  = require('./mocks/uttak/vurder-annen-part-har-rett/kontrollerFaktaPerioder.json'); // eslint-disable-line
const ytelsefordelingVurderAnnenPartHarRett
  = require('./mocks/uttak/vurder-annen-part-har-rett/ytelsefordeling.json'); // eslint-disable-line
const faktaArbeidsforholdVurderAnnenPartHarRett
  = require('./mocks/uttak/vurder-annen-part-har-rett/faktaArbeidsforhold.json'); // eslint-disable-line
const personopplysningerVurderAnnenPartHarRett
  = require('./mocks/uttak/vurder-annen-part-har-rett/personopplysninger.json'); // eslint-disable-line
const familiehendelseVurderAnnenPartHarRett
  = require('./mocks/uttak/vurder-annen-part-har-rett/familiehendelse.json'); // eslint-disable-line

const aksjonspunkterFarSøkerFørsteSeksUker
  = require('./mocks/uttak/far-søker-første-seks-uker/aksjonspunkter.json'); // eslint-disable-line
const behandlingFarSøkerFørsteSeksUker
  = require('./mocks/uttak/far-søker-første-seks-uker/behandling.json'); // eslint-disable-line
const uttakKontrollerFaktaPerioderFarSøkerFørsteSeksUker
  = require('./mocks/uttak/far-søker-første-seks-uker/kontrollerFaktaPerioder.json'); // eslint-disable-line
const ytelsefordelingFarSøkerFørsteSeksUker
  = require('./mocks/uttak/far-søker-første-seks-uker/ytelsefordeling.json'); // eslint-disable-line
const faktaArbeidsforholdFarSøkerFørsteSeksUker
  = require('./mocks/uttak/far-søker-første-seks-uker/faktaArbeidsforhold.json'); // eslint-disable-line
const personopplysningerFarSøkerFørsteSeksUker
  = require('./mocks/uttak/far-søker-første-seks-uker/personopplysninger.json'); // eslint-disable-line
const familiehendelseFarSøkerFørsteSeksUker
  = require('./mocks/uttak/far-søker-første-seks-uker/familiehendelse.json'); // eslint-disable-line

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

export const farSøkerFørsteSeksUker = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.UTTAK]);
  const readOnly = false;

  return (
    <UttakFaktaIndex
      behandling={behandlingFarSøkerFørsteSeksUker}
      aksjonspunkter={aksjonspunkterFarSøkerFørsteSeksUker}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      shouldOpenDefaultInfoPanels={false}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      ytelsefordeling={ytelsefordelingFarSøkerFørsteSeksUker}
      uttakKontrollerFaktaPerioder={uttakKontrollerFaktaPerioderFarSøkerFørsteSeksUker}
      alleKodeverk={alleKodeverk}
      faktaArbeidsforhold={faktaArbeidsforholdFarSøkerFørsteSeksUker}
      personopplysninger={personopplysningerFarSøkerFørsteSeksUker}
      familiehendelse={familiehendelseFarSøkerFørsteSeksUker}
      readOnly={boolean('readOnly', readOnly)}
      kanOverstyre={false}
    />
  );
};
