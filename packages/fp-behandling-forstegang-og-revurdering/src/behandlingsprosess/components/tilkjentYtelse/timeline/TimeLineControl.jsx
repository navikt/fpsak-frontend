import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { FormattedMessage, injectIntl } from 'react-intl';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';
import zoomInImageUrl from '@fpsak-frontend/assets/images/zoom_in.svg';
import zoomInImageFilledUrl from '@fpsak-frontend/assets/images/zoom_in_filled.svg';
import zoomOutImageUrl from '@fpsak-frontend/assets/images/zoom_out.svg';
import zoomOutImageFilledUrl from '@fpsak-frontend/assets/images/zoom_out_filled.svg';

import arrowDownImageUrl from '@fpsak-frontend/assets/images/arrow_down.svg';
import arrowDownFilledImageUrl from '@fpsak-frontend/assets/images/arrow_down_filled.svg';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import fodselUrl from '@fpsak-frontend/assets/images/fodsel.svg';
import revurderingUrl from '@fpsak-frontend/assets/images/endringstidspunkt.svg';
import soknadUrl from '@fpsak-frontend/assets/images/soknad.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import gradertImage from '@fpsak-frontend/assets/images/periode_gradert.svg';
import manueltAvklart from '@fpsak-frontend/assets/images/periode_manuelt_avklart.svg';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import styles from './timeLineControl.less';

/*
 * Timeline controller
 *
 * Holds the controls for the timeline (zoom, traversing left/right and opening the data area)
 *
 */

const TimeLineControl = ({
  intl,
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
              src={questionNormalUrl}
              srcHover={questionHoverUrl}
              alt={intl.formatMessage({ id: 'Timeline.openData' })}
            />
          </span>
          <div className={styles.popUnderContent}>
            <Row>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={oppfyltUrl}
                  alt={intl.formatMessage({ id: 'Timeline.OppfyltPeriode' })}
                />
                <FormattedMessage id="Timeline.OppfyltPeriode" />
              </Column>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={fodselUrl}
                  alt={intl.formatMessage({ id: 'Timeline.TidspunktFamiliehendelse' })}
                />
                <FormattedMessage id="Timeline.TidspunktFamiliehendelse" />
              </Column>
            </Row>
            <VerticalSpacer eightPx />
            <Row>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={ikkeOppfyltUrl}
                  alt={intl.formatMessage({ id: 'Timeline.IkkeOppfyltPeriode' })}
                />
                <FormattedMessage id="Timeline.IkkeOppfyltPeriode" />
              </Column>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={soknadUrl}
                  alt={intl.formatMessage({ id: 'Timeline.TidspunktMotakSoknad' })}
                />
                <FormattedMessage id="Timeline.TidspunktMotakSoknad" />
              </Column>
            </Row>
            <VerticalSpacer eightPx />
            <Row>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={uavklartUrl}
                  alt={intl.formatMessage({ id: 'Timeline.IkkeAvklartPeriode' })}
                />
                <FormattedMessage id="Timeline.IkkeAvklartPeriode" />
              </Column>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={revurderingUrl}
                  alt={intl.formatMessage({ id: 'Timeline.TidspunktRevurdering' })}
                />
                <FormattedMessage id="Timeline.TidspunktRevurdering" />
              </Column>
            </Row>
            <VerticalSpacer eightPx />
            <Row>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={gradertImage}
                  alt={intl.formatMessage({ id: 'Timeline.GradertPeriode' })}
                />
                <FormattedMessage id="Timeline.GradertPeriode" />
              </Column>
              <Column xs="6">
                <Image
                  className={styles.timeLineButton}
                  src={manueltAvklart}
                  alt={intl.formatMessage({ id: 'Timeline.ManueltAvklart' })}
                />
                <FormattedMessage id="Timeline.ManueltAvklart" />
              </Column>
            </Row>
          </div>
        </span>
        {!selectedPeriod
        && (
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          src={arrowDownImageUrl}
          srcHover={arrowDownFilledImageUrl}
          alt={intl.formatMessage({ id: 'Timeline.openData' })}
          onMouseDown={openPeriodInfo}
          onKeyDown={openPeriodInfo}
        />
        )}
        {selectedPeriod
        && (
        <Image
          tabIndex="0"
          className={styles.timeLineButtonInverted}
          src={arrowDownImageUrl}
          srcHover={arrowDownFilledImageUrl}
          alt={intl.formatMessage({ id: 'Timeline.openData' })}
          onMouseDown={openPeriodInfo}
          onKeyDown={openPeriodInfo}
        />
        )}
        <span className={styles.buttonSpacing}>
          <Image
            tabIndex="0"
            className={styles.timeLineButton}
            src={zoomInImageUrl}
            srcHover={zoomInImageFilledUrl}
            alt={intl.formatMessage({ id: 'Timeline.zoomIn' })}
            onMouseDown={zoomInCallback}
            onKeyDown={zoomInCallback}
          />
          <Image
            tabIndex="0"
            className={styles.timeLineButton}
            src={zoomOutImageUrl}
            srcHover={zoomOutImageFilledUrl}
            alt={intl.formatMessage({ id: 'Timeline.zoomOut' })}
            onMouseDown={zoomOutCallback}
            onKeyDown={zoomOutCallback}
          />
        </span>
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          src={arrowLeftImageUrl}
          srcHover={arrowLeftFilledImageUrl}
          alt={intl.formatMessage({ id: 'Timeline.prevPeriod' })}
          onMouseDown={goBackwardCallback}
          onKeyDown={goBackwardCallback}
        />
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          src={arrowRightImageUrl}
          srcHover={arrowRightFilledImageUrl}
          alt={intl.formatMessage({ id: 'Timeline.nextPeriod' })}
          onMouseDown={goForwardCallback}
          onKeyDown={goForwardCallback}
        />
      </div>
    </Row>
  </div>
);

TimeLineControl.propTypes = {
  intl: PropTypes.shape().isRequired,
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
