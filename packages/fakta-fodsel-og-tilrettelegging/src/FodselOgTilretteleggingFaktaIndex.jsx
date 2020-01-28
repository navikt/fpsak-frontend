import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FodselOgTilretteleggingInfoPanel from './components/FodselOgTilretteleggingInfoPanel';
import fodselOgTilretteleggingAksjonspunkterPropType from './propTypes/fodselOgTilretteleggingAksjonspunkterPropType';
import fodselOgTilretteleggingBehandlingPropType from './propTypes/fodselOgTilretteleggingBehandlingPropType';
import fodselOgTilretteleggingPropType from './propTypes/fodselOgTilretteleggingPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FodselOgTilretteleggingFaktaIndex = ({
  behandling,
  svangerskapspengerTilrettelegging,
  aksjonspunkter,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
  submittable,
}) => (
  <RawIntlProvider value={intl}>
    <FodselOgTilretteleggingInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
    />
  </RawIntlProvider>
);

FodselOgTilretteleggingFaktaIndex.propTypes = {
  behandling: fodselOgTilretteleggingBehandlingPropType.isRequired,
  svangerskapspengerTilrettelegging: fodselOgTilretteleggingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fodselOgTilretteleggingAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default FodselOgTilretteleggingFaktaIndex;
