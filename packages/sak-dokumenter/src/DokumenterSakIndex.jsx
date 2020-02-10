import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import dokumentPropType from './propTypes/dokumentPropType';
import DocumentList from './components/DocumentList';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const DokumenterSakIndex = ({
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

DokumenterSakIndex.propTypes = {
  documents: PropTypes.arrayOf(dokumentPropType.isRequired).isRequired,
  selectDocumentCallback: PropTypes.func.isRequired,
  behandlingId: PropTypes.number,
};

DokumenterSakIndex.defaultProps = {
  behandlingId: undefined,
};

export default DokumenterSakIndex;
