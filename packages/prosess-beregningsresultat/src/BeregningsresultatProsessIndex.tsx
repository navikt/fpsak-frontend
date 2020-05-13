import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Behandling, Aksjonspunkt, BeregningsresultatEs } from '@fpsak-frontend/types';

import BeregningsresultatEngangsstonadForm from './components/BeregningsresultatEngangsstonadForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  behandling: Behandling;
  beregningresultatEngangsstonad: BeregningsresultatEs;
  aksjonspunkter: Aksjonspunkt[];
  overrideReadOnly: boolean;
  submitCallback: () => void;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (fn: (oldArray: []) => void) => void;
}

const BeregningsresultatProsessIndex: FunctionComponent<OwnProps> = ({
  behandling,
  beregningresultatEngangsstonad,
  aksjonspunkter,
  overrideReadOnly,
  submitCallback,
  kanOverstyreAccess,
  toggleOverstyring,
  ...rest
}) => (
  <RawIntlProvider value={intl}>
    <BeregningsresultatEngangsstonadForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingResultatstruktur={beregningresultatEngangsstonad}
      aksjonspunkter={aksjonspunkter}
      overrideReadOnly={overrideReadOnly}
      submitCallback={submitCallback}
      kanOverstyre={kanOverstyreAccess.isEnabled}
      toggleOverstyring={toggleOverstyring}
      test={rest}
    />
  </RawIntlProvider>
);

export default BeregningsresultatProsessIndex;
