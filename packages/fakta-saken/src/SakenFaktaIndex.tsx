import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';
import SakenFaktaPanel from './components/SakenFaktaPanel';
import messages from '../i18n/nb_NO';

interface OwnProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (data: {}) => void;
  readOnly: boolean;
}

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const SakenFaktaIndex: FunctionComponent<OwnProps> = ({
  behandling,
  aksjonspunkter,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <SakenFaktaPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

export default SakenFaktaIndex;
