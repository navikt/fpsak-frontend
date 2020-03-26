import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';
import { Dokument } from '@fpsak-frontend/types';

import DataFetcher from '../../app/DataFetcher';
import fpsakApi from '../../data/fpsakApi';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';

// TODO (hb) lag linker, ikke callback
// TODO (hb) Kan implementeres med spesialisert selector som genererer hrefs til bruk i mapStateToProps
const selectDocument = (saksNr) => (e, id, document) => {
  window.open(`/fpsak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`, '_blank');
};

const dokumentData = [fpsakApi.ALL_DOCUMENTS];

const getSortedDocuments = createSelector([(allDocuments) => allDocuments], (alleDokumenter: Dokument[]) => (alleDokumenter || [])
  .sort((a, b) => {
    if (!a.tidspunkt) {
      return +1;
    }

    if (!b.tidspunkt) {
      return -1;
    }
    return b.tidspunkt.localeCompare(a.tidspunkt);
  }));

interface OwnProps {
  saksNr: number;
  behandlingId?: number;
  behandlingVersjon?: number;
}

/**
 * DocumentIndex
 *
 * Container komponent. Har ansvar for å hente sakens dokumenter fra state og rendre det i en liste.
 */
export const DocumentIndex: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  saksNr,
}) => (
  <DataFetcher
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    showLoadingIcon
    endpoints={dokumentData}
    behandlingNotRequired
    endpointParams={{ [fpsakApi.ALL_DOCUMENTS.name]: { saksnummer: saksNr } }}
    keepDataWhenRefetching
    render={(dataProps) => (
      <DokumenterSakIndex
        documents={getSortedDocuments(dataProps.allDocuments)}
        selectDocumentCallback={selectDocument(saksNr)}
        behandlingId={behandlingId}
      />
    )}
  />
);

const mapStateToProps = (state) => ({
  saksNr: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

export default connect(mapStateToProps)(requireProps(['saksNr'], <LoadingPanel />)(DocumentIndex));
