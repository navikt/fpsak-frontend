import React, { Component, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { Column, Row } from 'nav-frontend-grid';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import Kjønnkode from '@fpsak-frontend/types/src/Kjønnkode';

import TimeLineControl from './components/TimeLineControl';
import TimeLineSoker from './components/TimeLineSoker';
import TimeLineSokerEnsamSoker from './components/TimeLineSokerEnsamSoker';

import styles from './tidslinje.less';

interface EventProps {
  items: string[];
  event: Event;
}

interface Periode {
  fom: string;
  tom: string;
  id: string;
  className?: string;
  hoverText?: string;
}

interface TidslinjeProps {
  customTimes: {
    soknad: string;
    fodsel: string;
    revurdering: string;
    dodSoker: string;
  };
  hovedsokerKjonnKode: Kjønnkode;
  medsokerKjonnKode?: Kjønnkode;
  openPeriodInfo: (event: MouseEvent) => void;
  selectedPeriod?: Periode;
  selectPeriodCallback: (eventProps: EventProps) => void;
  uttakPerioder: Periode[];
  children?: React.ReactNode;
}

const getOptions = (customTimes, sortedUttakPeriods) => ({
  end: moment(sortedUttakPeriods[sortedUttakPeriods.length - 1].tom).add(2, 'days'),
  locale: moment.locale('nb'),
  margin: { item: 14 },
  max: moment(customTimes.fodsel).add(4, 'years'),
  min: moment.min([moment(customTimes.fodsel), moment(sortedUttakPeriods[0].fom)]).subtract(4, 'weeks'),
  moment,
  moveable: true,
  orientation: { axis: 'top' },
  showCurrentTime: false,
  stack: false,
  start: moment(sortedUttakPeriods[0].fom).subtract(1, 'days'),
  tooltip: { followMouse: true },
  verticalScroll: false,
  width: '100%',
  zoomable: true,
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
  zoomMin: 1000 * 60 * 60 * 24 * 30,
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
 * Tidslinje
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for uttak
 */
class Tidslinje extends Component<TidslinjeProps> {
  timelineRef: React.RefObject<any>;

  constructor(props) {
    super(props);

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
      children,
      customTimes,
      hovedsokerKjonnKode,
      medsokerKjonnKode,
      openPeriodInfo,
      selectedPeriod,
      selectPeriodCallback,
      uttakPerioder,
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
                  options={getOptions(customTimes, uttakPerioder.sort(sortByDate))}
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
            >
              {children}
            </TimeLineControl>
          </Column>
        </Row>
      </div>
    );
  }
}

export default Tidslinje;
