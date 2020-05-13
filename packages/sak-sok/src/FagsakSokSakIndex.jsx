import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FagsakSearch from './components/FagsakSearch';
import sakSokFagsakPropType from './propTypes/sakSokFagsakPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

/*
 * NB! Denne komponenten blir kun brukt lokalt. I alle andre miljø brukes FPLOS
 */
const FagsakSokSakIndex = ({
  fagsaker,
  searchFagsakCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted,
  searchResultAccessDenied,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <FagsakSearch
      fagsaker={fagsaker}
      searchFagsakCallback={searchFagsakCallback}
      searchResultReceived={searchResultReceived}
      selectFagsakCallback={selectFagsakCallback}
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

FagsakSokSakIndex.propTypes = {
  /**
   * Saksnummer eller fødselsnummer/D-nummer
   */
  fagsaker: PropTypes.arrayOf(sakSokFagsakPropType),
  searchFagsakCallback: PropTypes.func.isRequired,
  searchResultReceived: PropTypes.bool.isRequired,
  selectFagsakCallback: PropTypes.func.isRequired,
  searchStarted: PropTypes.bool,
  searchResultAccessDenied: PropTypes.shape({
    feilmelding: PropTypes.string.isRequired,
  }),
  alleKodeverk: PropTypes.shape().isRequired,
};

export default FagsakSokSakIndex;
