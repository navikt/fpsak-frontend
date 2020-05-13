import React, { FunctionComponent, ReactNode } from 'react';
import { Column, Row } from 'nav-frontend-grid';

import styles from './timelineDataContainer.less';

const TimeLineDataContainer: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <Row>
    <Column xs="12">
      <div className={styles.showDataContainer}>
        {children}
      </div>
    </Column>
  </Row>
);

export default TimeLineDataContainer;
