import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import { Fagsak } from 'saksbehandler/fagsakSearch/fagsakTsType';
import { getFpsakUrl } from 'app/duck';
import { getFpsakHref } from 'app/paths';
import {
  reserverOppgave as reserverOppgaveActionCreator, hentReservasjonsstatus as hentReservasjonActionCreator,
} from 'saksbehandler/behandlingskoer/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import fagsakPropType from './fagsakPropType';
import { searchFagsaker, resetFagsakSearch, hentOppgaverForFagsaker as hentOppgaverForFagsakerActionCreator } from './duck';
import {
  getFagsaker,
  getFagsakOppgaver,
  getSearchFagsakerAccessDenied,
} from './fagsakSearchSelectors';
import FagsakSearch from './components/FagsakSearch';

interface SearchResultAccessDenied {
  feilmelding?: string;
}

type Props = Readonly<{
  fagsaker: Fagsak[];
  fagsakOppgaver: Oppgave[];
  searchFagsaker: ({ searchString: string, skalReservere: boolean }) => void;
  searchResultAccessDenied?: SearchResultAccessDenied;
  resetFagsakSearch: () => void;
  goToFagsak: (saknummer: number, behandlingId?: number) => void;
  reserverOppgave: (oppgaveId: number) => Promise<{payload: OppgaveStatus }>;
  hentReservasjonsstatus: (oppgaveId: number) => Promise<{payload: OppgaveStatus }>;
  hentOppgaverForFagsaker: (fagsaker: Fagsak[]) => Promise<{payload: Oppgave[] }>;
}>;

interface StateProps {
  skalReservere: boolean;
  reservertAvAnnenSaksbehandler: boolean;
  reservertOppgave?: Oppgave;
  sokStartet: boolean;
  sokFerdig: boolean;
}

