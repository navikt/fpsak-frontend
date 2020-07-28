import React, { FunctionComponent, useMemo } from 'react';
import { connect } from 'react-redux';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';
import { Dokument } from '@fpsak-frontend/types';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../../behandling/duck';
import { getSelectedSaksnummer } from '../../fagsak/fagsakSelectors';
import { FpsakApiKeys, useRestApi } from '../../data/fpsakApiNyUtenRedux';

// TODO (hb) lag linker, ikke callback
// TODO (hb) Kan implementeres med spesialisert selector som genererer hrefs til bruk i mapStateToProps
const selectDocument = (saksNr) => (e, id, document) => {
  window.open(`/fpsak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`, '_blank');
};

const hentSorterteDokumenter = (alleDokumenter: Dokument[] = []) => alleDokumenter
  .sort((a, b) => {
    if (!a.tidspunkt) {
      return +1;
    }

    if (!b.tidspunkt) {
      return -1;
    }
    return b.tidspunkt.localeCompare(a.tidspunkt);
  });

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
}) => {
  const { data: alleDokumenter, state } = useRestApi<Dokument[]>(FpsakApiKeys.ALL_DOCUMENTS, { saksnummer: saksNr }, {
    updateTriggers: [behandlingId, behandlingVersjon],
    keepData: true,
  });

  const sorterteDokumenter = useMemo(() => hentSorterteDokumenter(alleDokumenter), [alleDokumenter]);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <DokumenterSakIndex
      documents={sorterteDokumenter}
      selectDocumentCallback={selectDocument(saksNr)}
      behandlingId={behandlingId}
    />
  );
};

const mapStateToProps = (state) => ({
  saksNr: getSelectedSaksnummer(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

export default connect(mapStateToProps)(requireProps(['saksNr'], <LoadingPanel />)(DocumentIndex));
