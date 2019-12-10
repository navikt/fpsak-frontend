import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';

import History from './components/History';
import historikkinnslagPropType from './propTypes/historikkinnslagPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const HistorikkSakIndex = ({
  historieInnslag,
  saksnummer,
  location,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <History
      historieInnslag={historieInnslag}
      saksNr={saksnummer}
      location={location}
      getKodeverknavn={getKodeverknavnFn(alleKodeverk, kodeverkTyper)}
    />
  </RawIntlProvider>
);

HistorikkSakIndex.propTypes = {
  historieInnslag: historikkinnslagPropType.isRequired,
  saksnummer: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default HistorikkSakIndex;
