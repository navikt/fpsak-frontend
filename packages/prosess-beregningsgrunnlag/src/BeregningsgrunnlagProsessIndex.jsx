import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import beregningsgrunnlagBehandlingPropType from './propTypes/beregningsgrunnlagBehandlingPropType';
import beregningsgrunnlagAksjonspunkterPropType from './propTypes/beregningsgrunnlagAksjonspunkterPropType';
import BeregningFP2 from './components/BeregningFP';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const BeregningsgrunnlagProsessIndex = ({
  behandling,
  beregningsgrunnlag,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  isAksjonspunktOpen,
  vilkar,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <BeregningFP2
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      apCodes={aksjonspunkter.map((a) => a.definisjon.kode)}
      isApOpen={isAksjonspunktOpen}
      vilkar={vilkar}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

BeregningsgrunnlagProsessIndex.propTypes = {
  behandling: beregningsgrunnlagBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  beregningsgrunnlag: PropTypes.shape(),
  alleKodeverk: PropTypes.shape().isRequired,
};

BeregningsgrunnlagProsessIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningsgrunnlagProsessIndex;
