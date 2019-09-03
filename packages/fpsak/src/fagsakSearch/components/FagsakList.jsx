import React from 'react';
import PropTypes from 'prop-types';

import {
  DateLabel, Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';
import { fagsakPropType } from '@fpsak-frontend/prop-types';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';

import styles from './fagsakList.less';

const headerTextCodes = [
  'FagsakList.Saksnummer',
  'FagsakList.Sakstype',
  'FagsakList.Status',
  'FagsakList.BarnFodt',
];
const lagFagsakSortObj = (fagsak) => ({
  avsluttet: fagsak.status.kode === fagsakStatus.AVSLUTTET,
  endret: fagsak.endret ? fagsak.endret : fagsak.opprettet,
});
/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
export const FagsakList = ({
  fagsaker,
  selectFagsakCallback,
  getKodeverknavn,
}) => {
  const sortedFagsaker = fagsaker.sort((fagsak1, fagsak2) => {
    const a = lagFagsakSortObj(fagsak1);
    const b = lagFagsakSortObj(fagsak2);
    if (a.avsluttet && !b.avsluttet) { return 1; }
    if (!a.avsluttet && b.avsluttet) { return -1; }
    if (a.endret > b.endret) { return -1; }
    if (a.endret < b.endret) { return 1; }
    return 0;
  });

  return (
    <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
      {sortedFagsaker.map((fagsak) => (
        <TableRow key={fagsak.saksnummer} id={fagsak.saksnummer} model={document} onMouseDown={selectFagsakCallback} onKeyDown={selectFagsakCallback}>
          <TableColumn>{fagsak.saksnummer}</TableColumn>
          <TableColumn>{getKodeverknavn(fagsak.sakstype)}</TableColumn>
          <TableColumn>{getKodeverknavn(fagsak.status)}</TableColumn>
          <TableColumn>{fagsak.barnFodt ? <DateLabel dateString={fagsak.barnFodt} /> : null}</TableColumn>
        </TableRow>
      ))}
    </Table>
  );
};

FagsakList.propTypes = {
  fagsaker: PropTypes.arrayOf(fagsakPropType).isRequired,
  selectFagsakCallback: PropTypes.func.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectKodeverk(getAlleKodeverk)(FagsakList);
