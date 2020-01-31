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

const YtelserFaktaIndex = ({
  behandling,
  inntektArbeidYtelse,
  aksjonspunkter,
  harApneAksjonspunkter,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <PersonYtelserTable
      ytelser={ytelser}
      relatertYtelseTypes={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
    />
  </RawIntlProvider>
);

YtelserFaktaIndex.propTypes = {
  behandling: tilleggsopplysningerBehandlingPropType.isRequired,
  soknad: tilleggsopplysningerSoknadPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(tilleggsopplysningerAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
};

export default YtelserFaktaIndex;
