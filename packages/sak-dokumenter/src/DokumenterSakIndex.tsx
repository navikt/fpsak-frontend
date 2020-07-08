import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Dokument } from '@fpsak-frontend/types';

import DocumentList from './components/DocumentList';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  documents: Dokument[];
  selectDocumentCallback: (e: Event, id: number, dokument: Dokument) => void;
  behandlingId?: number;
}

const DokumenterSakIndex: FunctionComponent<OwnProps> = ({
  documents,
  selectDocumentCallback,
  behandlingId,
}) => (
  <RawIntlProvider value={intl}>
    <DocumentList
      documents={documents}
      selectDocumentCallback={selectDocumentCallback}
      behandlingId={behandlingId}
    />
  </RawIntlProvider>
);

export default DokumenterSakIndex;
