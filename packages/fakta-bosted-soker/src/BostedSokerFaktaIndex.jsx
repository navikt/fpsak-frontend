import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import BostedSokerView from './components/BostedSokerView';
import bostedSokerPersonopplysningerPropType from './propTypes/bostedSokerPersonopplysningerPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const BostedSokerFaktaIndex = ({
  personopplysninger,
  sokerTypeTextId,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <BostedSokerView
      personopplysninger={personopplysninger}
      sokerTypeTextId={sokerTypeTextId}
      regionTypes={alleKodeverk[kodeverkTyper.REGION]}
      sivilstandTypes={alleKodeverk[kodeverkTyper.SIVILSTAND_TYPE]}
      personstatusTypes={alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE]}
    />
  </RawIntlProvider>
);

BostedSokerFaktaIndex.propTypes = {
  personopplysninger: bostedSokerPersonopplysningerPropType.isRequired,
  sokerTypeTextId: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
};

BostedSokerFaktaIndex.defaultProps = {
  sokerTypeTextId: 'BostedSokerFaktaIndex.Soker',
};

export default BostedSokerFaktaIndex;
