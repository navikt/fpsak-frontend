import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FodselInfoPanel from './components/FodselInfoPanel';
import fodselAksjonspunkterPropType from './propTypes/fodselAksjonspunkterPropType';
import fodselPersonopplysningerPropType from './propTypes/fodselPersonopplysningerPropType';
import fodselFamilieHendelsePropType from './propTypes/fodselFamilieHendelsePropType';
import fodselOriginalBehandlingPropType from './propTypes/fodselOriginalBehandlingPropType';
import fodselBehandlingPropType from './propTypes/fodselBehandlingPropType';
import fodselSoknadPropType from './propTypes/fodselSoknadPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FodselFaktaIndex = ({
  behandling,
  soknad,
  familiehendelse,
  personopplysninger,
  originalBehandling,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <FodselInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      soknad={soknad}
      familiehendelse={familiehendelse}
      originalBehandling={originalBehandling}
      personopplysninger={personopplysninger}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

FodselFaktaIndex.propTypes = {
  behandling: fodselBehandlingPropType.isRequired,
  soknad: fodselSoknadPropType.isRequired,
  familiehendelse: fodselFamilieHendelsePropType.isRequired,
  personopplysninger: fodselPersonopplysningerPropType.isRequired,
  originalBehandling: fodselOriginalBehandlingPropType,
  aksjonspunkter: PropTypes.arrayOf(fodselAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

FodselFaktaIndex.defaultProps = {
  originalBehandling: undefined,
};

export default FodselFaktaIndex;
