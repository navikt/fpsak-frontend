import React, { Component } from 'react';
import PropTypes from 'prop-types';
import foreldelseCodes from '../../../foreldelseCodes';
import BpTimeline from './BpTimeline';
import BpTimelineData from './BpTimelineData';

export class BpTimelinePanel extends Component {
  constructor() {
    super();
    this.initializePeriodForm = this.initializePeriodForm.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.nextPeriod = this.nextPeriod.bind(this);
    this.prevPeriod = this.prevPeriod.bind(this);
    this.setSelectedTilbakekrevingActivity = this.setSelectedTilbakekrevingActivity.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.cancelSelectedActivity = this.cancelSelectedActivity.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.setSelectedDefaultPeriod = this.setSelectedDefaultPeriod.bind(this);

    this.state = {
      selectedItem: null,
    };
  }

  componentWillMount() {
    this.setSelectedDefaultPeriod();
  }

  setSelectedDefaultPeriod() {
    const { resultatActivity } = this.props;
    const { selectedItem } = this.state;

    if (!selectedItem) {
      const defaultSelectedElement = resultatActivity.find(period => period.foreldet === foreldelseCodes.MANUELL_BEHANDLING);
      this.setState({ selectedItem: defaultSelectedElement });
    }
  }

  setFormField(fieldName, fieldValue) {
    const { reduxFormChange: formChange, behandlingFormPrefix, formName } = this.props;
    formChange(`${behandlingFormPrefix}.${formName}`, fieldName, fieldValue);
  }

  setSelectedTilbakekrevingActivity(tilbakekrevingPeriod, isMounting) {
    if (!isMounting) {
      this.initializePeriodForm(tilbakekrevingPeriod);
    }
    this.setState({ selectedItem: tilbakekrevingPeriod });
  }

  initializePeriodForm(tilbakekrevingPeriod) {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix, activityPanelName } = this.props;
    formInitialize(`${behandlingFormPrefix}.${activityPanelName}`, tilbakekrevingPeriod);
  }

  updateActivity(values) {
    const { resultatActivity, activityPanelName } = this.props;
    const { ...verdier } = values;

    const otherThanUpdated = resultatActivity.filter(o => o.id !== verdier.id);
    const sortedActivities = otherThanUpdated.concat(verdier);
    sortedActivities.sort((a, b) => a.id - b.id);
    this.setFormField(activityPanelName, sortedActivities);
    const tilbakekrevingPeriod = otherThanUpdated.find(period => period.foreldet === foreldelseCodes.MANUELL_BEHANDLING);
    this.setSelectedTilbakekrevingActivity(tilbakekrevingPeriod || undefined);
  }

  cancelSelectedActivity() {
    this.initializePeriodForm({});
    this.setState({ selectedItem: undefined });
  }

  openPeriodInfo(event) {
    const { resultatActivity } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    if (currentSelectedItem) {
      this.setSelectedTilbakekrevingActivity(undefined);
    } else {
      const period = resultatActivity.find(item => item.id === 1);
      this.setSelectedTilbakekrevingActivity(period);
    }
    event.preventDefault();
  }

  selectHandler(eventProps) {
    const { resultatActivity } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    const selectedItem = resultatActivity.find(item => item.id === eventProps.items[0]);
    if (currentSelectedItem) {
      this.setState({ selectedItem: undefined });
      this.setSelectedTilbakekrevingActivity(selectedItem);
    } else {
      this.setSelectedTilbakekrevingActivity(selectedItem);
    }
    eventProps.event.preventDefault();
  }

  nextPeriod(event) {
    const { resultatActivity } = this.props;
    const { selectedItem } = this.state;
    const newIndex = resultatActivity.findIndex(item => item.id === selectedItem.id) + 1;
    if (newIndex < resultatActivity.length) {
      this.setSelectedTilbakekrevingActivity(resultatActivity[newIndex]);
    }
    event.preventDefault();
  }

  prevPeriod(event) {
    const { resultatActivity } = this.props;
    const { selectedItem } = this.state;
    const newIndex = resultatActivity.findIndex(item => item.id === selectedItem.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedTilbakekrevingActivity(resultatActivity[newIndex]);
    }
    event.preventDefault();
  }

  render() {
    const {
      resultatActivity,
      behandlingFormPrefix,
      reduxFormChange: formChange,
      children,
      formName,
      activityPanelName,
      hovedsokerKjonnKode,
    } = this.props;
    const { selectedItem } = this.state;
    const childWithProps = selectedItem ? React.cloneElement(children, {
      selectedItemData: selectedItem,
      cancelSelectedActivity: this.cancelSelectedActivity,
      updateActivity: this.updateActivity,
      key: selectedItem.tom,
    }) : null;

    return (
      <>
        <BpTimeline
          selectedPeriod={selectedItem}
          tilbakekrevingPerioder={resultatActivity}
          selectPeriodCallback={this.selectHandler}
          openPeriodInfo={this.openPeriodInfo}
          hovedsokerKjonnKode={hovedsokerKjonnKode}
        />
        {selectedItem && (
          <BpTimelineData
            selectedItemData={selectedItem}
            callbackSetSelected={this.setSelectedTilbakekrevingActivity}
            callbackForward={this.nextPeriod}
            callbackBackward={this.prevPeriod}
            callbackUpdateActivity={this.updateActivity}
            callbackCancelSelectedActivity={this.cancelSelectedActivity}
            resultatActivity={resultatActivity}
            reduxFormChange={formChange}
            behandlingFormPrefix={behandlingFormPrefix}
            formName={formName}
            activityPanelName={activityPanelName}
          >
            { childWithProps }
          </BpTimelineData>
        )
        }
      </>
    );
  }
}

BpTimelinePanel.propTypes = {
  resultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default BpTimelinePanel;
