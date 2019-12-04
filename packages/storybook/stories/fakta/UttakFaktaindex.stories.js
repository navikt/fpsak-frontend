import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak';

import withReduxProvider from '../../decorators/withRedux';
import alleKodeverk from '../mocks/alleKodeverk.json';

import aksjonspunkterVurderAnnenPartHarRett from './mocks/uttak/vurder-annen-part-har-rett/aksjonspunkter.json';
import behandlingVurderAnnenPartHarRett from './mocks/uttak/vurder-annen-part-har-rett/behandling.json';
import uttakKontrollerFaktaPerioderVurderAnnenPartHarRett from './mocks/uttak/vurder-annen-part-har-rett/kontrollerFaktaPerioder.json';
import ytelsefordelingVurderAnnenPartHarRett from './mocks/uttak/vurder-annen-part-har-rett/ytelsefordeling.json';
import faktaArbeidsforholdVurderAnnenPartHarRett from './mocks/uttak/vurder-annen-part-har-rett/faktaArbeidsforhold.json';
import personopplysningerVurderAnnenPartHarRett from './mocks/uttak/vurder-annen-part-har-rett/personopplysninger.json';
import familiehendelseVurderAnnenPartHarRett from './mocks/uttak/vurder-annen-part-har-rett/familiehendelse.json';

import aksjonspunkterFarSøkerFørsteSeksUker from './mocks/uttak/far-søker-første-seks-uker/aksjonspunkter.json';
import behandlingFarSøkerFørsteSeksUker from './mocks/uttak/far-søker-første-seks-uker/behandling.json';
import uttakKontrollerFaktaPerioderFarSøkerFørsteSeksUker from './mocks/uttak/far-søker-første-seks-uker/kontrollerFaktaPerioder.json';
import ytelsefordelingFarSøkerFørsteSeksUker from './mocks/uttak/far-søker-første-seks-uker/ytelsefordeling.json';
import faktaArbeidsforholdFarSøkerFørsteSeksUker from './mocks/uttak/far-søker-første-seks-uker/faktaArbeidsforhold.json';
import personopplysningerFarSøkerFørsteSeksUker from './mocks/uttak/far-søker-første-seks-uker/personopplysninger.json';
import familiehendelseFarSøkerFørsteSeksUker from './mocks/uttak/far-søker-første-seks-uker/familiehendelse.json';

import aksjonspunkterOverføringAvPerioder from './mocks/uttak/overføring-av-perioder/aksjonspunkter.json';
import behandlingOverføringAvPerioder from './mocks/uttak/overføring-av-perioder/behandling.json';
import uttakKontrollerFaktaPerioderOverføringAvPerioder from './mocks/uttak/overføring-av-perioder/kontrollerFaktaPerioder.json';
import ytelsefordelingOverføringAvPerioder from './mocks/uttak/overføring-av-perioder/ytelsefordeling.json';
import faktaArbeidsforholdOverføringAvPerioder from './mocks/uttak/overføring-av-perioder/faktaArbeidsforhold.json';
import personopplysningerOverføringAvPerioder from './mocks/uttak/overføring-av-perioder/personopplysninger.json';
import familiehendelseOverføringAvPerioder from './mocks/uttak/overføring-av-perioder/familiehendelse.json';

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

export const overføringAvPerioder = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.UTTAK]);
  const readOnly = false;

  return (
    <UttakFaktaIndex
      behandling={behandlingOverføringAvPerioder}
      aksjonspunkter={aksjonspunkterOverføringAvPerioder}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      shouldOpenDefaultInfoPanels={false}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      ytelsefordeling={ytelsefordelingOverføringAvPerioder}
      uttakKontrollerFaktaPerioder={uttakKontrollerFaktaPerioderOverføringAvPerioder}
      alleKodeverk={alleKodeverk}
      faktaArbeidsforhold={faktaArbeidsforholdOverføringAvPerioder}
      personopplysninger={personopplysningerOverføringAvPerioder}
      familiehendelse={familiehendelseOverføringAvPerioder}
      readOnly={boolean('readOnly', readOnly)}
      kanOverstyre={false}
    />
  );
};
