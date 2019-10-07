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
  selectedBehandlingId,
  saksnummer,
  location,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <History
      historyList={historyList}
      selectedBehandlingId={selectedBehandlingId}
      saksNr={saksnummer}
      location={location}
      getKodeverknavn={getKodeverknavnFn(alleKodeverk, kodeverkTyper)}
    />
  </RawIntlProvider>
);

HistorikkSakIndex.propTypes = {
  historyList: PropTypes.arrayOf(historikkinnslagPropType).isRequired,
  selectedBehandlingId: PropTypes.string,
  saksnummer: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default HistorikkSakIndex;
