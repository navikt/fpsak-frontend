import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';

import styles from './dateContainer.less';

const DateContainer = ({
  opptjeningFomDate,
  opptjeningTomDate,
}) => (
  <div className={styles.dateContainer}>
    <div className={styles.dates}>
      <Row className={styles.dateContainer}>
        <Column xs="9" className={styles.startDateContainer}>
          <div>{opptjeningFomDate}</div>
        </Column>
        <Column xs="1" />
        <Column xs="2">
          <div className={styles.endDate}>
            {opptjeningTomDate}
          </div>
        </Column>
      </Row>
    </div>
  </div>
);

DateContainer.propTypes = {
  opptjeningFomDate: PropTypes.string.isRequired,
  opptjeningTomDate: PropTypes.string.isRequired,
};

export default DateContainer;
