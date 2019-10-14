import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import PersonInfoPanel from './components/PersonInfoPanel';
import PersonIndexPanel from './components/PersonIndexPanel';
import personAksjonspunkterPropType from './propTypes/personAksjonspunkterPropType';
import personInntektArbeidYtelsePropType from './propTypes/personInntektArbeidYtelsePropType';
import personPersonopplysningerPropType from './propTypes/personPersonopplysningerPropType';
import personBehandlingPropType from './propTypes/personBehandlingPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const PersonFaktaIndex = ({
  behandling,
  personopplysninger,
  inntektArbeidYtelse,
  fagsakPerson,
  aksjonspunkter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  featureToggleUtland,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    {personopplysninger && (
      <PersonInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        sprakkode={behandling.sprakkode}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker}
        relatertTilgrensendeYtelserForAnnenForelder={inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        openInfoPanels={openInfoPanels}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
        readOnly={readOnly}
        featureToggleUtland={featureToggleUtland}
        alleKodeverk={alleKodeverk}
      />
    )}
    {!personopplysninger && (
      <PersonIndexPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        person={fagsakPerson}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        openInfoPanels={openInfoPanels}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
        readOnly={readOnly}
      />
    )}
  </RawIntlProvider>
);

PersonFaktaIndex.propTypes = {
  behandling: personBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(personAksjonspunkterPropType).isRequired,
  inntektArbeidYtelse: personInntektArbeidYtelsePropType,
  personopplysninger: personPersonopplysningerPropType,
  fagsakPerson: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  featureToggleUtland: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

PersonFaktaIndex.defaultProps = {
  personopplysninger: undefined,
  inntektArbeidYtelse: undefined,
};

export default PersonFaktaIndex;
