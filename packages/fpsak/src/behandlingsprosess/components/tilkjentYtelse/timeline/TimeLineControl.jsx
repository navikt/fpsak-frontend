import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import Image from 'sharedComponents/Image';
import { injectIntl, FormattedMessage } from 'react-intl';
import arrowLeftImageUrl from 'images/arrow_left.svg';
import arrowLeftFilledImageUrl from 'images/arrow_left_filled.svg';
import arrowRightImageUrl from 'images/arrow_right.svg';
import arrowRightFilledImageUrl from 'images/arrow_right_filled.svg';

import zoomOutImageUrl from 'images/zoom_out.svg';
import zoomOutImageFilledUrl from 'images/zoom_out_filled.svg';
import zoomInImageUrl from 'images/zoom_in.svg';
import zoomInImageFilledUrl from 'images/zoom_in_filled.svg';

import arrowDownImageUrl from 'images/arrow_down.svg';
import arrowDownFilledImageUrl from 'images/arrow_down_filled.svg';

import ikkeOppfyltUrl from 'images/ikke_oppfylt.svg';
import oppfyltUrl from 'images/oppfylt.svg';
import questionNormalUrl from 'images/question_normal.svg';
import questionHoverUrl from 'images/question_hover.svg';
import fodselUrl from 'images/fodsel.svg';
import revurderingUrl from 'images/endringstidspunkt.svg';
import soknadUrl from 'images/soknad.svg';
import uavklartUrl from 'images/uavklart.svg';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import styles from './timeLineControl.less';

/*
 * Timeline controller
 *
 * Holds the controls for the timeline (zoom, traversing left/right and opening the data area)
 *
 * ```
 */

const findArrowLeftImg = isHovering => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = isHovering => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);
const findZoomInImg = isHovering => (isHovering ? zoomInImageFilledUrl : zoomInImageUrl);
const findZoomOutImg = isHovering => (isHovering ? zoomOutImageFilledUrl : zoomOutImageUrl);
const findOpenPeriodImage = isHovering => (isHovering ? arrowDownFilledImageUrl : arrowDownImageUrl);
const findQuestionImage = isHovering => (isHovering ? questionHoverUrl : questionNormalUrl);
const oppfyltImage = () => (oppfyltUrl);
const ikkeOppfyltImage = () => (ikkeOppfyltUrl);
const findFodselImage = () => (fodselUrl);
const soknadImage = () => (soknadUrl);
const endringsTidspunktImage = () => (revurderingUrl);
const uavklartImage = () => (uavklartUrl);


const TimeLineControl = ({
  goBackwardCallback,
  goForwardCallback,
  zoomInCallback,
  zoomOutCallback,
  openPeriodInfo,
  selectedPeriod,
}) => (
  <div>
    <Row>
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
            <Row>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  imageSrcFunction={oppfyltImage}
                  altCode="Timeline.OppfyltPeriode"
                />
                <FormattedMessage id="Timeline.OppfyltPeriode" />
              </Column>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  imageSrcFunction={findFodselImage}
                  altCode="Timeline.TidspunktFamiliehendelse"
                />
                <FormattedMessage id="Timeline.TidspunktFamiliehendelse" />
              </Column>
            </Row>
            <VerticalSpacer eightPx />
            <Row>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  imageSrcFunction={ikkeOppfyltImage}
                  altCode="Timeline.IkkeOppfyltPeriode"
                />
                <FormattedMessage id="Timeline.IkkeOppfyltPeriode" />
              </Column>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  imageSrcFunction={soknadImage}
                  altCode="Timeline.TidspunktMotakSoknad"
                />
                <FormattedMessage id="Timeline.TidspunktMotakSoknad" />
              </Column>
            </Row>
            <VerticalSpacer eightPx />
            <Row>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  imageSrcFunction={uavklartImage}
                  altCode="Timeline.IkkeAvklartPeriode"
                />
                <FormattedMessage id="Timeline.IkkeAvklartPeriode" />
              </Column>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  imageSrcFunction={endringsTidspunktImage}
                  altCode="Timeline.TidspunktRevurdering"
                />
                <FormattedMessage id="Timeline.TidspunktRevurdering" />
              </Column>
            </Row>
          </div>
        </span>
        {!selectedPeriod
        && (
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          imageSrcFunction={findOpenPeriodImage}
          altCode="Timeline.openData"
          onMouseDown={openPeriodInfo}
          onKeyDown={openPeriodInfo}
        />
        )
        }
        {selectedPeriod
        && (
        <Image
          tabIndex="0"
          className={styles.timeLineButtonInverted}
          imageSrcFunction={findOpenPeriodImage}
          altCode="Timeline.openData"
          onMouseDown={openPeriodInfo}
          onKeyDown={openPeriodInfo}
        />
        )
        }
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
    </Row>
  </div>
);

TimeLineControl.propTypes = {
  goBackwardCallback: PropTypes.func.isRequired,
  goForwardCallback: PropTypes.func.isRequired,
  zoomInCallback: PropTypes.func.isRequired,
  zoomOutCallback: PropTypes.func.isRequired,
  openPeriodInfo: PropTypes.func.isRequired,
  selectedPeriod: PropTypes.shape(),
};


TimeLineControl.defaultProps = {
  selectedPeriod: undefined,
};


export default injectIntl(TimeLineControl);
