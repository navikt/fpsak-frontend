import React from 'react';
import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components/table';

const headerTextCodes = ['-', 'Januar', 'Februar'];
const tableRows = [
  {
    navn: 'Sykepenger differanse',
    januarBeløp: '-12000',
    februarBeløp: '0',
  },
  {
    navn: 'Foreldrepenger differanse',
    januarBeløp: '10000',
    februarBeløp: '25000',
  },
  {
    navn: 'Resultat motregning',
    januarBeløp: '-2000',
    februarBeløp: '25000',
  },
  {
    navn: 'Inntrekk',
    januarBeløp: '2000',
    februarBeløp: '-2000',
  },
  {
    navn: 'Resultat',
    januarBeløp: '0',
    februarBeløp: '23000',
  },
];
const AvregningTable = () => (
  <Table headerTextCodes={headerTextCodes} allowFormattedHeader={false}>
    { tableRows.map(row => (
      <TableRow>
        <TableColumn>
          { row.navn }
        </TableColumn>
        <TableColumn>
          { row.januarBeløp }
        </TableColumn>
        <TableColumn>
          { row.februarBeløp }
        </TableColumn>
      </TableRow>
    ))
      }
  </Table>
);

export default AvregningTable;
