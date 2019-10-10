import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const familieHendelse = {
  gjeldende: {
    omsorgsovertakelseDato: undefined,
    barnetsAnkomstTilNorgeDato: '2019-01-01',
    adopsjonFodelsedatoer: {
      1: '2018-01-01',
      2: '2000-01-02',
    },
    ektefellesBarn: undefined,
    mannAdoptererAlene: undefined,
  },
};

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
  farSokerType: {
    kode: 'ADOPTERER_ALENE',
    kodeverk: 'FAR_SOEKER_TYPE',
  },
};

const personopplysninger = {
  barnSoktFor: [],
};
const merknaderFraBeslutter = {
  notAccepted: false,
};

const alleKodeverk = {
  [kodeverkTyper.FAR_SOEKER_TYPE]: [{
    kode: 'ADOPTERER_ALENE',
    navn: 'Adopterer alene',
  }],
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/AdopsjonFaktaIndex',
  component: AdopsjonFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAdopsjonsvilkåret = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.ADOPSJONSVILKARET]);
  return (
    <AdopsjonFaktaIndex
      behandling={behandling}
      soknad={object('soknad', soknad)}
      familiehendelse={object('familiehendelse', familieHendelse)}
      personopplysninger={personopplysninger}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.ADOPSJONSDOKUMENTAJON]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      isForeldrepengerFagsak
    />
  );
};

export const visAksjonspunktForOmSøkerErMannSomAdoptererAlene = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.ADOPSJONSVILKARET]);
  return (
    <AdopsjonFaktaIndex
      behandling={behandling}
      soknad={object('soknad', soknad)}
      familiehendelse={object('familiehendelse', familieHendelse)}
      personopplysninger={personopplysninger}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      isForeldrepengerFagsak
    />
  );
};

export const visAksjonspunktForOmAdopsjonGjelderEktefellesBarn = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.ADOPSJONSVILKARET]);
  return (
    <AdopsjonFaktaIndex
      behandling={behandling}
      soknad={object('soknad', soknad)}
      familiehendelse={object('familiehendelse', familieHendelse)}
      personopplysninger={personopplysninger}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      isForeldrepengerFagsak={boolean('isForeldrepengerFagsak', true)}
    />
  );
};
