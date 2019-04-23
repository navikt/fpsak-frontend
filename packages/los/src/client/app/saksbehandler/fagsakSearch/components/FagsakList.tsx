
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import NavFrontendChevron from 'nav-frontend-chevron';

import { Oppgave } from 'saksbehandler/oppgaveTsType';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import fagsakStatus from 'kodeverk/fagsakStatus';
import { getFagsaker, getFagsakOppgaver } from '../fagsakSearchSelectors';
import fagsakPropType from '../fagsakPropType';
import { Fagsak } from '../fagsakTsType';

import styles from './fagsakList.less';

const headerTextCodes = [
  'FagsakList.Saksnummer',
  'FagsakList.Stonadstype',
  'FagsakList.Behandlingstype',
  'FagsakList.Status',
  'FagsakList.BarnFodt',
  'EMPTY_1',
];

interface TsProps {
  sorterteFagsaker: Fagsak[];
  selectFagsakCallback: (saksnummer: number) => void;
  selectOppgaveCallback: (oppgave: Oppgave) => void;
  fagsakStatusTyper: Kodeverk[];
  fagsakYtelseTyper: Kodeverk[];
  fagsakOppgaver: Oppgave[];
}

const getSelectOppgaveCallback = (oppgave, selectOppgaveCallback) => () => selectOppgaveCallback(oppgave);

const getFagsakCallback = selectFagsakCallback => (event: any, saksnummer: number) => selectFagsakCallback(saksnummer);

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
export const FagsakList = ({
  sorterteFagsaker,
  fagsakOppgaver,
  selectFagsakCallback,
  selectOppgaveCallback,
  fagsakStatusTyper,
  fagsakYtelseTyper,
}: TsProps) => (
  <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
    {sorterteFagsaker.map((fagsak) => {
      const fagsakStatusType = fagsakStatusTyper.find(type => type.kode === fagsak.status.kode);
      const fagsakYtelseType = fagsakYtelseTyper.find(type => type.kode === fagsak.sakstype.kode);

      const filtrerteOppgaver = fagsakOppgaver.filter(o => o.saksnummer === fagsak.saksnummer);
      const oppgaver = filtrerteOppgaver.map((oppgave, index) => (
        <TableRow
          key={`oppgave${oppgave.id}`}
          id={oppgave.id}
          onMouseDown={getSelectOppgaveCallback(oppgave, selectOppgaveCallback)}
          onKeyDown={getSelectOppgaveCallback(oppgave, selectOppgaveCallback)}
          isDashedBottomBorder={filtrerteOppgaver.length > index + 1}
        >
          <TableColumn />
          <TableColumn>{oppgave.fagsakYtelseType.navn}</TableColumn>
          <TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
          <TableColumn>{oppgave.behandlingStatus ? oppgave.behandlingStatus.navn : ''}</TableColumn>
          <TableColumn>{fagsak.barnFodt ? <DateLabel dateString={fagsak.barnFodt} /> : null}</TableColumn>
          <TableColumn><NavFrontendChevron /></TableColumn>
        </TableRow>
      ));

      return (
        <Fragment key={`fagsak${fagsak.saksnummer}`}>
          <TableRow
            id={fagsak.saksnummer}
            onMouseDown={getFagsakCallback(selectFagsakCallback)}
            onKeyDown={getFagsakCallback(selectFagsakCallback)}
            isDashedBottomBorder={oppgaver.length > 0}
          >
            <TableColumn>{fagsak.saksnummer}</TableColumn>
            <TableColumn>{fagsakYtelseType ? fagsakYtelseType.navn : ''}</TableColumn>
            <TableColumn />
            <TableColumn>{fagsakStatusType ? fagsakStatusType.navn : ''}</TableColumn>
            <TableColumn>{fagsak.barnFodt ? <DateLabel dateString={fagsak.barnFodt} /> : null}</TableColumn>
            <TableColumn><NavFrontendChevron /></TableColumn>
          </TableRow>
          {oppgaver.length > 0 && oppgaver}
        </Fragment>
      );
    })
      }
  </Table>
);

FagsakList.propTypes = {
  sorterteFagsaker: PropTypes.arrayOf(fagsakPropType).isRequired,
  fagsakOppgaver: PropTypes.arrayOf(oppgavePropType).isRequired,
  selectFagsakCallback: PropTypes.func.isRequired,
  selectOppgaveCallback: PropTypes.func.isRequired,
  fagsakStatusTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
};

export const getSorterteFagsaker = createSelector([getFagsaker], fagsaker => fagsaker.concat().sort((fagsak1, fagsak2) => {
  if (fagsak1.status.kode === fagsakStatus.AVSLUTTET && fagsak2.status.kode !== fagsakStatus.AVSLUTTET) {
    return 1;
  } if (fagsak1.status.kode !== fagsakStatus.AVSLUTTET && fagsak2.status.kode === fagsakStatus.AVSLUTTET) {
    return -1;
  }
  const changeTimeFagsak1 = fagsak1.endret ? fagsak1.endret : fagsak1.opprettet;
  const changeTimeFagsak2 = fagsak2.endret ? fagsak2.endret : fagsak2.opprettet;
  return changeTimeFagsak1 > changeTimeFagsak2 ? 1 : -1;
}));

const mapStateToProps = state => ({
  sorterteFagsaker: getSorterteFagsaker(state),
  fagsakOppgaver: getFagsakOppgaver(state),
  fagsakStatusTyper: getKodeverk(kodeverkTyper.FAGSAK_STATUS)(state),
  fagsakYtelseTyper: getKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE)(state),
});

export default connect(mapStateToProps)(FagsakList);
