import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { Image } from '@fpsak-frontend/shared-components';
import arrowDownImageUrl from '@fpsak-frontend/assets/images/arrow_down.svg';
import arrowDownFilledImageUrl from '@fpsak-frontend/assets/images/arrow_down_filled.svg';

import styles from './timeLineNavigation.less';

const findImage = isHovering => (isHovering ? arrowDownFilledImageUrl : arrowDownImageUrl);

const TimeLineNavigation = ({
  openPeriodInfo,
}) => (
  <Row>
    <Column xs="11" />
    <Column xs="1">
      <Image
        tabIndex="0"
        className={styles.timeLineButton}
        imageSrcFunction={findImage}
        altCode="Timeline.openData"
        onMouseDown={openPeriodInfo}
        onKeyDown={openPeriodInfo}
      />
    </Column>
  </Row>
);

TimeLineNavigation.propTypes = {
  openPeriodInfo: PropTypes.func.isRequired,
};

export default TimeLineNavigation;

// GLEM IKKE ARIA - WCAG