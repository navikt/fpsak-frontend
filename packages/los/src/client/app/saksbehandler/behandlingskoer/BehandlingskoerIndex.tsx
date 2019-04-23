import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import fpLosApi from 'data/fpLosApi';
import { getFpsakHref } from 'app/paths';
import sakslistePropType from 'saksbehandler/behandlingskoer/sakslistePropType';
import { Saksliste } from 'saksbehandler/behandlingskoer/sakslisteTsType';
import { getFpsakUrl } from 'app/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import {
  fetchAlleSakslister, getSakslisteResult, fetchOppgaverTilBehandling, fetchReserverteOppgaver, reserverOppgave, opphevOppgaveReservasjon,
  forlengOppgaveReservasjon, fetchOppgaverTilBehandlingOppgaver, flyttReservasjon, setValgtSakslisteId,
  harOppgaverTilBehandlingTimeout,
} from './duck';
import SakslistePanel from './components/SakslistePanel';
import BehandlingPollingTimoutModal from './components/BehandlingPollingTimoutModal';

type TsProps = Readonly<{
  fetchOppgaverTilBehandling: (sakslisteId: number) => Promise<{payload: any }>;
  fetchOppgaverTilBehandlingOppgaver: (sakslisteId: number, oppgaveIder?: string) => Promise<{payload: any }>;
  fetchAlleSakslister: () => void;
  fetchReserverteOppgaver: (sakslisteId: number) => Promise<{payload: any }>;
  reserverOppgave: (oppgaveId: number) => Promise<{payload: OppgaveStatus }>;
  opphevOppgaveReservasjon: (oppgaveId: number, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: number) => Promise<string>;
  flyttReservasjon: (oppgaveId: number, brukerident: string, begrunnelse: string) => Promise<string>;
  sakslister: Saksliste[];
  fpsakUrl: string;
  goToUrl: (url: string) => void;
  harTimeout: boolean;
  setValgtSakslisteId: (sakslisteId: number) => void;
}>

interface StateProps {
  sakslisteId?: number;
  reservertAvAnnenSaksbehandler: boolean;
  reservertOppgave?: Oppgave;
  reservertOppgaveStatus?: OppgaveStatus;
}
/**
 * BehandlingskoerIndex
 */
export class BehandlingskoerIndex extends Component<TsProps, StateProps> {
  state = {
    sakslisteId: undefined, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined, reservertOppgaveStatus: undefined,
  };

  static propTypes = {
    fetchOppgaverTilBehandling: PropTypes.func.isRequired,
    fetchOppgaverTilBehandlingOppgaver: PropTypes.func.isRequired,
    fetchAlleSakslister: PropTypes.func.isRequired,
    fetchReserverteOppgaver: PropTypes.func.isRequired,
    reserverOppgave: PropTypes.func.isRequired,
    opphevOppgaveReservasjon: PropTypes.func.isRequired,
    forlengOppgaveReservasjon: PropTypes.func.isRequired,
    flyttReservasjon: PropTypes.func.isRequired,
    sakslister: PropTypes.arrayOf(sakslistePropType),
    fpsakUrl: PropTypes.string.isRequired,
    goToUrl: PropTypes.func.isRequired,
    harTimeout: PropTypes.bool.isRequired,
    setValgtSakslisteId: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sakslister: [],
  }

  componentDidMount = () => {
    const { fetchAlleSakslister: getSakslister } = this.props;
    getSakslister();
  }

  componentWillUnmount = () => {
    const { sakslisteId: id } = this.state;
    if (id) {
      fpLosApi.OPPGAVER_TIL_BEHANDLING.cancelRestApiRequest();
    }
  }

  fetchSakslisteOppgaverPolling = (sakslisteId: number, oppgaveIder?: string) => {
    const { fetchOppgaverTilBehandlingOppgaver: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte } = this.props;
    fetchReserverte(sakslisteId);
    fetchTilBehandling(sakslisteId, oppgaveIder).then((response) => {
      const { sakslisteId: id } = this.state;
      return sakslisteId === id ? this.fetchSakslisteOppgaverPolling(sakslisteId, response.payload.map(o => o.id).join(',')) : Promise.resolve();
    }).catch(() => undefined);
  }

  fetchSakslisteOppgaver = (sakslisteId: number) => {
    this.setState(prevState => ({ ...prevState, sakslisteId }));
    const { fetchOppgaverTilBehandling: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte, setValgtSakslisteId: setSakslisteId } = this.props;
    setSakslisteId(sakslisteId);
    fetchReserverte(sakslisteId);
    fetchTilBehandling(sakslisteId).then((response) => {
      const { sakslisteId: id } = this.state;
      return sakslisteId === id ? this.fetchSakslisteOppgaverPolling(sakslisteId, response.payload.map(o => o.id).join(',')) : Promise.resolve();
    });
  }

