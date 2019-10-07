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
  historyList,
  saksnummer,
  location,
  alleKodeverkFpsak,
  alleKodeverkFptilbake,
}) => (
  <RawIntlProvider value={intl}>
    <History
      historyList={historyList}
      saksNr={saksnummer}
      location={location}
      getKodeverknavnFpsak={getKodeverknavnFn(alleKodeverkFpsak, kodeverkTyper)}
      getKodeverknavnFptilbake={getKodeverknavnFn(alleKodeverkFptilbake, kodeverkTyper)}
      alleKodeverkFpsak={alleKodeverkFpsak}
      alleKodeverkFptilbake={alleKodeverkFptilbake}
    />
  </RawIntlProvider>
);

HistorikkSakIndex.propTypes = {
  historyList: PropTypes.arrayOf(historikkinnslagPropType).isRequired,
  saksnummer: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  alleKodeverkFpsak: PropTypes.shape().isRequired,
  alleKodeverkFptilbake: PropTypes.shape().isRequired,
};

export default HistorikkSakIndex;
