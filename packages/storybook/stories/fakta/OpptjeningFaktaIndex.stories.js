import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const opptjening = {
  fastsattOpptjening: {
    opptjeningFom: '2019-01-01',
    opptjeningTom: '2019-10-01',
  },
  opptjeningAktivitetList: [{
    opptjeningFom: '2019-01-01',
    opptjeningTom: '2019-04-01',
    aktivitetType: {
      kode: opptjeningAktivitetType.ARBEID,
    },
  }],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

const alleKodeverk = {
  [kodeverkTyper.OPPTJENING_AKTIVITET_TYPE]: [{
    kode: opptjeningAktivitetType.ARBEID,
    navn: 'Arbeid',
  }],
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/OpptjeningFaktaIndex',
  component: OpptjeningFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForOpptjening = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OPPTJENINGSVILKARET]);
  return (
    <OpptjeningFaktaIndex
      behandling={behandling}
      opptjening={object('opptjening', opptjening)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING,
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
        [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};