/** s
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
export class FagsakSearchIndex extends Component<Props, StateProps> {
   state = {
     skalReservere: false,
     reservertAvAnnenSaksbehandler: false,
     reservertOppgave: undefined,
     sokStartet: false,
     sokFerdig: false,
   };

  static propTypes = {
    /**
     * Saksnummer eller fødselsnummer/D-nummer
     */
    fagsaker: PropTypes.arrayOf(fagsakPropType),
    fagsakOppgaver: PropTypes.arrayOf(oppgavePropType),
    searchFagsaker: PropTypes.func.isRequired,
    searchResultAccessDenied: PropTypes.shape({
      feilmelding: PropTypes.string.isRequired,
    }),
    resetFagsakSearch: PropTypes.func.isRequired,
    goToFagsak: PropTypes.func.isRequired,
    reserverOppgave: PropTypes.func.isRequired,
    hentReservasjonsstatus: PropTypes.func.isRequired,
    hentOppgaverForFagsaker: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fagsaker: [],
    searchResultAccessDenied: undefined,
  };

  componentDidUpdate = (prevProps: Props, prevState: StateProps) => {
    const { fagsaker, fagsakOppgaver, goToFagsak } = this.props;
    const { sokFerdig } = this.state;
    if (sokFerdig && !prevState.sokFerdig && fagsaker.length === 1) {
      if (fagsakOppgaver.length === 1) {
        this.velgFagsakOperasjoner(fagsakOppgaver[0], false);
      } else if (fagsakOppgaver.length === 0) {
        goToFagsak(fagsaker[0].saksnummer);
      }
    }
  }

  componentWillUnmount = () => {
    const { resetFagsakSearch: resetSearch } = this.props;
    resetSearch();
  }

  goToFagsakEllerApneModal = (oppgave: Oppgave, oppgaveStatus: OppgaveStatus) => {
    const { goToFagsak } = this.props;
    if (!oppgaveStatus.erReservert || (oppgaveStatus.erReservert && oppgaveStatus.erReservertAvInnloggetBruker)) {
      goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
    } else if (oppgaveStatus.erReservert && !oppgaveStatus.erReservertAvInnloggetBruker) {
      this.setState(prevState => ({ ...prevState, reservertAvAnnenSaksbehandler: true, reservertOppgave: oppgave }));
    }
  }

  velgFagsakOperasjoner = (oppgave: Oppgave, skalSjekkeOmReservert: boolean) => {
    const { goToFagsak, reserverOppgave, hentReservasjonsstatus } = this.props;
    const { skalReservere } = this.state;

    if (oppgave.status.erReservert && !oppgave.status.erReservertAvInnloggetBruker) {
      this.setState(prevState => ({ ...prevState, reservertAvAnnenSaksbehandler: true, reservertOppgave: oppgave }));
    } else if (!skalReservere) {
      if (skalSjekkeOmReservert) {
        hentReservasjonsstatus(oppgave.id).then((data: {payload: OppgaveStatus }) => {
          this.goToFagsakEllerApneModal(oppgave, data.payload);
        });
      } else {
        goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
      }
    } else {
      reserverOppgave(oppgave.id).then((data: {payload: OppgaveStatus }) => {
        this.goToFagsakEllerApneModal(oppgave, data.payload);
      });
    }
  }

  reserverOppgaveOgApne = (oppgave: Oppgave) => {
    this.velgFagsakOperasjoner(oppgave, true);
  }

  sokFagsak = (values: {searchString: string; skalReservere: boolean}) => {
    const {
      searchFagsaker: search, hentOppgaverForFagsaker, hentReservasjonsstatus,
    } = this.props;

    this.setState(prevState => ({
      ...prevState, skalReservere: values.skalReservere, sokStartet: true, sokFerdig: false,
    }));

    hentReservasjonsstatus(12);

    return search(values).then((data: {payload: Fagsak[] }) => {
      const fagsaker = data.payload;
      if (fagsaker.length > 0) {
        hentOppgaverForFagsaker(fagsaker).then(() => {
          this.setState(prevState => ({ ...prevState, sokStartet: false, sokFerdig: true }));
        });
      } else {
        this.setState(prevState => ({ ...prevState, sokStartet: false, sokFerdig: true }));
      }
    });
  }

  lukkErReservertModalOgOpneOppgave = (oppgave: Oppgave) => {
    const { goToFagsak } = this.props;
    this.setState(prevState => ({
      ...prevState, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined,
    }));
    goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
  }

  resetSearch = () => {
    const { resetFagsakSearch: resetSearch } = this.props;
    resetSearch();
    this.setState(prevState => ({ ...prevState, sokStartet: false, sokFerdig: false }));
  }

  render = () => {
    const {
      fagsaker, fagsakOppgaver, searchResultAccessDenied, goToFagsak,
    } = this.props;
    const {
      reservertAvAnnenSaksbehandler, reservertOppgave, sokStartet, sokFerdig,
    } = this.state;
    return (
      <>
        <FagsakSearch
          fagsaker={fagsaker || []}
          fagsakOppgaver={fagsakOppgaver || []}
          searchFagsakCallback={this.sokFagsak}
          searchResultReceived={sokFerdig}
          selectFagsakCallback={goToFagsak}
          selectOppgaveCallback={this.reserverOppgaveOgApne}
          searchStarted={sokStartet}
          searchResultAccessDenied={searchResultAccessDenied}
          resetSearch={this.resetSearch}
        />
        {reservertAvAnnenSaksbehandler && reservertOppgave && (
        <OppgaveErReservertAvAnnenModal
          lukkErReservertModalOgOpneOppgave={this.lukkErReservertModalOgOpneOppgave}
          oppgave={reservertOppgave}
          oppgaveStatus={reservertOppgave.status}
        />
        )
        }
      </>
    );
  }
}

const getGoToFagsakFn = fpsakUrl => (saksnummer, behandlingId) => {
  window.location.assign(getFpsakHref(fpsakUrl, saksnummer, behandlingId));
};

const mapStateToProps = state => ({
  fagsaker: getFagsaker(state),
  fagsakOppgaver: getFagsakOppgaver(state),
  searchResultAccessDenied: getSearchFagsakerAccessDenied(state),
  goToFagsak: getGoToFagsakFn(getFpsakUrl(state)),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    searchFagsaker,
    resetFagsakSearch,
    reserverOppgave: reserverOppgaveActionCreator,
    hentReservasjonsstatus: hentReservasjonActionCreator,
    hentOppgaverForFagsaker: hentOppgaverForFagsakerActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FagsakSearchIndex);
