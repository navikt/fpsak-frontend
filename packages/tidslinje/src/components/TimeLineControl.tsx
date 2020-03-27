import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'nav-frontend-grid';
import { injectIntl } from 'react-intl';
import TimeLineButton from './TimeLineButton';
import styles from './timeLineControl.less';


/*
 * Timeline controller
 *
 * Holds the controls for the timeline (zoom, traversing left/right and opening the data area)
 */
const TimeLineControl = ({
  children,
  goBackwardCallback,
  goForwardCallback,
  intl,
  openPeriodInfo,
  selectedPeriod,
  zoomInCallback,
  zoomOutCallback,
}) => {
  const t = intl.formatMessage;
  return (
    <div>
      <Row>
        <div className={styles.scrollButtonContainer}>
          {children}
          <TimeLineButton inverted={(selectedPeriod !== undefined)} text={t({ id: 'Timeline.openData' })} type="openData" callback={openPeriodInfo} />
          <span className={styles.buttonSpacing}>
            <TimeLineButton text={t({ id: 'Timeline.zoomIn' })} type="zoomIn" callback={zoomInCallback} />
            <TimeLineButton text={t({ id: 'Timeline.zoomOut' })} type="zoomOut" callback={zoomOutCallback} />
          </span>
          <TimeLineButton text={t({ id: 'Timeline.prevPeriod' })} type="prev" callback={goBackwardCallback} />
          <TimeLineButton text={t({ id: 'Timeline.nextPeriod' })} type="next" callback={goForwardCallback} />
        </div>
      </Row>
    </div>
  );
};

TimeLineControl.propTypes = {
  children: PropTypes.node,
  goBackwardCallback: PropTypes.func.isRequired,
  goForwardCallback: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  openPeriodInfo: PropTypes.func.isRequired,
  selectedPeriod: PropTypes.shape(),
  zoomInCallback: PropTypes.func.isRequired,
  zoomOutCallback: PropTypes.func.isRequired,
};


TimeLineControl.defaultProps = {
  selectedPeriod: undefined,
};


export default injectIntl(TimeLineControl);
