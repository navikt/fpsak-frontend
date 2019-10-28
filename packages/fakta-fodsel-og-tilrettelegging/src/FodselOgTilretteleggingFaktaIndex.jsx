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
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <FodselOgTilretteleggingInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={aksjonspunkter}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

FodselOgTilretteleggingFaktaIndex.propTypes = {
  behandling: fodselOgTilretteleggingBehandlingPropType.isRequired,
  svangerskapspengerTilrettelegging: fodselOgTilretteleggingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fodselOgTilretteleggingAksjonspunkterPropType).isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default FodselOgTilretteleggingFaktaIndex;
