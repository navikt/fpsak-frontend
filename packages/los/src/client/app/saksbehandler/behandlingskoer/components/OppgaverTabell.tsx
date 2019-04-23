import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { bindActionCreators, Dispatch } from 'redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';

import { getDateAndTime } from 'utils/dateUtils';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import menuIconBlueUrl from 'images/ic-menu-18px_blue.svg';
import menuIconBlackUrl from 'images/ic-menu-18px_black.svg';
import bubbletextUrl from 'images/bubbletext.svg';
import bubbletextFilledUrl from 'images/bubbletext_filled.svg';
import OppgaveHandlingerMenu from './menu/OppgaveHandlingerMenu';
import {
  getAntallOppgaverForBehandlingskoResultat, getOppgaverTilBehandling, getReserverteOppgaver, finnSaksbehandler, resetSaksbehandler,
} from '../duck';

import styles from './oppgaverTabell.less';

const headerTextCodes = [
  'OppgaverTabell.Soker',
  'OppgaverTabell.Behandlingstype',
  'OppgaverTabell.BehandlingOpprettet',
  'OppgaverTabell.FristForBehandling',
  'EMPTY_1',
  'EMPTY_2',
];

type OppgaveMedReservertIndikator = Oppgave & { underBehandling?: boolean };

const getImageIcon = isHoovering => (isHoovering ? menuIconBlueUrl : menuIconBlackUrl);
const getFlyttetImageIcon = isHoovering => (isHoovering ? bubbletextFilledUrl : bubbletextUrl);

const slaSammenOgMarkerReserverte = (reserverteOppgaver, oppgaverTilBehandling): OppgaveMedReservertIndikator[] => {
  const markedAsUnderBehandling = reserverteOppgaver
    .filter(reservertOppgave => !oppgaverTilBehandling.some(oppgave => oppgave.id === reservertOppgave.id))
    .map(f => ({
      ...f,
      underBehandling: true,
    }));

  return markedAsUnderBehandling.concat(oppgaverTilBehandling.slice(0, 3));
};

const getToggleMenuEvent = (oppgave: OppgaveMedReservertIndikator, toggleMenu) => (oppgave.underBehandling ? () => toggleMenu(oppgave) : undefined);

interface Toolip {
  header: Element;
}

type TsProps = Readonly<{
  oppgaverTilBehandling: Oppgave[];
  reserverteOppgaver: Oppgave[];
  reserverOppgave: (oppgave: Oppgave) => void;
  opphevOppgaveReservasjon: (oppgaveId: number, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: number) => Promise<string>;
  finnSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandler: () => Promise<string>;
  flyttReservasjon: (oppgaveId: number, brukerident: string, begrunnelse: string) => Promise<string>;
  antall: number;
}>

interface TsState {
  showMenu: boolean;
  valgtOppgaveId?: number;
  offset: {
    left: number;
    top: number;
  };
}

/**
 * OppgaverTabell
 */
export class OppgaverTabell extends Component<TsProps, TsState> {
  static propTypes = {
    oppgaverTilBehandling: PropTypes.arrayOf(oppgavePropType).isRequired,
    reserverteOppgaver: PropTypes.arrayOf(oppgavePropType).isRequired,
    reserverOppgave: PropTypes.func.isRequired,
    opphevOppgaveReservasjon: PropTypes.func.isRequired,
    forlengOppgaveReservasjon: PropTypes.func.isRequired,
    finnSaksbehandler: PropTypes.func.isRequired,
    resetSaksbehandler: PropTypes.func.isRequired,
    flyttReservasjon: PropTypes.func.isRequired,
    antall: PropTypes.number.isRequired,
  };

  constructor() {
    super();

    this.state = {
      showMenu: false,
      valgtOppgaveId: undefined,
      offset: {
        left: 0,
        top: 0,
      },
    };
  }

  goToFagsak = (event: Event, id: number, oppgave: Oppgave) => {
    const { reserverOppgave } = this.props;
    if (this.nodes && Object.keys(this.nodes).some(key => this.nodes[key] && this.nodes[key].contains(event.target))) {
      return;
    }
    reserverOppgave(oppgave);
  };

  toggleMenu = (valgtOppgave: Oppgave) => {
    const { showMenu } = this.state;
    const offset = this.nodes[valgtOppgave.id].getBoundingClientRect();
    this.setState(() => ({
      valgtOppgaveId: valgtOppgave.id,
      showMenu: !showMenu,
      offset: { top: offset.top, left: offset.left },
    }));
  }

