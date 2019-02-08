import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Image, EditedIcon } from '@fpsak-frontend/shared-components';
import splitPeriodImageHoverUrl from '@fpsak-frontend/assets/images/splitt_hover.svg';
import splitPeriodImageUrl from '@fpsak-frontend/assets/images/splitt.svg';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';
import DelOppPeriodeModal from './DelOppPeriodeModal';
import styles from './bpTimelineData.less';

const findArrowLeftImg = isHovering => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = isHovering => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);
const splitPeriodImg = isHovering => (isHovering ? splitPeriodImageHoverUrl : splitPeriodImageUrl);

const readOnly = false;
const isEdited = false;

const PerioderControler = ({
  showModal,
  hideModal,
  splitPeriod,
  showDelPeriodeModal,
  callbackForward,
  callbackBackward,
  selectedItemData,
}) => (
  <Row>
    <Column xs="3">
      <Element>
        <FormattedMessage id="UttakTimeLineData.PeriodeData.Detaljer" />
        {isEdited && <EditedIcon />}
      </Element>
    </Column>
    <Column xs="7">
      {!readOnly
      && (
        <span className={styles.splitPeriodPosition}>
          <Image
            tabIndex="0"
            className={styles.splitPeriodImage}
            imageSrcFunction={splitPeriodImg}
            altCode="UttakTimeLineData.PeriodeData.DelOppPerioden"
            onMouseDown={showModal}
            onKeyDown={e => (e.keyCode === 13 ? showModal(e) : null)}
          />

          <FormattedMessage id="UttakTimeLineData.PeriodeData.DelOppPerioden" />
        </span>
      )
      }
      {showDelPeriodeModal
      && (
        <DelOppPeriodeModal
          cancelEvent={hideModal}
          showModal={showDelPeriodeModal}
          periodeData={selectedItemData}
          splitPeriod={splitPeriod}
        />
      )
      }
    </Column>
    <Column xs="2">
      <span className={styles.navigationPosition}>
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          imageSrcFunction={findArrowLeftImg}
          altCode="Timeline.prevPeriod"
          onMouseDown={callbackBackward}
          onKeyDown={callbackBackward}
        />
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          imageSrcFunction={findArrowRightImg}
          altCode="Timeline.nextPeriod"
          onMouseDown={callbackForward}
          onKeyDown={callbackForward}
        />
      </span>
    </Column>
  </Row>
);

PerioderControler.propTypes = {
  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  splitPeriod: PropTypes.func.isRequired,
  showDelPeriodeModal: PropTypes.bool.isRequired,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  selectedItemData: PropTypes.shape().isRequired,
};

export default PerioderControler;