  openFagsak = (oppgave: Oppgave) => {
    const { fpsakUrl, goToUrl } = this.props;
    goToUrl(getFpsakHref(fpsakUrl, oppgave.saksnummer, oppgave.behandlingId));
  }

  reserverOppgaveOgApne = (oppgave: Oppgave) => {
    if (oppgave.status.erReservert) {
      this.openFagsak(oppgave);
    } else {
      const { reserverOppgave: reserver } = this.props;

      reserver(oppgave.id).then((data: {payload: OppgaveStatus }) => {
        const nyOppgaveStatus = data.payload;
        if (nyOppgaveStatus.erReservert && nyOppgaveStatus.erReservertAvInnloggetBruker) {
          this.openFagsak(oppgave);
        } else if (nyOppgaveStatus.erReservert && !nyOppgaveStatus.erReservertAvInnloggetBruker) {
          this.setState(prevState => ({
            ...prevState,
            reservertAvAnnenSaksbehandler: true,
            reservertOppgave: oppgave,
            reservertOppgaveStatus: nyOppgaveStatus,
          }));
        }
      });
    }
  }

  opphevReservasjon = (oppgaveId: number, begrunnelse: string): Promise<any> => {
    const { opphevOppgaveReservasjon: opphevReservasjon, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { sakslisteId } = this.state;
    if (!sakslisteId) {
      return Promise.resolve();
    }
    return opphevReservasjon(oppgaveId, begrunnelse)
      .then(() => fetchReserverte(sakslisteId));
  }

  forlengOppgaveReservasjon = (oppgaveId: number): Promise<any> => {
    const { forlengOppgaveReservasjon: forlengReservasjon, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { sakslisteId } = this.state;
    if (!sakslisteId) {
      return Promise.resolve();
    }
    return forlengReservasjon(oppgaveId)
      .then(() => fetchReserverte(sakslisteId));
  }

  flyttReservasjon = (oppgaveId: number, brukerident: string, begrunnelse: string): Promise<any> => {
    const { flyttReservasjon: flytt, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { sakslisteId } = this.state;
    if (!sakslisteId) {
      return Promise.resolve();
    }
    return flytt(oppgaveId, brukerident, begrunnelse)
      .then(() => fetchReserverte(sakslisteId));
  }

  lukkErReservertModalOgOpneOppgave = (oppgave: Oppgave) => {
    this.setState(prevState => ({
      ...prevState, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined, reservertOppgaveStatus: undefined,
    }));
    this.openFagsak(oppgave);
  }

  render = () => {
    const {
      sakslister, harTimeout,
    } = this.props;
    const {
      reservertAvAnnenSaksbehandler, reservertOppgave, reservertOppgaveStatus,
    } = this.state;
    if (sakslister.length === 0) {
      return null;
    }
    return (
      <>
        <SakslistePanel
          reserverOppgave={this.reserverOppgaveOgApne}
          sakslister={sakslister}
          fetchSakslisteOppgaver={this.fetchSakslisteOppgaver}
          opphevOppgaveReservasjon={this.opphevReservasjon}
          forlengOppgaveReservasjon={this.forlengOppgaveReservasjon}
          flyttReservasjon={this.flyttReservasjon}
        />
        {harTimeout
          && <BehandlingPollingTimoutModal />
        }
        {reservertAvAnnenSaksbehandler && reservertOppgave && reservertOppgaveStatus && (
          <OppgaveErReservertAvAnnenModal
            lukkErReservertModalOgOpneOppgave={this.lukkErReservertModalOgOpneOppgave}
            oppgave={reservertOppgave}
            oppgaveStatus={reservertOppgaveStatus}
          />
        )
        }
      </>
    );
  }
}

const mapStateToProps = state => ({
  fpsakUrl: getFpsakUrl(state),
  harTimeout: harOppgaverTilBehandlingTimeout(state),
  sakslister: getSakslisteResult(state),
  goToUrl: url => window.location.assign(url),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleSakslister,
    fetchOppgaverTilBehandling,
    fetchOppgaverTilBehandlingOppgaver,
    fetchReserverteOppgaver,
    reserverOppgave,
    opphevOppgaveReservasjon,
    forlengOppgaveReservasjon,
    flyttReservasjon,
    setValgtSakslisteId,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(BehandlingskoerIndex);
