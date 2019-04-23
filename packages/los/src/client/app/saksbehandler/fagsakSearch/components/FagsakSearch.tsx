import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { Oppgave } from 'saksbehandler/oppgaveTsType';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import { Fagsak } from 'saksbehandler/fagsakSearch/fagsakTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakPropType from '../fagsakPropType';
import PersonInfo from './person/PersonInfo';
import SearchForm from './SearchForm';
import FagsakList from './FagsakList';

import styles from './fagsakSearch.less';

interface TsProps {
  fagsaker: Fagsak[];
  fagsakOppgaver: Oppgave[];
  searchFagsakCallback: ({ searchString: string, skalReservere: boolean }) => void;
  searchResultReceived: boolean;
  selectFagsakCallback: (saksnummer: number) => void;
  selectOppgaveCallback: (oppgave: Oppgave) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding?: string;
  };
  resetSearch: () => void;
}

const skalViseListe = (fagsaker, fagsakOppgaver) => {
  if (!fagsaker) {
    return false;
  }
  return fagsaker.length > 1 || (fagsaker.length === 1 && fagsakOppgaver.filter(oppgave => oppgave.saksnummer === fagsaker[0].saksnummer).length > 1);
};

/**
 * FagsakSearch
 *
 * Presentasjonskomponent. Denne setter sammen de ulike komponentene i søkebildet.
 * Er søkeresultat mottatt vises enten trefflisten og relatert person, eller en tekst som viser ingen resultater.
 */
const FagsakSearch = ({
  fagsaker,
  fagsakOppgaver,
  searchFagsakCallback,
  selectOppgaveCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted,
  searchResultAccessDenied,
  resetSearch,
}: TsProps) => (
  <div>
    <SearchForm
      onSubmit={searchFagsakCallback}
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
      resetSearch={resetSearch}
    />

    {searchResultReceived && fagsaker && fagsaker.length === 0
      && <Normaltekst className={styles.label}><FormattedMessage id="FagsakSearch.ZeroSearchResults" /></Normaltekst>
    }

    {searchResultReceived && skalViseListe(fagsaker, fagsakOppgaver) && (
      <>
        <PersonInfo person={fagsaker[0].person} />
        <VerticalSpacer sixteenPx />
        <Normaltekst>
          <FormattedMessage id="FagsakSearch.FlereApneBehandlinger" />
        </Normaltekst>
        <FagsakList selectFagsakCallback={selectFagsakCallback} selectOppgaveCallback={selectOppgaveCallback} />
      </>
    )}
  </div>
);

FagsakSearch.propTypes = {
  fagsaker: PropTypes.arrayOf(fagsakPropType).isRequired,
  fagsakOppgaver: PropTypes.arrayOf(oppgavePropType).isRequired,
  searchResultReceived: PropTypes.bool.isRequired,
  searchFagsakCallback: PropTypes.func.isRequired,
  selectFagsakCallback: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  searchStarted: PropTypes.bool.isRequired,
  searchResultAccessDenied: PropTypes.shape({
    feilmelding: PropTypes.string.isRequired,
  }),
};

FagsakSearch.defaultProps = {
  searchResultAccessDenied: undefined,
};

export default FagsakSearch;
