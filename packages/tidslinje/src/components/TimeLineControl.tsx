import React, { FunctionComponent, ReactNode, MouseEvent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Row } from 'nav-frontend-grid';

import TimeLineButton from './TimeLineButton';

import styles from './timeLineControl.less';

interface Periode {
  fom: string;
  tom: string;
  id: string;
  className?: string;
  hoverText?: string;
}

interface TimeLineControlProps {
  children?: ReactNode;
  goBackwardCallback: (event: MouseEvent) => void;
  goForwardCallback: (event: MouseEvent) => void;
  openPeriodInfo: (event: MouseEvent) => void;
  selectedPeriod?: Periode;
  zoomInCallback: (event: MouseEvent) => void;
  zoomOutCallback: (event: MouseEvent) => void;
}

/*
 * Timeline controller
 *
 * Holds the controls for the timeline (zoom, traversing left/right and opening the data area)
 */
const TimeLineControl: FunctionComponent<TimeLineControlProps & WrappedComponentProps> = ({
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

TimeLineControl.defaultProps = {
  selectedPeriod: undefined,
};

export default injectIntl(TimeLineControl);
