import React from 'react';
import PropTypes from 'prop-types';

import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import fagsakPropType from 'fagsak/fagsakPropType';
import fagsakStatus from 'kodeverk/fagsakStatus';

import styles from './fagsakList.less';

const headerTextCodes = [
  'FagsakList.Saksnummer',
  'FagsakList.Sakstype',
  'FagsakList.Status',
  'FagsakList.BarnFodt',
];

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
const FagsakList = ({
  fagsaker,
  selectFagsakCallback,
}) => {
  const sortedFagsaker = fagsaker.sort((fagsak1, fagsak2) => {
    if (fagsak1.status.kode === fagsakStatus.AVSLUTTET && fagsak2.status.kode !== fagsakStatus.AVSLUTTET) {
      return true;
    } if (fagsak1.status.kode !== fagsakStatus.AVSLUTTET && fagsak2.status.kode === fagsakStatus.AVSLUTTET) {
      return false;
    }
    const changeTimeFagsak1 = fagsak1.endret ? fagsak1.endret : fagsak1.opprettet;
    const changeTimeFagsak2 = fagsak2.endret ? fagsak2.endret : fagsak2.opprettet;
    return changeTimeFagsak1 > changeTimeFagsak2;
  });

  return (
    <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
      {sortedFagsaker.map(fagsak => (
        <TableRow key={fagsak.saksnummer} id={fagsak.saksnummer} model={document} onMouseDown={selectFagsakCallback} onKeyDown={selectFagsakCallback}>
          <TableColumn>{fagsak.saksnummer}</TableColumn>
          <TableColumn>{fagsak.sakstype.navn}</TableColumn>
          <TableColumn>{fagsak.status.navn}</TableColumn>
          <TableColumn>{fagsak.barnFodt ? <DateLabel dateString={fagsak.barnFodt} /> : null}</TableColumn>
        </TableRow>
      ))
      }
    </Table>
  );
};

FagsakList.propTypes = {
  fagsaker: PropTypes.arrayOf(fagsakPropType).isRequired,
  selectFagsakCallback: PropTypes.func.isRequired,
};

export default FagsakList;
