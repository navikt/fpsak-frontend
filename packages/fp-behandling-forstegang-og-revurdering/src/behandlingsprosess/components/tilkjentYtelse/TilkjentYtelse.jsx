import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { injectIntl, intlShape } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import { ISO_DATE_FORMAT, DDMMYY_DATE_FORMAT, calcDaysAndWeeks } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { stonadskontoType, uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import TimeLineData from './timeline/TimeLineData';
import TimeLineSokerEnsamSoker from './timeline/TimeLineSokerEnsamSoker';
import TimeLineControl from './timeline/TimeLineControl';

import styles from './tilkjentYtelse.less';

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT)
  .toDate();

const getOptions = (nyePerioder) => {
  const firstPeriod = nyePerioder[0];
  const lastPeriod = nyePerioder[nyePerioder.length - 1];

  return {
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
    start: moment(firstPeriod.fom).subtract(1, 'days'),
    end: moment(lastPeriod.tom).add(2, 'days'),
  };
};

const gradertKlassenavn = 'gradert';
const innvilgetKlassenavn = 'innvilget';

const getStatusForPeriode = (periode) => {
  const graderteAndeler = periode.andeler.filter(andel => andel.uttak && andel.uttak.gradering === true);
  if (graderteAndeler.length === 0) {
    return innvilgetKlassenavn;
  }
  return gradertKlassenavn;
};

const createTooltipContent = (periodeType, intl, item) => (`
  <p>
    ${moment(item.fom)
  .format(DDMMYY_DATE_FORMAT)} - ${moment(item.tom)
  .format(DDMMYY_DATE_FORMAT)}
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     ${intl.formatMessage({ id: calcDaysAndWeeks(moment(item.fom), moment(item.tom)).id },
  {
    weeks: calcDaysAndWeeks(moment(item.fom), moment(item.tom)).weeks,
    days: calcDaysAndWeeks(moment(item.fom), moment(item.tom)).days,
  })}
    </br>
    ${item.utsettelseType && item.utsettelseType.kode !== '-'
  ? intl.formatMessage({ id: 'Timeline.tooltip.utsettelsePeriode' }) : periodeType}
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    ${intl.formatMessage({ id: 'Timeline.tooltip.dagsats' },
  {
    dagsats: item.dagsats,
  })}
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
    copyOfItem.end = moment(item.tom)
      .add(1, 'days');
    copyOfItem.title = createTooltipContent(findKorrektLabelForKvote(item.andeler[0].uttak.stonadskontoType), intl, item);
    perioderMedClassName.push(copyOfItem);
  });
  return perioderMedClassName;
};

const getCustomTimes = (soknadDate, familiehendelseDate, lastPeriod) => ({
  soknad: parseDateString(soknadDate),
  fodsel: parseDateString(familiehendelseDate),
  lastDateInSoknad: lastPeriod ? parseDateString(lastPeriod.tom) : parseDateString(moment()
    .toDate()),
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
        isSoknadSvangerskapspenger,
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
                ref={this.timelineRef}
                options={getOptions(nyePerioder)}
                items={nyePerioder}
                groups={groups}
                customTimes={customTimes}
                selectHandler={selectHandler}
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
            isSoknadSvangerskapspenger={isSoknadSvangerskapspenger}
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
  isSoknadSvangerskapspenger: PropTypes.bool.isRequired,
};

TilkjentYtelse.defaultProps = {
  medsokerKjonnKode: undefined,
};

export default injectIntl(TilkjentYtelse);