  createTooltip = (oppgaveStatus: OppgaveStatus): Toolip | undefined => {
    const { flyttetReservasjon } = oppgaveStatus;
    if (!flyttetReservasjon) {
      return undefined;
    }
    const datoOgTid = getDateAndTime(flyttetReservasjon.tidspunkt);
    const textValues = {
      dato: datoOgTid.date,
      tid: datoOgTid.time,
      uid: flyttetReservasjon.uid,
      navn: flyttetReservasjon.navn,
      beskrivelse: flyttetReservasjon.begrunnelse,
    };
    return {
      header: <Normaltekst><FormattedHTMLMessage id="OppgaverTabell.OverfortReservasjonTooltip" values={textValues} /></Normaltekst>,
    };
  }

  nodes: { };

  render = () => {
    const {
      oppgaverTilBehandling, reserverteOppgaver, opphevOppgaveReservasjon, forlengOppgaveReservasjon,
      finnSaksbehandler: findSaksbehandler, flyttReservasjon,
      resetSaksbehandler: resetBehandler, antall,
    } = this.props;
    const {
      showMenu, offset, valgtOppgaveId,
    } = this.state;

    const alleOppgaver = slaSammenOgMarkerReserverte(reserverteOppgaver, oppgaverTilBehandling);
    const valgtOppgave = reserverteOppgaver.find(o => o.id === valgtOppgaveId);

    return (
      <>
        <Element><FormattedMessage id="OppgaverTabell.DineNesteSaker" values={{ antall }} /></Element>
        {alleOppgaver.length === 0 && (
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="OppgaverTabell.IngenOppgaver" /></Normaltekst>
          </>
        )
        }
        {alleOppgaver.length > 0 && (
          <>
            <Table headerTextCodes={headerTextCodes}>
              {alleOppgaver.map(oppgave => (
                <TableRow
                  key={oppgave.id}
                  onMouseDown={this.goToFagsak}
                  onKeyDown={this.goToFagsak}
                  className={oppgave.underBehandling ? styles.isUnderBehandling : undefined}
                  model={oppgave}
                >
                  <TableColumn>{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}</TableColumn>
                  <TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
                  <TableColumn>{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}</TableColumn>
                  <TableColumn>{oppgave.behandlingsfrist && <DateLabel dateString={oppgave.behandlingsfrist} />}</TableColumn>
                  <TableColumn>
                    {oppgave.status.flyttetReservasjon && (
                    <Image
                      imageSrcFunction={getFlyttetImageIcon}
                      altCode="OppgaverTabell.OverfortReservasjon"
                      titleCode="OppgaverTabell.OverfortReservasjon"
                      tooltip={this.createTooltip(oppgave.status)}
                      tabIndex="0"
                    />
                    )}
                  </TableColumn>
                  <TableColumn className={oppgave.underBehandling ? styles.noPadding : undefined}>
                    {!oppgave.underBehandling && <NavFrontendChevron /> }
                    {oppgave.underBehandling && (
                      <div ref={(node) => { this.nodes = { ...this.nodes, [oppgave.id]: node }; }}>
                        <Image
                          className={styles.image}
                          imageSrcFunction={getImageIcon}
                          altCode="OppgaverTabell.OppgaveHandlinger"
                          titleCode="OppgaverTabell.OppgaveHandlinger"
                          onMouseDown={getToggleMenuEvent(oppgave, this.toggleMenu)}
                          onKeyDown={getToggleMenuEvent(oppgave, this.toggleMenu)}
                          tabIndex="0"
                        />
                      </div>
                    ) }
                  </TableColumn>
                </TableRow>
              ))}
            </Table>
            {showMenu && valgtOppgaveId && valgtOppgave && (
              <OppgaveHandlingerMenu
                imageNode={this.nodes[valgtOppgaveId]}
                toggleMenu={this.toggleMenu}
                offset={offset}
                oppgave={valgtOppgave}
                opphevOppgaveReservasjon={opphevOppgaveReservasjon}
                forlengOppgaveReservasjon={forlengOppgaveReservasjon}
                finnSaksbehandler={findSaksbehandler}
                resetSaksbehandler={resetBehandler}
                flyttReservasjon={flyttReservasjon}
              />
            )
            }
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  antall: getAntallOppgaverForBehandlingskoResultat(state) || 0,
  oppgaverTilBehandling: getOppgaverTilBehandling(state) || [],
  reserverteOppgaver: getReserverteOppgaver(state) || [],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    finnSaksbehandler,
    resetSaksbehandler,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppgaverTabell);
