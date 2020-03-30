import React, { FunctionComponent, MouseEvent } from 'react';
import { useIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import TimeLineButton from './TimeLineButton';

const TimeLineNavigation: FunctionComponent<{ openPeriodInfo: (event: MouseEvent) => void }> = ({
  openPeriodInfo,
}) => {
  const intl = useIntl();
  return (
    <Row>
      <Column xs="11" />
      <Column xs="1">
        <TimeLineButton text={intl.formatMessage({ id: 'Timeline.openData' })} type="openData" callback={openPeriodInfo} />
      </Column>
    </Row>
  );
};

export default TimeLineNavigation;
