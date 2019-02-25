import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { getPeriodFeilutbetaling } from './BpTimelineHelper';
import PerioderControler from './PerioderControler';
import PeriodSummary from './PeriodSummary';
import styles from './bpTimelineData.less';

export class BpTimelineData extends Component {
  constructor() {
    super();
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.splitPeriod = this.splitPeriod.bind(this);
    this.setFormField = this.setFormField.bind(this);

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
    const { resultatActivity, activityPanelName, callbackSetSelected: setSelected } = this.props;
    const otherThanUpdated = resultatActivity.filter(o => o.id !== formValues.periodeId);
    const periodToUpdate = resultatActivity.filter(o => o.id === formValues.periodeId);
    const forstePeriode = JSON.parse(JSON.stringify(...periodToUpdate));
    const andrePeriode = JSON.parse(JSON.stringify(...periodToUpdate));
    const currentId = formValues.periodeId;
    const forstePeriodeTomIndex = formValues.dagligUtbetalinger.findIndex(e => e.dag === formValues.forstePeriode.tom) + 1;
    if (!periodToUpdate[0].begrunnelse) {
      forstePeriode.begrunnelse = ' ';
      andrePeriode.begrunnelse = ' ';
    }

    forstePeriode.fom = formValues.forstePeriode.fom;
    forstePeriode.tom = formValues.forstePeriode.tom;
    forstePeriode.dagligUtbetalinger = formValues.dagligUtbetalinger.slice(0, forstePeriodeTomIndex);
    forstePeriode.feilutbetaling = getPeriodFeilutbetaling(forstePeriode.dagligUtbetalinger);
    andrePeriode.fom = formValues.andrePeriode.fom;
    andrePeriode.tom = formValues.andrePeriode.tom;
    andrePeriode.dagligUtbetalinger = formValues.dagligUtbetalinger.slice(forstePeriodeTomIndex);
    andrePeriode.feilutbetaling = getPeriodFeilutbetaling(andrePeriode.dagligUtbetalinger);
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
    this.hideModal();
  }

  render() {
    const {
      callbackForward,
      callbackBackward,
      selectedItemData,
      children,
    } = this.props;
    const { showDelPeriodeModal } = this.state;
    return (
      <Row>
        <Column xs="12">
          <div className={styles.showDataContainer}>
            <PerioderControler
              callbackForward={callbackForward}
              callbackBackward={callbackBackward}
              showDelPeriodeModal={showDelPeriodeModal}
              splitPeriod={this.splitPeriod}
              hideModal={this.hideModal}
              showModal={this.showModal}
              selectedItemData={selectedItemData}
            />
            <PeriodSummary
              feilutbetaling={selectedItemData.feilutbetaling}
              fom={selectedItemData.fom}
              tom={selectedItemData.tom}
            />
            { children }
          </div>
        </Column>
      </Row>
    );
  }
}

BpTimelineData.propTypes = {
  selectedItemData: PropTypes.shape().isRequired,
  resultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  callbackSetSelected: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BpTimelineData;
