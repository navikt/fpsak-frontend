import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

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
  title: 'prosess/BeregningsresultatProsessIndex',
  component: BeregningsresultatProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const saksbehandlerKanIkkeOverstyre = () => (
  <BeregningsresultatProsessIndex
    behandling={behandling}
    beregningresultatEngangsstonad={beregningsresultat}
    aksjonspunkter={aksjonspunkter}
    overrideReadOnly={false}
    submitCallback={action('button-click')}
    kanOverstyreAccess={{ isEnabled: false }}
    toggleOverstyring={action('button-click')}
  />
);

export const saksbehandlerKanOverstyre = () => (
  <BeregningsresultatProsessIndex
    behandling={behandling}
    beregningresultatEngangsstonad={beregningsresultat}
    aksjonspunkter={aksjonspunkter}
    overrideReadOnly={boolean('readOnly', false)}
    submitCallback={action('button-click')}
    kanOverstyreAccess={{ isEnabled: true }}
    toggleOverstyring={action('button-click')}
  />
);
