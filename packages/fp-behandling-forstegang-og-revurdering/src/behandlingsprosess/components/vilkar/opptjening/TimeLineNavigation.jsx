import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { Image } from '@fpsak-frontend/shared-components';
import arrowDownImageUrl from '@fpsak-frontend/assets/images/arrow_down.svg';
import arrowDownFilledImageUrl from '@fpsak-frontend/assets/images/arrow_down_filled.svg';

import { useIntl } from 'react-intl';
import styles from './timeLineNavigation.less';

const TimeLineNavigation = ({
  openPeriodInfo,
}) => {
  const intl = useIntl();
  return (
    <Row>
      <Column xs="11" />
      <Column xs="1">
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          src={arrowDownImageUrl}
          srcHover={arrowDownFilledImageUrl}
          alt={intl.formatMessage({ id: 'Timeline.openData' })}
          onMouseDown={openPeriodInfo}
          onKeyDown={openPeriodInfo}
        />
      </Column>
    </Row>
  );
};

TimeLineNavigation.propTypes = {
  openPeriodInfo: PropTypes.func.isRequired,
};

export default TimeLineNavigation;
