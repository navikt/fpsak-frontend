import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening';
import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening/src/kodeverk/opptjeningAktivitetKlassifisering';

import withReduxProvider from '../../decorators/withRedux';

const opptjening = {
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 2,
      dager: 3,
    },
    fastsattOpptjeningAktivitetList: [{
      id: 1,
      fom: '2018-01-01',
      tom: '2018-04-04',
      klasse: {
        kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
      },
    }],
    opptjeningFom: '2018-01-01',
    opptjeningTom: '2018-10-01',
  },
};

export default {
  title: 'prosess/prosess-vilkar-opptjening',
  component: OpptjeningVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForÅpentAksjonspunkt = () => (
  <OpptjeningVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    opptjening={opptjening}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
    }]}
    status={vilkarUtfallType.IKKE_VURDERT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
  />
);

export const visPanelForNårEnIkkeHarAksjonspunkt = () => (
  <OpptjeningVilkarProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      behandlingsresultat: {},
    }}
    opptjening={opptjening}
    aksjonspunkter={[]}
    status={vilkarUtfallType.IKKE_VURDERT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
  />
);
