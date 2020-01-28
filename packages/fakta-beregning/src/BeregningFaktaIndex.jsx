import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BeregningInfoPanel from './components/BeregningInfoPanel';
import beregningsgrunnlagPropType from './propTypes/beregningsgrunnlagPropType';
import beregningAksjonspunkterPropType from './propTypes/beregningAksjonspunkterPropType';
import beregningBehandlingPropType from './propTypes/beregningBehandlingPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const BeregningFaktaIndex = ({
  behandling,
  beregningsgrunnlag,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
  submittable,
  erOverstyrer,
}) => (
  <RawIntlProvider value={intl}>
    <BeregningInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      beregningsgrunnlag={beregningsgrunnlag}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
      erOverstyrer={erOverstyrer}
    />
  </RawIntlProvider>
);

BeregningFaktaIndex.propTypes = {
  behandling: beregningBehandlingPropType.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
};

BeregningFaktaIndex.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningFaktaIndex;
