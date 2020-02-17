import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import VisittkortPanel from './components/VisittkortPanel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VisittkortSakIndex = ({
  personopplysninger,
  fagsakPerson,
  alleKodeverk,
  sprakkode,
}) => (
  <RawIntlProvider value={intl}>
    <VisittkortPanel
      personopplysninger={personopplysninger}
      fagsakPerson={fagsakPerson}
      alleKodeverk={alleKodeverk}
      sprakkode={sprakkode}
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
