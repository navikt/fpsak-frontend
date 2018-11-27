import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { calcDaysWithoutWeekends } from 'utils/dateUtils';
import Image from 'sharedComponents/Image';
import splitPeriodImageHoverUrl from 'images/splitt_hover.svg';
import splitPeriodImageUrl from 'images/splitt.svg';
import arrowLeftImageUrl from 'images/arrow_left.svg';
import arrowLeftFilledImageUrl from 'images/arrow_left_filled.svg';
import arrowRightImageUrl from 'images/arrow_right.svg';
import arrowRightFilledImageUrl from 'images/arrow_right_filled.svg';
import { uttaksresultatAktivitetPropType } from 'behandling/proptypes/uttaksresultatPropType';

import styles from './uttakTimeLineData.less';
import UttakActivity from './UttakActivity';
import DelOppPeriodeModal from './DelOppPeriodeModal';

const findArrowLeftImg = isHovering => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = isHovering => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);
const splitPeriodImg = isHovering => (isHovering ? splitPeriodImageHoverUrl : splitPeriodImageUrl);


export class UttakTimeLineData extends Component {
  constructor() {
    super();
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.splitPeriod = this.splitPeriod.bind(this);

    this.state = {
      showDelPeriodeModal: false,
    };
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, formName, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${formName}`, fieldName, fieldValue);
  }

  showModal(event) {
    event.preventDefault();
    this.setState({
      showDelPeriodeModal: true,
    });
    const { behandlingFormPrefix, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${'DelOppPeriode'}`, 'ForstePeriodeTomDato', null);
  }

  hideModal() {
    this.setState({
      showDelPeriodeModal: false,
    });
  }

  splitPeriod(formValues) {
    const { uttaksresultatActivity, activityPanelName, callbackSetSelected: setSelected } = this.props;
    const otherThanUpdated = uttaksresultatActivity.filter(o => o.id !== formValues.periodeId);
    const periodToUpdate = uttaksresultatActivity.filter(o => o.id === formValues.periodeId);
    const forstePeriode = JSON.parse(JSON.stringify(...periodToUpdate));
    const andrePeriode = JSON.parse(JSON.stringify(...periodToUpdate));
    const newTrekkDagerForstePeriode = calcDaysWithoutWeekends(formValues.forstePeriode.fom, formValues.forstePeriode.tom);
    const newTrekkDagerAndrePeriode = calcDaysWithoutWeekends(formValues.andrePeriode.fom, formValues.andrePeriode.tom);
    const currentId = formValues.periodeId;
    if (!periodToUpdate[0].begrunnelse) {
      forstePeriode.begrunnelse = ' ';
      andrePeriode.begrunnelse = ' ';
    }
    forstePeriode.fom = formValues.forstePeriode.fom;
    forstePeriode.tom = formValues.forstePeriode.tom;
    forstePeriode.hovedsoker = formValues.hovedsoker;
    andrePeriode.hovedsoker = formValues.hovedsoker;
    andrePeriode.fom = formValues.andrePeriode.fom;
    andrePeriode.tom = formValues.andrePeriode.tom;
    periodToUpdate[0].aktiviteter.forEach((period, index) => {
      if (period.days || period.weeks || formValues.gradertTrekkdager) {
        const periodUtbetalningsgrad = !period.utbetalingsgrad ? (formValues.gradertTrekkdager * (1 - formValues.gradertProsentandelArbeid * 0.01))
          : formValues.gradertTrekkdager;
        const totalTrekkDagerUtenGradering = newTrekkDagerForstePeriode + newTrekkDagerAndrePeriode;
        const totalSetDays = (period.days || period.weeks) ? (period.weeks * 5) + period.days : totalTrekkDagerUtenGradering;
        const faktiskaTrekkdagerGradert = formValues.gradertTrekkdager ? periodUtbetalningsgrad : totalTrekkDagerUtenGradering;
        const actualDayValue = formValues.gradertTrekkdager && !(period.days || period.weeks)
          ? faktiskaTrekkdagerGradert / totalTrekkDagerUtenGradering : totalSetDays / totalTrekkDagerUtenGradering;
        forstePeriode.aktiviteter[index].weeks = Math.trunc((newTrekkDagerForstePeriode * actualDayValue) / 5);
        forstePeriode.aktiviteter[index].days = Math.trunc((newTrekkDagerForstePeriode * actualDayValue) % 5);
        const forstePeriodeAntalDagar = (forstePeriode.aktiviteter[index].weeks * 5)
          + forstePeriode.aktiviteter[index].days;
        andrePeriode.aktiviteter[index].weeks = formValues.gradertTrekkdager && !(period.days || period.weeks)
          ? Math.trunc((faktiskaTrekkdagerGradert - forstePeriodeAntalDagar) / 5) : Math.trunc((totalSetDays - forstePeriodeAntalDagar) / 5);
        andrePeriode.aktiviteter[index].days = formValues.gradertTrekkdager && !(period.days || period.weeks)
          ? Math.trunc((faktiskaTrekkdagerGradert - forstePeriodeAntalDagar) % 5) : ((totalSetDays - forstePeriodeAntalDagar) % 5);
        forstePeriode.aktiviteter[index].trekkdager = forstePeriodeAntalDagar;
        andrePeriode.aktiviteter[index].trekkdager = (andrePeriode.aktiviteter[index].weeks * 5)
          + andrePeriode.aktiviteter[index].days;
      } else {
        forstePeriode.aktiviteter[index].weeks = Math.trunc(newTrekkDagerForstePeriode / 5);
        forstePeriode.aktiviteter[index].days = newTrekkDagerForstePeriode % 5;
        andrePeriode.aktiviteter[index].weeks = Math.trunc(newTrekkDagerAndrePeriode / 5);
        andrePeriode.aktiviteter[index].days = newTrekkDagerAndrePeriode % 5;
        forstePeriode.aktiviteter[index].trekkdager = newTrekkDagerForstePeriode;
        andrePeriode.aktiviteter[index].trekkdager = newTrekkDagerAndrePeriode;
      }
    });
    andrePeriode.id = currentId + 1;
    otherThanUpdated.map((periode) => {
      const periodeCopy = periode;
      if (periode.id > currentId) {
        periodeCopy.id += 1;
      }
      return periodeCopy;
    });
    const sortedActivities = otherThanUpdated.concat(forstePeriode, andrePeriode);
    sortedActivities.sort((a, b) => a.id - b.id);
    this.setFormField(activityPanelName, sortedActivities);
    this.hideModal();
    setSelected(forstePeriode);
  }

  render() {
    const {
      readOnly,
      selectedItemData,
      callbackForward,
      callbackBackward,
      callbackUpdateActivity,
      callbackCancelSelectedActivity,
      isApOpen,
      harSoktOmFlerbarnsdager,
    } = this.props;
    const { showDelPeriodeModal } = this.state;

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
              <Column xs="7">
                {!readOnly
                && (
                  <span className={styles.splitPeriodPosition}>
                    <Image
                      tabIndex="0"
                      className={styles.splitPeriodImage}
                      imageSrcFunction={splitPeriodImg}
                      altCode="UttakTimeLineData.PeriodeData.DelOppPerioden"
                      onMouseDown={this.showModal}
                      onKeyDown={e => (e.keyCode === 13 ? this.showModal(e) : null)}
                    />

                    <FormattedMessage id="UttakTimeLineData.PeriodeData.DelOppPerioden" />
                  </span>
                )
                }
                {showDelPeriodeModal
                && (
                  <DelOppPeriodeModal
                    cancelEvent={this.hideModal}
                    showModal={showDelPeriodeModal}
                    periodeData={selectedItemData}
                    splitPeriod={this.splitPeriod}
                  />
                )
                }
              </Column>
              <Column xs="2">
                <span className={styles.navigationPosition}>
                  <Image
                    tabIndex="0"
                    className={styles.timeLineButton}
                    imageSrcFunction={findArrowLeftImg}
                    altCode="Timeline.prevPeriod"
                    onMouseDown={callbackBackward}
                    onKeyDown={callbackBackward}
                  />
                  <Image
                    tabIndex="0"
                    className={styles.timeLineButton}
                    imageSrcFunction={findArrowRightImg}
                    altCode="Timeline.nextPeriod"
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
  }
}

UttakTimeLineData.propTypes = {
  selectedItemData: uttaksresultatAktivitetPropType,
  callbackForward: PropTypes.func.isRequired,
  callbackSetSelected: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  callbackUpdateActivity: PropTypes.func.isRequired,
  callbackCancelSelectedActivity: PropTypes.func.isRequired,
  uttaksresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
};

UttakTimeLineData.defaultProps = {
  selectedItemData: undefined,
  isApOpen: false,
};

export default UttakTimeLineData;
