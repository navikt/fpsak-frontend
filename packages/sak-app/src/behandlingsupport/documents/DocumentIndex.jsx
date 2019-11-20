import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { DataFetcher, requireProps } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';

import fpsakApi from '../../data/fpsakApi';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';

// TODO (hb) lag linker, ikke callback
// TODO (hb) Kan implementeres med spesialisert selector som genererer hrefs til bruk i mapStateToProps
const selectDocument = (saksNr) => (e, id, document) => {
  window.open(`/fpsak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`, '_blank');
};

const dokumentData = [fpsakApi.ALL_DOCUMENTS];

const getSortedDocuments = createSelector([(allDocuments) => allDocuments], (alleDokumenter) => (alleDokumenter || [])
  .sort((a, b) => {
    if (!a.tidspunkt) {
      return +1;
    }

    if (!b.tidspunkt) {
      return -1;
    }
    return b.tidspunkt.localeCompare(a.tidspunkt);
  }));


/**
 * DocumentIndex
 *
 * Container komponent. Har ansvar for å hente sakens dokumenter fra state og rendre det i en liste.
 */
export const DocumentIndex = ({
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
    endpointParams={{ saksnummer: saksNr }}
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

DocumentIndex.propTypes = {
  saksNr: PropTypes.number.isRequired,
  behandlingId: PropTypes.number,
  behandlingVersjon: PropTypes.number,
};

DocumentIndex.defaultProps = {
  behandlingId: undefined,
  behandlingVersjon: undefined,
};

const mapStateToProps = (state) => ({
  saksNr: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

export default connect(mapStateToProps)(requireProps(['saksNr'], <LoadingPanel />)(DocumentIndex));
