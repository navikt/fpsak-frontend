import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import RegistrereVergeInfoPanel from './components/RegistrereVergeInfoPanel';
import vergeAksjonspunkterPropType from './propTypes/vergeAksjonspunkterPropType';
import vergeVergePropType from './propTypes/vergeVergePropType';
import vergeBehandlingPropType from './propTypes/vergeBehandlingPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VergeFaktaIndex = ({
  behandling,
  verge,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <RegistrereVergeInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      verge={verge}
      aksjonspunkter={aksjonspunkter}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

VergeFaktaIndex.propTypes = {
  behandling: vergeBehandlingPropType.isRequired,
  verge: vergeVergePropType,
  aksjonspunkter: PropTypes.arrayOf(vergeAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

VergeFaktaIndex.defaultProps = {
  verge: {},
};

export default VergeFaktaIndex;
