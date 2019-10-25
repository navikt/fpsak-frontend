import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FodselOgTilretteleggingInfoPanel from './components/FodselOgTilretteleggingInfoPanel';
import adopsjonAksjonspunkterPropType from './propTypes/adopsjonAksjonspunkterPropType';
import adopsjonPersonopplysningerPropType from './propTypes/adopsjonPersonopplysningerPropType';
import adopsjonFamilieHendelsePropType from './propTypes/adopsjonFamilieHendelsePropType';
import adopsjonBehandlingPropType from './propTypes/adopsjonBehandlingPropType';
import adopsjonSoknadPropType from './propTypes/adopsjonSoknadPropType';
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
      personopplysninger={personopplysninger}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
      isForeldrepengerFagsak={isForeldrepengerFagsak}
    />
  </RawIntlProvider>
);

FodselOgTilretteleggingFaktaIndex.propTypes = {
  behandling: adopsjonBehandlingPropType.isRequired,
  soknad: adopsjonSoknadPropType.isRequired,
  familiehendelse: adopsjonFamilieHendelsePropType.isRequired,
  personopplysninger: adopsjonPersonopplysningerPropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(adopsjonAksjonspunkterPropType).isRequired,
  isForeldrepengerFagsak: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default FodselOgTilretteleggingFaktaIndex;
