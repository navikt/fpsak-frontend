import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { Column, Row } from 'nav-frontend-grid';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';

import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';

import TilbakekrevingTimelineController from './TilbakekrevingTimelineController';

import styles from './tilbakekrevingTimeline.less';

export const GODKJENT_CLASSNAME = 'godkjentPeriode';
export const AVVIST_CLASSNAME = 'avvistPeriode';

const isKvinne = kode => kode === navBrukerKjonn.KVINNE;

const getOptions = tilbakekrevingPeriod => ({
  height: '104px',
  width: '100%',
  zoomMin: 1000 * 60 * 60 * 24 * 30,
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
  zoomable: true,
  moveable: true,
  min: moment(tilbakekrevingPeriod.fom).subtract(4, 'weeks'),
  max: moment(tilbakekrevingPeriod.fom).add(4, 'years'),
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

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();

function sortByDate(a, b) {
  if (a.fom < b.fom) {
    return -1;
  }
  if (a.fom > b.fom) {
    return 1;
  }
  return 0;
}

const parseDates = item => ({
  ...item,
  start: parseDateString(item.fom),
  end: parseDateString(moment(item.tom).add(1, 'days')),
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
    const hasPeriod = accPeriods.some(p => p.group === period.group);
    if (!hasPeriod) accPeriods.push(period);
    return accPeriods;
  }, []);
  return duplicatesRemoved.map(activity => ({
    id: activity.group,
    content: '',
  }));
};
/**
 * TilbakekrevingTimeLine
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for tilbakekreving
 */

class TilbakekrevingTimeline extends Component {
  constructor() {
    super();

    this.goForward = this.goForward.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.redrawTimeLineBackup = this.redrawTimeLineBackup.bind(this);
  }

  componentDidMount() {
    this.redrawTimeLineBackup(this);
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
      perioder,
      selectedPeriod,
      selectPeriodCallback,
      toggleDetaljevindu,
      HjelpetekstKomponent,
      kjonn,
    } = this.props;

    const newPerioder = perioder.map((periode) => {
      const className = periode.isGodkjent ? GODKJENT_CLASSNAME : AVVIST_CLASSNAME;
      return {
        ...periode,
        className: periode.isAksjonspunktOpen ? 'undefined' : className,
        group: 1,
      };
    });

    const groups = formatGroups(newPerioder);
    const items = formatItems(newPerioder);
    return (
      <div className={styles.timelineContainer}>
        <Row>
          <Column xs="1" className={styles.sokerContainer}>
            <Row>
              <Image
                className={styles.iconMedsoker}
                src={isKvinne(kjonn) ? urlKvinne : urlMann}
                altCode="Person.ImageText"
                titleCode={isKvinne(kjonn) ? 'Person.Woman' : 'Person.Man'}
              />
            </Row>
          </Column>
          <Column xs="11">
            <div className={styles.timeLineWrapper}>
              <div className="uttakTimeline">
                <Timeline
                  options={getOptions(newPerioder.sort(sortByDate)[0])}
                  items={items}
                  groups={groups}
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
            <TilbakekrevingTimelineController
              goBackwardCallback={this.goBackward}
              goForwardCallback={this.goForward}
              zoomInCallback={this.zoomIn}
              zoomOutCallback={this.zoomOut}
              openPeriodInfo={toggleDetaljevindu}
              selectedPeriod={selectedPeriod}
            >
              <HjelpetekstKomponent />
            </TilbakekrevingTimelineController>
          </Column>
        </Row>
      </div>
    );
  }
}

TilbakekrevingTimeline.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape({
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    isAksjonspunktOpen: PropTypes.bool.isRequired,
    isGodkjent: PropTypes.bool.isRequired,
  })).isRequired,
  toggleDetaljevindu: PropTypes.func.isRequired,
  selectedPeriod: PropTypes.shape({
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    isAksjonspunktOpen: PropTypes.bool.isRequired,
    isGodkjent: PropTypes.bool.isRequired,
  }),
  selectPeriodCallback: PropTypes.func.isRequired,
  HjelpetekstKomponent: PropTypes.func.isRequired,
  kjonn: PropTypes.string.isRequired,
};

TilbakekrevingTimeline.defaultProps = {
  selectedPeriod: undefined,
};

export default TilbakekrevingTimeline;
