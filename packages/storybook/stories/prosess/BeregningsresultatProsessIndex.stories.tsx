import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const beregningsresultat = {
  beregnetTilkjentYtelse: 100,
  antallBarn: 1,
  satsVerdi: 100,
};

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
  },
  begrunnelse: 'test',
}];

export default {
  title: 'prosess/prosess-beregningsresultat',
  component: BeregningsresultatProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const saksbehandlerKanIkkeOverstyre = () => (
  <BeregningsresultatProsessIndex
    behandling={behandling as Behandling}
    beregningresultatEngangsstonad={beregningsresultat}
    aksjonspunkter={aksjonspunkter as Aksjonspunkt[]}
    overrideReadOnly={false}
    submitCallback={action('button-click')}
    kanOverstyreAccess={{ isEnabled: false }}
    toggleOverstyring={action('button-click')}
  />
);

export const saksbehandlerKanOverstyre = () => (
  <BeregningsresultatProsessIndex
    behandling={behandling as Behandling}
    beregningresultatEngangsstonad={beregningsresultat}
    aksjonspunkter={aksjonspunkter as Aksjonspunkt[]}
    overrideReadOnly={boolean('readOnly', false)}
    submitCallback={action('button-click')}
    kanOverstyreAccess={{ isEnabled: true }}
    toggleOverstyring={action('button-click')}
  />
);

export const visOverstyrtReadonlyPanel = () => (
  <BeregningsresultatProsessIndex
    behandling={behandling as Behandling}
    beregningresultatEngangsstonad={beregningsresultat}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.OVERSTYR_BEREGNING,
      },
      begrunnelse: 'Dette er en begrunnelse',
    }] as Aksjonspunkt[]}
    overrideReadOnly={false}
    submitCallback={action('button-click')}
    kanOverstyreAccess={{ isEnabled: true }}
    toggleOverstyring={action('button-click')}
  />
);
