import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { useIntl } from 'react-intl';
import TimeLineButton from './TimeLineButton';

const TimeLineNavigation = ({
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

TimeLineNavigation.propTypes = {
  openPeriodInfo: PropTypes.func.isRequired,
};

export default TimeLineNavigation;
