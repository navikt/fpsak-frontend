import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';

import History from './components/History';
import historikkinnslagPropType from './propTypes/historikkinnslagPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const HistorikkSakIndex = ({
  historieInnslag,
  saksnummer,
  getBehandlingLocation,
  alleKodeverk,
  createLocationForSkjermlenke,
}) => (
  <RawIntlProvider value={intl}>
    <History
      historieInnslag={historieInnslag}
      saksNr={saksnummer}
      getBehandlingLocation={getBehandlingLocation}
      getKodeverknavn={getKodeverknavnFn(alleKodeverk, kodeverkTyper)}
      createLocationForSkjermlenke={createLocationForSkjermlenke}
    />
  </RawIntlProvider>
);

HistorikkSakIndex.propTypes = {
  historieInnslag: historikkinnslagPropType.isRequired,
  saksnummer: PropTypes.number,
  getBehandlingLocation: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

export default HistorikkSakIndex;
