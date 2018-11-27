import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { injectIntl, intlShape } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { stonadskontoType, uttakPeriodeNavn } from 'kodeverk/uttakPeriodeType';
import TimeLineData from './timeline/TimeLineData';
import TimeLineSokerEnsamSoker from './timeline/TimeLineSokerEnsamSoker';
import TimeLineControl from './timeline/TimeLineControl';

import styles from './tilkjentYtelse.less';

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();

const getOptions = () => ({
  moment,
  width: '100%',
  zoomMin: 1000 * 60 * 60 * 24 * 30,
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
  margin: {
    item: 10,
  },
  orientation: { axis: 'top' },
  stack: false,
  showCurrentTime: false,
  locale: moment.locale('nb'),
  tooltip: {
    followMouse: true,
  },
});

const gradertKlassenavn = 'gradert';
const innvilgetKlassenavn = 'innvilget';

const getStatusForPeriode = (periode) => {
  const graderteAndeler = periode.andeler.filter(andel => andel.uttak && andel.uttak.gradering === true);
  if (graderteAndeler.length === 0) {
    return innvilgetKlassenavn;
  }
  return gradertKlassenavn;
};

const createTooltipContent = (dagsats, periodeFom, periodeTom, periodeType, intl) => (`
  <p>
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.dagsats' })}:</strong> ${dagsats}
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.start' })}:</strong> ${moment(periodeFom).format(DDMMYYYY_DATE_FORMAT)}
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.slutt' })}:</strong> ${moment(periodeTom).format(DDMMYYYY_DATE_FORMAT)}
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.periodetype' })}:</strong> ${periodeType}
  </p>
`);

const findKorrektLabelForKvote = (stonadtype) => {
  switch (stonadtype) {
    case stonadskontoType.FEDREKVOTE:
      return uttakPeriodeNavn.FEDREKVOTE;
    case stonadskontoType.MØDREKVOTE:
      return uttakPeriodeNavn.MØDREKVOTE;
    case stonadskontoType.FELLESPERIODE:
      return uttakPeriodeNavn.FELLESPERIODE;
    case stonadskontoType.FORELDREPENGER_FØR_FØDSEL:
      return uttakPeriodeNavn.FORELDREPENGER_FØR_FØDSEL;
    case stonadskontoType.FLERBARNSDAGER:
      return uttakPeriodeNavn.FLERBARNSDAGER;
    case stonadskontoType.FORELDREPENGER:
      return uttakPeriodeNavn.FORELDREPENGER;
    default:
      return '';
  }
};

// og grupp kan endres nor vi har en medsøkare
const addClassNameGroupIdToPerioder = (perioder, intl) => {
  const perioderMedClassName = [];
  perioder.forEach((item) => {
    const status = getStatusForPeriode(item);
    const copyOfItem = Object.assign({}, item);
    copyOfItem.className = status;
    copyOfItem.group = 1;
    copyOfItem.start = parseDateString(item.fom);
    copyOfItem.end = moment(item.tom).add(1, 'days');
    copyOfItem.title = createTooltipContent(item.dagsats, item.fom, item.tom, findKorrektLabelForKvote(item.andeler[0].uttak.stonadskontoType), intl);
    perioderMedClassName.push(copyOfItem);
  });
  return perioderMedClassName;
};

const getCustomTimes = (soknadDate, familiehendelseDate, lastPeriod) => ({
  soknad: parseDateString(soknadDate),
  fodsel: parseDateString(familiehendelseDate),
  lastDateInSoknad: lastPeriod ? parseDateString(lastPeriod.tom) : parseDateString(moment().toDate()),
});

/**
 * TilkjentYtelse
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for tilkjent ytelse
 */

export class TilkjentYtelse extends Component {
  constructor() {
    super();

    this.state = {
      selectedItem: null,
    };

    this.selectHandler = this.selectHandler.bind(this);
    this.goForward = this.goForward.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.nextPeriod = this.nextPeriod.bind(this);
    this.prevPeriod = this.prevPeriod.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.redrawTimeLineBackup = this.redrawTimeLineBackup.bind(this);
  }

