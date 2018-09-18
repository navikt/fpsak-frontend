import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import arrowLeftImageUrl from 'images/arrow_left.svg';
import arrowLeftFilledImageUrl from 'images/arrow_left_filled.svg';
import arrowRightImageUrl from 'images/arrow_right.svg';
import arrowRightFilledImageUrl from 'images/arrow_right_filled.svg';
import Image from 'sharedComponents/Image';
import checkImg from 'images/check.svg';
import advarselImg from 'images/remove.svg';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import opptjeningAktivitetKlassifisering from 'kodeverk/opptjeningAktivitetKlassifisering';


import styles from './timeLineData.less';

const MELLOMLIGGENDE_PERIODE = 'MELLOMLIGGENDE_PERIODE';

const isoToDdMmYyyy = (string) => {
  const parsedDate = moment(string, ISO_DATE_FORMAT, true);
  return parsedDate.isValid() ? parsedDate.format(DDMMYYYY_DATE_FORMAT) : string;
};

const findArrowLeftImg = isHovering => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = isHovering => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);

const backgroundStyle = kode => (
  (kode === MELLOMLIGGENDE_PERIODE
  || kode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT
  || kode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT) ? 'godkjent' : 'avvist'
);

const periodStatus = periodState => (periodState === opptjeningAktivitetKlassifisering.BEKREFTET_AVVIST
|| periodState === opptjeningAktivitetKlassifisering.ANTATT_AVVIST ? 'OpptjeningVilkarView.Avslatt' : 'OpptjeningVilkarView.Godkjent');

const isPeriodGodkjent = period => (
  !!(period.kode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT
    || period.kode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT
    || period.kode === MELLOMLIGGENDE_PERIODE)
);

const TimeLineData = ({
  selectedPeriod,
  selectNextPeriod,
  selectPrevPeriod,
}) => (
  <div>
    <Row>
      <Element>
        <FormattedMessage id="OpptjeningVilkarView.DetailsForSelectedPeriod" />
      </Element>
    </Row>
    <Row>
      <Column xs="6" className={backgroundStyle(selectedPeriod.data.klasse.kode)}>
        <Row className={styles.timeLineDataContainer}>
          <Column xs="6">
            <div>
              <Element>
                {isoToDdMmYyyy(selectedPeriod.data.fom)}
                {' '}
-
                {isoToDdMmYyyy(selectedPeriod.data.tom)}
              </Element>
            </div>
          </Column>
          <Column xs="6">
            {isPeriodGodkjent(selectedPeriod.data.klasse)
              && (
              <span className={styles.image}>
                <Image
                  src={checkImg}
                  className={styles.image}
                />
              </span>
              )
            }
            {!isPeriodGodkjent(selectedPeriod.data.klasse)
            && (
            <span className={styles.image}>
              <Image
                src={advarselImg}
                className={styles.image}
              />
            </span>
            )
            }
            <FormattedMessage id={periodStatus(selectedPeriod.data.klasse.kode)} />
          </Column>
        </Row>
      </Column>
      <Column xs="6">
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          imageSrcFunction={findArrowLeftImg}
          altCode="Timeline.prevPeriod"
          onMouseDown={selectPrevPeriod}
          onKeyDown={selectPrevPeriod}
        />
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          imageSrcFunction={findArrowRightImg}
          altCode="Timeline.nextPeriod"
          onMouseDown={selectNextPeriod}
          onKeyDown={selectNextPeriod}
        />
      </Column>
    </Row>
    <Row />
  </div>
);

TimeLineData.propTypes = {
  selectedPeriod: PropTypes.shape().isRequired,
  selectNextPeriod: PropTypes.func.isRequired,
  selectPrevPeriod: PropTypes.func.isRequired,
};

export default TimeLineData;
