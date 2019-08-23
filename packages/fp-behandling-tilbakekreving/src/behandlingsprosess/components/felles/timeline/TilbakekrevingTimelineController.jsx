import React from 'react';
import PropTypes from 'prop-types';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';

import zoomOutImageUrl from '@fpsak-frontend/assets/images/zoom_out.svg';
import zoomOutImageFilledUrl from '@fpsak-frontend/assets/images/zoom_out_filled.svg';
import zoomInImageUrl from '@fpsak-frontend/assets/images/zoom_in.svg';
import zoomInImageFilledUrl from '@fpsak-frontend/assets/images/zoom_in_filled.svg';

import arrowDownImageUrl from '@fpsak-frontend/assets/images/arrow_down.svg';
import arrowDownFilledImageUrl from '@fpsak-frontend/assets/images/arrow_down_filled.svg';

import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';

import { Image } from '@fpsak-frontend/shared-components';

import styles from './tilbakekrevingTimelineController.less';

const findArrowLeftImg = isHovering => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = isHovering => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);
const findZoomInImg = isHovering => (isHovering ? zoomInImageFilledUrl : zoomInImageUrl);
const findZoomOutImg = isHovering => (isHovering ? zoomOutImageFilledUrl : zoomOutImageUrl);
const findOpenPeriodImage = isHovering => (isHovering ? arrowDownFilledImageUrl : arrowDownImageUrl);
const findQuestionImage = isHovering => (isHovering ? questionHoverUrl : questionNormalUrl);

/*
 * TilbakekrevingTimelineController
 *
 * Holds the controls for the timeline (zoom, traversing left/right and opening the data area)
 *
 * ```
 */
const TilbakekrevingTimelineController = ({
  goBackwardCallback,
  goForwardCallback,
  zoomInCallback,
  zoomOutCallback,
  openPeriodInfo,
  selectedPeriod,
  children,
}) => (
  <div className={styles.scrollButtonContainer}>
    <span className={styles.popUnder}>
      <span>
        <Image
          className={styles.timeLineButton}
          imageSrcFunction={findQuestionImage}
          altCode="Timeline.openData"
        />
      </span>
      <div className={styles.popUnderContent}>
        {children}
      </div>
    </span>
    <Image
      tabIndex="0"
      className={selectedPeriod ? styles.timeLineButtonInverted : styles.timeLineButton}
      imageSrcFunction={findOpenPeriodImage}
      altCode="Timeline.openData"
      onMouseDown={openPeriodInfo}
      onKeyDown={openPeriodInfo}
    />
    <span className={styles.buttonSpacing}>
      <Image
        tabIndex="0"
        className={styles.timeLineButton}
        imageSrcFunction={findZoomInImg}
        altCode="Timeline.zoomIn"
        onMouseDown={zoomInCallback}
        onKeyDown={zoomInCallback}
      />
      <Image
        tabIndex="0"
        className={styles.timeLineButton}
        imageSrcFunction={findZoomOutImg}
        altCode="Timeline.zoomOut"
        onMouseDown={zoomOutCallback}
        onKeyDown={zoomOutCallback}
      />
    </span>
    <Image
      tabIndex="0"
      className={styles.timeLineButton}
      imageSrcFunction={findArrowLeftImg}
      altCode="Timeline.prevPeriod"
      onMouseDown={goBackwardCallback}
      onKeyDown={goBackwardCallback}
    />
    <Image
      tabIndex="0"
      className={styles.timeLineButton}
      imageSrcFunction={findArrowRightImg}
      altCode="Timeline.nextPeriod"
      onMouseDown={goForwardCallback}
      onKeyDown={goForwardCallback}
    />
  </div>
);

TilbakekrevingTimelineController.propTypes = {
  goBackwardCallback: PropTypes.func.isRequired,
  goForwardCallback: PropTypes.func.isRequired,
  zoomInCallback: PropTypes.func.isRequired,
  zoomOutCallback: PropTypes.func.isRequired,
  openPeriodInfo: PropTypes.func.isRequired,
  selectedPeriod: PropTypes.shape(),
  children: PropTypes.node.isRequired,
};

TilbakekrevingTimelineController.defaultProps = {
  selectedPeriod: undefined,
};

export default TilbakekrevingTimelineController;
