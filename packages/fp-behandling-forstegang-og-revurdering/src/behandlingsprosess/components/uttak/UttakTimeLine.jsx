import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { Column, Row } from 'nav-frontend-grid';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import TimeLineControl from './timeline/TimeLineControl';
import TimeLineSoker from './timeline/TimeLineSoker';
import TimeLineSokerEnsamSoker from './timeline/TimeLineSokerEnsamSoker';

import styles from './uttakTimeLine.less';

const getStartDateForTimeLine = (uttakPeriod, customTimes) => (moment(customTimes.fodsel) < moment(uttakPeriod.fom)
  ? moment(customTimes.fodsel).subtract(4, 'weeks') : moment(uttakPeriod.fom).subtract(4, 'weeks'));
const getEndDateForTimeLine = (customTimes) => moment(customTimes.fodsel).add(4, 'years');


const getOptions = (customTimes, sortedUttakPeriods, medsoker) => ({
  height: medsoker ? '140px' : '104px',
  width: '100%',
  zoomMin: 1000 * 60 * 60 * 24 * 30,
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
  zoomable: true,
  moveable: true,
  min: getStartDateForTimeLine(sortedUttakPeriods[0], customTimes),
  max: getEndDateForTimeLine(customTimes),
  start: moment(sortedUttakPeriods[0].fom).subtract(1, 'days'),
  end: moment(sortedUttakPeriods[sortedUttakPeriods.length - 1].tom).add(2, 'days'),
  margin: {
    item: 14,
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

const parseDateString = (dateString) => moment(dateString, ISO_DATE_FORMAT).toDate();

function sortByDate(a, b) {
  if (a.fom < b.fom) {
    return -1;
  }
  if (a.fom > b.fom) {
    return 1;
  }
  return 0;
}

const parseDates = (item) => ({
  ...item,
  start: parseDateString(item.fom),
  end: parseDateString(item.tomMoment),
});

const formatItems = (periodItems = []) => {
  const itemsWithDates = periodItems.map(parseDates);
  const formattedItemsArray = [];
  formattedItemsArray.length = 0;
  itemsWithDates.forEach((item) => {
    formattedItemsArray.push(item);
  });
  return formattedItemsArray;
};

const formatGroups = (periodItems = []) => {
  const duplicatesRemoved = periodItems.reduce((accPeriods, period) => {
    const hasPeriod = accPeriods.some((p) => p.group === period.group);
    if (!hasPeriod) accPeriods.push(period);
    return accPeriods;
  }, []);
  return duplicatesRemoved.map((activity) => ({
    id: activity.group,
    content: '',
  }));
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

    this.timelineRef = React.createRef();
  }

  componentDidMount() {
    // TODO Fjern når denne er retta: https://github.com/Lighthouse-io/react-visjs-timeline/issues/40
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this.timelineRef.current);
    if (node) {
      node.children[0].style.visibility = 'visible';
    }
  }

  zoomIn() {
    const timeline = this.timelineRef.current.$el;
    timeline.zoomIn(0.5);
  }

  zoomOut() {
    const timeline = this.timelineRef.current.$el;
    timeline.zoomOut(0.5);
  }

  goForward() {
    const timeline = this.timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 42),
    };

    timeline.setWindow(newWindowTimes);
  }

  goBackward() {
    const timeline = this.timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 42),
    };

    timeline.setWindow(newWindowTimes);
  }

  render() {
    const {
      hovedsokerKjonnKode,
      customTimes,
      uttakPerioder,
      selectPeriodCallback,
      selectedPeriod,
      openPeriodInfo,
      medsokerKjonnKode,
    } = this.props;
    const groups = formatGroups(uttakPerioder);
    const items = formatItems(uttakPerioder);
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
            )}
            {!medsokerKjonnKode
              && (
              <TimeLineSokerEnsamSoker
                hovedsokerKjonnKode={hovedsokerKjonnKode}
              />
              )}
          </Column>
          <Column xs="11">
            <div className={styles.timeLineWrapper}>
              <div className="uttakTimeline">
                <Timeline
                  ref={this.timelineRef}
                  options={getOptions(customTimes, uttakPerioder.sort(sortByDate), medsokerKjonnKode)}
                  items={items}
                  groups={groups}
                  customTimes={customTimes}
                  selectHandler={selectPeriodCallback}
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
              selectedPeriod={selectedPeriod}
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
  uttakPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
