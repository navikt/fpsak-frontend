import React from 'react';
import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { SelectField } from '@fpsak-frontend/form';
import feilutbetalingÅrsak from '@fpsak-frontend/kodeverk/src/feilutbetalingÅrsak';
import PropTypes from 'prop-types';
import styles from './feilutbetalingPerioderTable.less';

const årsaker = [
  {
    navn: 'Utsettels p.g.a skykdom',
    value: feilutbetalingÅrsak.UTSETTELSE_SKYDOM,
  },
  {
    navn: 'Utsettels p.g.a ferie',
    value: feilutbetalingÅrsak.UTSETTELSE_FERIE,
  },
];

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

const FeilutbetalingPerioderTable = ({ perioder, årsak }) => (
  <div className={styles.feilutbetalingTable}>
    <Table
      headerTextCodes={headerTextCodes}
    >
      { perioder.map((periode, periodeIndex) => (
        <TableRow
          key={`rowIndex${periodeIndex + 1}`}
        >
          <TableColumn>
            {moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)}
            {' '}
                -
            {moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}
          </TableColumn>
          <TableColumn>
            <SelectField
              name="årsak"
              selectValues={årsaker.map(a => <option key={a.value} value={a.value}>{a.navn}</option>)}
              bredde="m"
              label=""
            />
            { årsak === feilutbetalingÅrsak.UTSETTELSE_SKYDOM
              && (
              <SelectField
                name="grunn"
                selectValues={årsaker.map(a => <option key={a.value} value={a.value}>{a.navn}</option>)}
                bredde="m"
                label=""
              />
              )
            }
          </TableColumn>
          <TableColumn className={styles.redText}>
            {periode.belop}
          </TableColumn>
        </TableRow>
      ))
        }
    </Table>
  </div>
);

FeilutbetalingPerioderTable.defaultProps = {
  årsak: null,
};

FeilutbetalingPerioderTable.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  årsak: PropTypes.string,
};

export default FeilutbetalingPerioderTable;
