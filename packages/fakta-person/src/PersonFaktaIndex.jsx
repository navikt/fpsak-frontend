import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import UtfyllendePersoninfoPanel from './components/UtfyllendePersoninfoPanel';
import GrunnleggendePersoninfoPanel from './components/GrunnleggendePersoninfoPanel';
import personAksjonspunkterPropType from './propTypes/personAksjonspunkterPropType';
import personInntektArbeidYtelsePropType from './propTypes/personInntektArbeidYtelsePropType';
import personFagsakPersonPropType from './propTypes/personFagsakPersonPropType';
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
  readOnly,
  featureToggleUtland,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    {personopplysninger && (
      <UtfyllendePersoninfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        sprakkode={behandling.sprakkode}
        personopplysninger={personopplysninger}
        relatertTilgrensendeYtelserForSoker={inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker}
        relatertTilgrensendeYtelserForAnnenForelder={inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={readOnly}
        featureToggleUtland={featureToggleUtland}
        alleKodeverk={alleKodeverk}
      />
    )}
    {!personopplysninger && (
      <GrunnleggendePersoninfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        person={fagsakPerson}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
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
  fagsakPerson: personFagsakPersonPropType,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  featureToggleUtland: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

PersonFaktaIndex.defaultProps = {
  personopplysninger: undefined,
  inntektArbeidYtelse: undefined,
  fagsakPerson: undefined,
};

export default PersonFaktaIndex;
