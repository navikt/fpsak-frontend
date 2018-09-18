import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import styles from './dateContainer.less';

const DateContainer = ({
  opptjeningFomDato,
  opptjeningTomDato,
}) => (
  <div className={styles.dateContainer}>
    <div className={styles.dates}>
      <Row className={styles.dateContainer}>
        <Column xs="1" className={styles.startDateContainer} />
        <Column xs="9">
          <div>{opptjeningFomDato}</div>
        </Column>
        <Column xs="2">
          <div className={styles.endDate}>
            {opptjeningTomDato}
          </div>
        </Column>
      </Row>
    </div>
  </div>
);

DateContainer.propTypes = {
  opptjeningFomDato: PropTypes.string.isRequired,
  opptjeningTomDato: PropTypes.string.isRequired,
};

export default DateContainer;