  componentDidMount() {
    this.redrawTimeLineBackup(this);
  }

  openPeriodInfo() {
    const { props: { items }, state: { selectedItem } } = this;
    if (selectedItem) {
      this.setState({
        selectedItem: null,
      });
    } else {
      this.setState({
        selectedItem: items[0],
      });
    }
  }

  nextPeriod() {
    const { props: { items }, state: { selectedItem: currentSelectedItem } } = this;
    const newIndex = items.findIndex(item => item.id === currentSelectedItem.id) + 1;
    if (newIndex < items.length) {
      const selectedItem = items[newIndex];
      this.setState({
        selectedItem,
      });
    }
  }

  prevPeriod() {
    const { props: { items }, state: { selectedItem: currentSelectedItem } } = this;
    const newIndex = items.findIndex(item => item.id === currentSelectedItem.id) - 1;
    if (newIndex >= 0) {
      const selectedItem = items[newIndex];
      this.setState({
        selectedItem,
      });
    }
  }

  selectHandler(eventProps) {
    const { props: { items } } = this;
    const selectedItem = items.find(item => item.id === eventProps.items[0]);
    this.setState({
      selectedItem,
    });
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

  redrawTimeLineBackup(that) { // eslint-disable-line class-methods-use-this
    setTimeout(() => {
      const timeLineNode = document.getElementsByClassName('vis-timeline');
      if (that.timelineRef && timeLineNode.length > 0 && (timeLineNode[0].style.visibility && (timeLineNode[0].style.visibility !== 'visible'))) {
        const timeline = that.timelineRef.$el;
        timeline.redraw();
      }
    }, 2000);
  }

  render() {
    const {
      nextPeriod,
      prevPeriod,
      goBackward,
      goForward,
      openPeriodInfo,
      props: {
        groups,
        items,
        soknadDate,
        familiehendelseDate,
        hovedsokerKjonnKode,
        medsokerKjonnKode,
        intl,
      },
      selectHandler,
      state: { selectedItem },
      zoomIn,
      zoomOut,
    } = this;
    const lastPeriod = items[items.length - 1];
    const customTimes = getCustomTimes(soknadDate, familiehendelseDate, lastPeriod);
    const nyePerioder = addClassNameGroupIdToPerioder(items, intl);
    return (
      <div className={styles.timelineContainer}>
        <VerticalSpacer sixteenPx />
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="1" className={styles.sokerContainer}>
            <TimeLineSokerEnsamSoker
              hovedsokerKjonnKode={hovedsokerKjonnKode}
              medsokerKjonnKode={medsokerKjonnKode}
            />
          </Column>
          <Column xs="11">
            <div className={styles.timeLineWrapper}>
              <Timeline
                options={getOptions()}
                items={nyePerioder}
                groups={groups}
                customTimes={customTimes}
                selectHandler={selectHandler}
                ref={el => (this.timelineRef = el)} // eslint-disable-line no-return-assign
                selection={[selectedItem ? selectedItem.id : null]}
              />
            </div>
          </Column>
        </Row>
        <Row>
          <Column xs="12">
            <TimeLineControl
              goBackwardCallback={goBackward}
              goForwardCallback={goForward}
              zoomInCallback={zoomIn}
              zoomOutCallback={zoomOut}
              openPeriodInfo={openPeriodInfo}
            />
          </Column>
        </Row>
        {selectedItem
        && (
        <TimeLineData
          selectedItemStartDate={selectedItem.fom.toString()}
          selectedItemEndDate={selectedItem.tom.toString()}
          selectedItemData={selectedItem}
          callbackForward={nextPeriod}
          callbackBackward={prevPeriod}
        />
        )
        }
      </div>
    );
  }
}

TilkjentYtelse.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  soknadDate: PropTypes.string.isRequired,
  familiehendelseDate: PropTypes.shape().isRequired,
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  medsokerKjonnKode: PropTypes.string,
  intl: intlShape.isRequired,
};

TilkjentYtelse.defaultProps = {
  medsokerKjonnKode: undefined,
};

export default injectIntl(TilkjentYtelse);
