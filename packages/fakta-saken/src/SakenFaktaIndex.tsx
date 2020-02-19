import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';
import SakenFaktaPanel from './components/SakenFaktaPanel';
import messages from '../i18n/nb_NO.json';

interface OwnProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  utlandDokStatus?: {
    dokStatus: string;
  };
  submitCallback: (data: {}) => void;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
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
  utlandDokStatus,
  submitCallback,
  submittable,
  harApneAksjonspunkter,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <SakenFaktaPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      aksjonspunkter={aksjonspunkter}
      dokStatus={utlandDokStatus ? utlandDokStatus.dokStatus : undefined}
      harApneAksjonspunkter={harApneAksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      submittable={submittable}
    />
  </RawIntlProvider>
);

export default SakenFaktaIndex;
