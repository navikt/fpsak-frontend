import React from 'react';
import { storiesOf } from '@storybook/react';
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

const stories = storiesOf('BeregningsresultatProsessIndex', module)
  .addDecorator(withKnobs)
  .addDecorator(withReduxProvider);

stories.add('Saksbehandler kan ikke overstyre', () => (
  <BeregningsresultatProsessIndex
    behandling={behandling}
    beregningresultatEngangsstonad={beregningsresultat}
    aksjonspunkter={aksjonspunkter}
    overrideReadOnly={false}
    submitCallback={() => undefined}
    kanOverstyreAccess={{ isEnabled: false }}
    toggleOverstyring={() => undefined}
  />
));

stories.add('Saksbehandler kan overstyre', () => (
  <BeregningsresultatProsessIndex
    behandling={behandling}
    beregningresultatEngangsstonad={beregningsresultat}
    aksjonspunkter={aksjonspunkter}
    overrideReadOnly={boolean('readOnly', false)}
    submitCallback={action('button-click')}
    kanOverstyreAccess={{ isEnabled: true }}
    toggleOverstyring={action('button-click')}
  />
));
