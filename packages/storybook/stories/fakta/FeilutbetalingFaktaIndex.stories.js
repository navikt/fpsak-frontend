import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const feilutbetalingFakta = {
  behandlingFakta: {
    perioder: [{
      fom: '2018-01-01',
      tom: '2019-01-01',
    }],
  },
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
  totalPeriodeFom: '2019-01-01',
  totalPeriodeTom: '2019-01-02',
  aktuellFeilUtbetaltBeløp: 10000,
  tidligereVarseltBeløp: 5000,
  perioder: [{
    fom: '2018-01-01',
    tom: '2019-01-01',
  }],
  behandlingÅrsaker: [{
    behandlingArsakType: {
      kode: 'test',
    },
  }],
};

const feilutbetalingAarsak = {
  hendelseTyper: [{
    hendelseType: {
      kode: 'OPPTJENING',
      navn: '§14-6 Opptjening',
    },
  }, {
    hendelseType: {
      kode: 'ANNET',
      navn: 'Annet',
    },
  }, {
    hendelseType: {
      kode: 'MEDLEM',
      navn: '§14-2 Medlemskap',
    },
    hendelseUndertyper: [{
      kode: 'IKKE_EØS',
      navn: 'Ikke oppholdsrett EØS',
    }, {
      kode: 'IKKE_BOSATT',
      navn: 'Ikke bosatt',
    }],
  }],
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
  title: 'fakta/FeilutbetalingFaktaIndex',
  component: FeilutbetalingFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAdopsjonsvilkåret = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.FEILUTBETALING]);
  return (
    <FeilutbetalingFaktaIndex
      behandling={behandling}
      feilutbetalingFakta={object('feilutbetalingFakta', feilutbetalingFakta)}
      feilutbetalingAarsak={object('feilutbetalingAarsak', feilutbetalingAarsak)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING,
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
        [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};
