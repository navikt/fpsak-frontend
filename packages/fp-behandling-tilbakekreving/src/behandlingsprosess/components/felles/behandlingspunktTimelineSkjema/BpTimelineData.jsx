import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { beregnBeløp } from 'behandlingTilbakekreving/src/behandlingsprosess/duckBpTilbake';
import { getSelectedBehandlingId } from 'behandlingTilbakekreving/src/duckTilbake';
import PerioderControler from './PerioderControler';
import PeriodSummary from './PeriodSummary';
import styles from './bpTimelineData.less';

export class BpTimelineDataImpl extends Component {
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
    const {
      resultatActivity,
      activityPanelName,
      callbackSetSelected: setSelected,
      beregnBeløp: callBeregnBeløp,
      behandlingId: selectedBehandlingId,
    } = this.props;
    const currentId = formValues.periodeId;
    const otherThanUpdated = resultatActivity.filter(o => o.id !== currentId);
    const forstePeriode = resultatActivity.find(o => o.id === currentId);
    const andrePeriode = { ...forstePeriode };
    forstePeriode.fom = formValues.forstePeriode.fom;
    forstePeriode.tom = formValues.forstePeriode.tom;
    andrePeriode.fom = formValues.andrePeriode.fom;
    andrePeriode.tom = formValues.andrePeriode.tom;
    andrePeriode.id = currentId + 1;
    if (!forstePeriode.begrunnelse) {
      forstePeriode.begrunnelse = ' ';
      andrePeriode.begrunnelse = ' ';
    }

    const params = {
      behandlingId: selectedBehandlingId,
      perioder: [forstePeriode, andrePeriode],
    };

    callBeregnBeløp(params).then((response) => {
      const forstePeriodeMedBeløp = { ...forstePeriode, feilutbetaling: response.perioder[0].belop };
      const andrePeriodeMedBeløp = { ...andrePeriode, feilutbetaling: response.perioder[1].belop };

      otherThanUpdated.map((periode) => {
        const periodeCopy = periode;
        if (periode.id > currentId) {
          periodeCopy.id += 1;
        }
        return periodeCopy;
      });
      const sortedActivities = otherThanUpdated.concat(forstePeriodeMedBeløp, andrePeriodeMedBeløp);
      sortedActivities.sort((a, b) => a.id - b.id);
      this.setFormField(activityPanelName, sortedActivities);
      this.hideModal();
      setSelected(forstePeriodeMedBeløp);
      this.hideModal();
    });
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

BpTimelineDataImpl.propTypes = {
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
  beregnBeløp: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
};

const mapStateToPros = state => ({
  behandlingId: getSelectedBehandlingId(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    beregnBeløp,
  }, dispatch),
});

const BpTimelineData = connect(mapStateToPros, mapDispatchToProps)(BpTimelineDataImpl);

export default BpTimelineData;
