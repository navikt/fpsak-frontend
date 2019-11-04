import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import UttakInfoPanel from './components/UttakInfoPanel';
import uttakAksjonspunkterPropType from './propTypes/uttakAksjonspunkterPropType';
import uttakBehandlingPropType from './propTypes/uttakBehandlingPropType';
import uttakSoknadPropType from './propTypes/uttakSoknadPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const UttakFaktaIndex = ({
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
    <UttakInfoPanel
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

UttakFaktaIndex.propTypes = {
  behandling: uttakBehandlingPropType.isRequired,
  soknad: uttakSoknadPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(uttakAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default UttakFaktaIndex;
