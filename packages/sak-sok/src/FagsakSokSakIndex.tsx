import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Fagsak, KodeverkMedNavn } from '@fpsak-frontend/types';

import FagsakSearch from './components/FagsakSearch';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  fagsaker?: Fagsak[];
  searchFagsakCallback: () => void;
  searchResultReceived: boolean;
  selectFagsakCallback: (e: Event, saksnummer: number) => void;
  searchStarted?: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
}

/*
 * NB! Denne komponenten blir kun brukt lokalt. I alle andre miljø brukes FPLOS
 */
const FagsakSokSakIndex: FunctionComponent<OwnProps> = ({
  fagsaker = [],
  searchFagsakCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted = false,
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

export default FagsakSokSakIndex;
