import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingType: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
};

const familieHendelse = {
  register: {
    avklartBarn: [{
      fodselsdato: '2019-01-10',
      dodsdato: undefined,
    }],
  },
  gjeldende: {
    fodselsdato: '2019-01-01',
    termindato: '2019-01-01',
    utstedtdato: '2019-01-01',
    antallBarnTermin: 1,
    antallBarnFodsel: 1,
    vedtaksDatoSomSvangerskapsuke: '2019-01-01',
    erOverstyrt: false,
    morForSykVedFodsel: false,
    dokumentasjonForeligger: true,
    brukAntallBarnFraTps: true,
    avklartBarn: [{
      fodselsdato: '2019-01-10',
      dodsdato: undefined,
    }],
  },
};

const soknad = {
  fodselsdatoer: ['2019-01-10'],
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
};

const originalBehandling = {
  soknad,
  familiehendelse: {
    termindato: '2019-01-01',
    fodselsdato: '2019-01-10',
    antallBarnTermin: 1,
    antallBarnFodsel: 1,
  },
};

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.TERMINBEKREFTELSE,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
  },
  begrunnelse: undefined,
  kanLoses: true,
  erAktivt: true,
}];

const personopplysninger = {
  barnSoktFor: [],
};
const merknaderFraBeslutter = {
  notAccepted: false,
};
const openInfoPanels = [faktaPanelCodes.FODSELSVILKARET];

const stories = storiesOf('fakta/FodselFaktaIndex', module)
  .addDecorator(withKnobs)
  .addDecorator(withReduxProvider);

stories.add('Vis aksjonspunkt Terminbekreftelse', () => (
  <FodselFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    personopplysninger={personopplysninger}
    originalBehandling={object('originalBehandling', originalBehandling)}
    aksjonspunkter={aksjonspunkter}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.TERMINBEKREFTELSE]: merknaderFraBeslutter,
    }}
    submitCallback={action('button-click')}
    openInfoPanels={openInfoPanels}
    toggleInfoPanelCallback={action('button-click')}
    shouldOpenDefaultInfoPanels
    readOnly={boolean('readOnly', false)}
  />
));

stories.add('Vis aksjonspunkt Sjekk manglende fødsel', () => (
  <FodselFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    personopplysninger={personopplysninger}
    originalBehandling={object('originalBehandling', originalBehandling)}
    aksjonspunkter={aksjonspunkter.map((a) => ({
      ...a,
      definisjon: {
        kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
      },
    }))}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL]: merknaderFraBeslutter,
    }}
    submitCallback={action('button-click')}
    openInfoPanels={openInfoPanels}
    toggleInfoPanelCallback={action('button-click')}
    shouldOpenDefaultInfoPanels
    readOnly={boolean('readOnly', false)}
  />
));

stories.add('Vis aksjonspunkt Vurder om vilkår for sykdom er oppfylt', () => (
  <FodselFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    personopplysninger={personopplysninger}
    originalBehandling={object('originalBehandling', originalBehandling)}
    aksjonspunkter={aksjonspunkter.map((a) => ({
      ...a,
      definisjon: {
        kode: aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
      },
    }))}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT]: merknaderFraBeslutter,
    }}
    submitCallback={action('button-click')}
    openInfoPanels={openInfoPanels}
    toggleInfoPanelCallback={action('button-click')}
    shouldOpenDefaultInfoPanels
    readOnly={boolean('readOnly', false)}
  />
));

stories.add('Vis panel for fødselssammenligning når det ikke finnes aksjonspunkter', () => (
  <FodselFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    personopplysninger={personopplysninger}
    originalBehandling={object('originalBehandling', originalBehandling)}
    aksjonspunkter={[]}
    alleMerknaderFraBeslutter={{}}
    submitCallback={action('button-click')}
    openInfoPanels={openInfoPanels}
    toggleInfoPanelCallback={action('button-click')}
    shouldOpenDefaultInfoPanels
    readOnly={boolean('readOnly', false)}
  />
));
