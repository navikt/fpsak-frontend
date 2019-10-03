import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import TilleggsopplysningerInfoPanel from './components/TilleggsopplysningerInfoPanel';
import tilleggsopplysningerAksjonspunkterPropType from './propTypes/tilleggsopplysningerAksjonspunkterPropType';
import tilleggsopplysningerBehandlingPropType from './propTypes/tilleggsopplysningerBehandlingPropType';
import tilleggsopplysningerSoknadPropType from './propTypes/tilleggsopplysningerSoknadPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const TilleggsopplysningerFaktaIndex = ({
  behandling,
  soknad,
  aksjonspunkter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <TilleggsopplysningerInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      tilleggsopplysninger={soknad.tilleggsopplysninger}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

TilleggsopplysningerFaktaIndex.propTypes = {
  behandling: tilleggsopplysningerBehandlingPropType.isRequired,
  soknad: tilleggsopplysningerSoknadPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(tilleggsopplysningerAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default TilleggsopplysningerFaktaIndex;
