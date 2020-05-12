import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, Behandling, Aksjonspunkt } from '@fpsak-frontend/types';

import VilkarresultatMedOverstyringForm from './components/VilkarresultatMedOverstyringForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  behandling: Behandling;
  medlemskap?: {
    fom?: string;
  };
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: () => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (fn: (oldArray: []) => void) => void;
  avslagsarsaker: Kodeverk[];
  status: string;
  erOverstyrt: boolean;
  panelTittelKode: string;
  overstyringApKode: string;
  lovReferanse?: string;
  erMedlemskapsPanel: boolean;
}

const VilkarresultatMedOverstyringProsessIndex: FunctionComponent<OwnProps> = ({
  behandling,
  medlemskap = {},
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  avslagsarsaker,
  status,
  erOverstyrt,
  panelTittelKode,
  overstyringApKode,
  lovReferanse = '',
  erMedlemskapsPanel,
}) => (
  <RawIntlProvider value={intl}>
    <VilkarresultatMedOverstyringForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingsresultat={behandling.behandlingsresultat}
      medlemskapFom={medlemskap.fom}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      overrideReadOnly={overrideReadOnly}
      kanOverstyreAccess={kanOverstyreAccess}
      toggleOverstyring={toggleOverstyring}
      avslagsarsaker={avslagsarsaker}
      status={status}
      erOverstyrt={erOverstyrt}
      panelTittelKode={panelTittelKode}
      overstyringApKode={overstyringApKode}
      lovReferanse={lovReferanse}
      erMedlemskapsPanel={erMedlemskapsPanel}
    />
  </RawIntlProvider>
);

export default VilkarresultatMedOverstyringProsessIndex;
