import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Behandling, InntektArbeidYtelse, Aksjonspunkt } from '@fpsak-frontend/types';

import FodselOgTilretteleggingInfoPanel from './components/FodselOgTilretteleggingInfoPanel';
import FodselOgTilrettelegging from './types/fodselOgTilretteleggingTsType';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  behandling: Behandling;
  svangerskapspengerTilrettelegging: FodselOgTilrettelegging;
  inntektArbeidYtelse: InntektArbeidYtelse;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: () => void;
  readOnly: boolean;
  harApneAksjonspunkter: boolean;
  submittable: boolean;
  erOverstyrer: boolean;
}

const FodselOgTilretteleggingFaktaIndex: FunctionComponent<OwnProps> = ({
  behandling,
  svangerskapspengerTilrettelegging,
  inntektArbeidYtelse,
  aksjonspunkter,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
  submittable,
  erOverstyrer,
}) => (
  <RawIntlProvider value={intl}>
    <FodselOgTilretteleggingInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      iayArbeidsforhold={inntektArbeidYtelse.arbeidsforhold}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
      erOverstyrer={erOverstyrer}
    />
  </RawIntlProvider>
);

export default FodselOgTilretteleggingFaktaIndex;
