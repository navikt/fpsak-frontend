import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage, useIntl } from 'react-intl';

import { Image } from '@fpsak-frontend/shared-components';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';
import { uttaksresultatAktivitetPropType } from '@fpsak-frontend/prop-types';

import styles from './uttakTimeLineData.less';
import UttakActivity from './UttakActivity';

const UttakMedsokerReadOnly = ({
  readOnly,
  selectedItemData,
  callbackForward,
  callbackBackward,
  callbackUpdateActivity,
  callbackCancelSelectedActivity,
  isApOpen,
  harSoktOmFlerbarnsdager,
}) => {
  const intl = useIntl();
  return (
    <Row>
      <Column xs="12">
        <div className={styles.showDataContainer}>
          <Row>
            <Column xs="3">
              <Element>
                <FormattedMessage id="UttakTimeLineData.PeriodeData.Detaljer" />
              </Element>
            </Column>
            <Column xs="7" />
            <Column xs="2">
              <span className={styles.navigationPosition}>
                <Image
                  tabIndex="0"
                  className={styles.timeLineButton}
                  src={arrowLeftImageUrl}
                  srcHover={arrowLeftFilledImageUrl}
                  alt={intl.formatMessage({ id: 'Timeline.prevPeriod' })}
                  onMouseDown={callbackBackward}
                  onKeyDown={callbackBackward}
                />
                <Image
                  tabIndex="0"
                  className={styles.timeLineButton}
                  src={arrowRightImageUrl}
                  srcHover={arrowRightFilledImageUrl}
                  alt={intl.formatMessage({ id: 'Timeline.nextPeriod' })}
                  onMouseDown={callbackForward}
                  onKeyDown={callbackForward}
                />
              </span>
            </Column>
          </Row>
          <UttakActivity
            cancelSelectedActivity={callbackCancelSelectedActivity}
            updateActivity={callbackUpdateActivity}
            selectedItemData={selectedItemData}
            readOnly={readOnly}
            isApOpen={isApOpen}
            harSoktOmFlerbarnsdager={harSoktOmFlerbarnsdager}
          />
        </div>
      </Column>
    </Row>
  );
};

UttakMedsokerReadOnly.propTypes = {
  selectedItemData: uttaksresultatAktivitetPropType,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  callbackUpdateActivity: PropTypes.func.isRequired,
  callbackCancelSelectedActivity: PropTypes.func.isRequired,
  isApOpen: PropTypes.bool,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
};

UttakMedsokerReadOnly.defaultProps = {
  selectedItemData: undefined,
  isApOpen: false,
};

export default UttakMedsokerReadOnly;
