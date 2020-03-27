import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import styles from './timelineDataContainer.less';

const TimeLineDataContainer = ({ children }) => (
  <Row>
    <Column xs="12">
      <div className={styles.showDataContainer}>
        {children}
      </div>
    </Column>
  </Row>
);
TimeLineDataContainer.propTypes = {
  children: PropTypes.node,
};
export default TimeLineDataContainer;
