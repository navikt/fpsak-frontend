import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@fpsak-frontend/shared-components';
import styles from './feilutbetalingPerioderTable.less';
import FeilutbetalingPerioderForm from './FeilutbetalingPerioderForm';

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

const FeilutbetalingPerioderTable = ({ perioder, formName }) => (
  <div className={styles.feilutbetalingTable}>
    <Table
      headerTextCodes={headerTextCodes}
    >
      { perioder.map((periode, index) => (
        <FeilutbetalingPerioderForm
          periode={periode}
          elementId={index}
          formName={formName}
          key={`formIndex${index + 1}`}
        />
      ))
        }
    </Table>
  </div>
);

FeilutbetalingPerioderTable.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formName: PropTypes.string.isRequired,
};

export default FeilutbetalingPerioderTable;
