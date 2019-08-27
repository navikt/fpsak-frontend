import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Table } from '@fpsak-frontend/shared-components';

import FeilutbetalingPerioderForm from './FeilutbetalingPerioderForm';

import styles from './feilutbetalingPerioderTable.less';

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

const FeilutbetalingPerioderTable = ({
  perioder, formName, årsaker, readOnly, resetFields,
}) => (
  <div className={styles.feilutbetalingTable}>
    <Table
      headerTextCodes={headerTextCodes}
      noHover
    >
      { perioder.sort((a, b) => moment(a.fom) - moment(b.fom)).map((periode, index) => (
        <FeilutbetalingPerioderForm
          periode={periode}
          elementId={index}
          formName={formName}
          årsaker={årsaker}
          readOnly={readOnly}
          resetFields={resetFields}
          key={`formIndex${index + 1}`}
        />
      ))}
    </Table>
  </div>
);

FeilutbetalingPerioderTable.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formName: PropTypes.string.isRequired,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  readOnly: PropTypes.bool.isRequired,
  resetFields: PropTypes.func.isRequired,
};

export default FeilutbetalingPerioderTable;
