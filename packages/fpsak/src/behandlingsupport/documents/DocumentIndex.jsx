import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { requireProps } from '@fpsak-frontend/fp-felles';
import { getSelectedBehandlingId } from 'behandling/duck';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import DocumentList from './components/DocumentList';
import { getAllDocuments } from '../behandlingsupportSelectors';

// TODO (hb) lag linker, ikke callback
// TODO (hb) Kan implementeres med spesialisert selector som genererer hrefs til bruk i mapStateToProps

const selectDocument = saksNr => (e, id, document) => {
  window.open(`/fpsak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`, '_blank');
};


/**
 * DocumentIndex
 *
 * Container komponent. Har ansvar for å hente sakens dokumenter fra state og rendre det i en liste.
 */
export const DocumentIndex = ({ documents, behandlingId, saksNr }) => (
  <DocumentList
    documents={documents}
    selectDocumentCallback={selectDocument(saksNr)}
    behandlingId={behandlingId}
  />
);

DocumentIndex.propTypes = {
  saksNr: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    gjelderFor: PropTypes.string,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string.isRequired,
  })).isRequired,
  behandlingId: PropTypes.number,
};

DocumentIndex.defaultProps = {
  behandlingId: undefined,
};

const getSortedDocuments = createSelector([getAllDocuments], alleDokumenter => (alleDokumenter || [])
.sort((a, b) => {
  if (!a.tidspunkt) {
    return +1;
  }

  if (!b.tidspunkt) {
    return -1;
  }
  return b.tidspunkt.localeCompare(a.tidspunkt);
}));

const mapStateToProps = state => ({
  saksNr: getSelectedSaksnummer(state),
  documents: getSortedDocuments(state),
  behandlingId: getSelectedBehandlingId(state),
});

export default connect(mapStateToProps)(requireProps(['saksNr'], ['documents'], <LoadingPanel />)(DocumentIndex));
