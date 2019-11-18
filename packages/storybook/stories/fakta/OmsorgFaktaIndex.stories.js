import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import OmsorgFaktaIndex from '@fpsak-frontend/fakta-omsorg';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const soknad = {
  oppgittRettighet: {
    omsorgForBarnet: true,
    aleneomsorgForBarnet: true,
  },
};

const personopplysninger = {
  navn: 'Espen Utvikler',
  ektefelle: {
    navn: 'Petra Utvikler',
    personstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    adresser: [],
  },
  personstatus: {
    kode: personstatusType.BOSATT,
    kodeverk: 'PERSONSTATUS_TYPE',
  },
  barn: [{
    navn: 'Tutta Utvikler',
    dodsdato: '2019-01-01',
    fodselsdato: '2018-01-01',
    adresser: [],
    personstatus: {
      kode: personstatusType.DOD,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  }],
  adresser: [],
};

const ytelsefordeling = {};

const merknaderFraBeslutter = {
  notAccepted: false,
};

const alleKodeverk = {
  [kodeverkTyper.PERSONSTATUS_TYPE]: [{
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
  }, {
    kode: personstatusType.DOD,
    navn: 'Død',
  }],
  [kodeverkTyper.SIVILSTAND_TYPE]: [{
    kode: sivilstandType.UOPPGITT,
    navn: 'Uoppgitt',
  }],
  [kodeverkTyper.REGION]: [{
    kode: region.NORDEN,
    navn: 'Norden',
  }],
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/fakta-omsorg',
  component: OmsorgFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunktForKontrollAvOmBrukerHarAleneomsorg = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OMSORG]);
  return (
    <OmsorgFaktaIndex
      behandling={behandling}
      ytelsefordeling={ytelsefordeling}
      soknad={object('soknad', soknad)}
      personopplysninger={object('personopplysninger', personopplysninger)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG,
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
        [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const visÅpentAksjonspunktForKontrollAvOmBrukerHarOmsorg = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OMSORG]);
  return (
    <OmsorgFaktaIndex
      behandling={behandling}
      ytelsefordeling={ytelsefordeling}
      soknad={object('soknad', soknad)}
      personopplysninger={object('personopplysninger', personopplysninger)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG,
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
        [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};
