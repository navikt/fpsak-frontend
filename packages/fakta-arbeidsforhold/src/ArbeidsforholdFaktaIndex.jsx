import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import ArbeidsforholdInfoPanel from './components/ArbeidsforholdInfoPanel';
import arbeidsforholdAksjonspunkterPropType from './propTypes/arbeidsforholdAksjonspunkterPropType';
import arbeidsforholdBehandlingPropType from './propTypes/arbeidsforholdBehandlingPropType';
import arbeidsforholdInntektArbeidYtelsePropType from './propTypes/arbeidsforholdInntektArbeidYtelsePropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const ArbeidsforholdFaktaIndex = ({
  behandling,
  inntektArbeidYtelse,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  harApneAksjonspunkter,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <ArbeidsforholdInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      arbeidsforhold={inntektArbeidYtelse.arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={inntektArbeidYtelse.skalKunneLeggeTilNyeArbeidsforhold}
      skalKunneLageArbeidsforholdBasertPaInntektsmelding={inntektArbeidYtelse.skalKunneLageArbeidsforholdBasertPaInntektsmelding}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      aksjonspunkter={aksjonspunkter}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

ArbeidsforholdFaktaIndex.propTypes = {
  behandling: arbeidsforholdBehandlingPropType.isRequired,
  inntektArbeidYtelse: arbeidsforholdInntektArbeidYtelsePropType.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(arbeidsforholdAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
};

export default ArbeidsforholdFaktaIndex;
