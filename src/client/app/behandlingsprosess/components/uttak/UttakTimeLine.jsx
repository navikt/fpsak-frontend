import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { Column, Row } from 'nav-frontend-grid';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils/formats';
import TimeLineControl from '../tilkjentYtelse/timeline/TimeLineControl';
import TimeLineSoker from '../tilkjentYtelse/timeline/TimeLineSoker';
import TimeLineSokerEnsamSoker from '../tilkjentYtelse/timeline/TimeLineSokerEnsamSoker';

import styles from './uttakTimeLine.less';

const getStartDateForTimeLine = customTimes => moment(customTimes.soknad < customTimes.fodsel ? customTimes.soknad : customTimes.fodsel).subtract(13, 'weeks');
const getEndDateForTimeLine = customTimes => moment(customTimes.fodsel).add(4, 'years');

const getHeight = medsoker => (medsoker ? '140px' : '100px');

const getOptions = (customTimes, medsoker) => ({
  width: '100%',
  height: getHeight(medsoker),
  zoomMin: 1000 * 60 * 60 * 24 * 30,
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
  zoomable: true,
  moveable: true,
  min: getStartDateForTimeLine(customTimes),
  max: getEndDateForTimeLine(customTimes),
  margin: {
    item: 10,
  },
  orientation: { axis: 'top' },
  stack: false,
  verticalScroll: false,
  showCurrentTime: false,
  locale: moment.locale('nb'),
  tooltip: {
    followMouse: true,
  },
  moment,
});

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();


const parseDates = item => ({
  ...item,
  start: parseDateString(item.fom),
  end: parseDateString(item.tom),
});

const showTimeLineBackup = () => {
  setTimeout(() => {
    const timeLineNode = document.getElementsByClassName('vis-timeline');
    if (timeLineNode && timeLineNode.length > 0 && timeLineNode[0].style.visibility && (timeLineNode[0].style.visibility !== 'visible')) {
      timeLineNode[0].style.visibility = 'visible';
    }
  }, 2500);
  return true;
};


const formatItems = (periodItems = []) => {
  const itemsWithDates = periodItems.map(parseDates);
  const formattedItemsArray = [];
  formattedItemsArray.length = 0;
  itemsWithDates.forEach((item) => {
    formattedItemsArray.push(item);
  });
  showTimeLineBackup();
  return formattedItemsArray;
};

/**
 * UttakTimeLine
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for uttak
 */

class UttakTimeLine extends Component {
  constructor() {
    super();

    this.goForward = this.goForward.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  zoomIn() {
    const timeline = this.timelineRef.$el;
    timeline.zoomIn(0.5);
  }

  zoomOut() {
    const timeline = this.timelineRef.$el;
    timeline.zoomOut(0.5);
  }

  goForward() {
    const timeline = this.timelineRef.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 42),
    };

    timeline.setWindow(newWindowTimes);
  }

  goBackward() {
    const timeline = this.timelineRef.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 42),
    };

    timeline.setWindow(newWindowTimes);
  }

  render() {
    const {
      hovedsokerKjonnKode, customTimes, nyePerioder, selectPeriodCallback, selectedPeriod, openPeriodInfo, medsokerKjonnKode,
    } = this.props;
    return (
      <div className={styles.timelineContainer}>
        <Row>
          <Column xs="1" className={styles.sokerContainer}>
            {medsokerKjonnKode
            && (
            <TimeLineSoker
              hovedsokerKjonnKode={hovedsokerKjonnKode}
              medsokerKjonnKode={medsokerKjonnKode}
            />
            )
            }
            {!medsokerKjonnKode
              && (
              <TimeLineSokerEnsamSoker
                hovedsokerKjonnKode={hovedsokerKjonnKode}
              />
              )
            }
          </Column>
          <Column xs="11">
            <div className={styles.timeLineWrapper}>
              <div className="uttakTimeline">
                <Timeline
                  options={getOptions(customTimes)}
                  items={formatItems(nyePerioder)}
                  customTimes={customTimes}
                  selectHandler={selectPeriodCallback}
                  ref={el => (this.timelineRef = el)} // eslint-disable-line no-return-assign
                  selection={[selectedPeriod ? selectedPeriod.id : null]}
                />
              </div>
            </div>
          </Column>
        </Row>
        <Row>
          <Column xs="12">
            <TimeLineControl
              goBackwardCallback={this.goBackward}
              goForwardCallback={this.goForward}
              zoomInCallback={this.zoomIn}
              zoomOutCallback={this.zoomOut}
              openPeriodInfo={openPeriodInfo}
            />
          </Column>
        </Row>
      </div>
    );
  }
}

UttakTimeLine.propTypes = {
  selectedPeriod: PropTypes.shape(),
  customTimes: PropTypes.shape().isRequired,
  nyePerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectPeriodCallback: PropTypes.func.isRequired,
  openPeriodInfo: PropTypes.func.isRequired,
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  medsokerKjonnKode: PropTypes.string,
};

UttakTimeLine.defaultProps = {
  selectedPeriod: undefined,
  medsokerKjonnKode: undefined,
};

export default UttakTimeLine;
