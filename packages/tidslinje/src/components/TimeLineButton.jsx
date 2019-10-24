import React from 'react';
import PropTypes from 'prop-types';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';
import { Image } from '@fpsak-frontend/shared-components';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import zoomInImageUrl from '@fpsak-frontend/assets/images/zoom_in.svg';
import zoomInImageFilledUrl from '@fpsak-frontend/assets/images/zoom_in_filled.svg';
import zoomOutImageUrl from '@fpsak-frontend/assets/images/zoom_out.svg';
import zoomOutImageFilledUrl from '@fpsak-frontend/assets/images/zoom_out_filled.svg';
import arrowDownImageUrl from '@fpsak-frontend/assets/images/arrow_down.svg';
import arrowDownFilledImageUrl from '@fpsak-frontend/assets/images/arrow_down_filled.svg';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import styles from './timeLineButton.less';

export const buttonTypes = {
  prev: {
    src: arrowLeftImageUrl,
    srcHover: arrowLeftFilledImageUrl,
  },
  next: {
    src: arrowRightImageUrl,
    srcHover: arrowRightFilledImageUrl,
  },
  zoomIn: {
    src: zoomInImageUrl,
    srcHover: zoomInImageFilledUrl,
  },
  zoomOut: {
    src: zoomOutImageUrl,
    srcHover: zoomOutImageFilledUrl,
  },
  openData: {
    src: arrowDownImageUrl,
    srcHover: arrowDownFilledImageUrl,
  },
  question: {
    src: questionNormalUrl,
    srcHover: questionHoverUrl,
  },
};

const TimeLineButton = ({
  callback,
  inverted,
  text,
  type,
}) => (
  <Image
    {...buttonTypes[type]}
    tabIndex="0"
    className={inverted ? styles.timeLineButtonInverted : styles.timeLineButton}
    alt={text}
    title={text}
    onMouseDown={callback}
    onKeyDown={callback}
  />
);
TimeLineButton.propTypes = {
  callback: PropTypes.func,
  inverted: PropTypes.bool,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.keys(buttonTypes)).isRequired,
};

TimeLineButton.defaultProps = {
  inverted: false,
};
export default TimeLineButton;
