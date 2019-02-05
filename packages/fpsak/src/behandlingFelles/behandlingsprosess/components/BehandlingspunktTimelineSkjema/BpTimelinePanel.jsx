import React, { Component } from 'react';
import PropTypes from 'prop-types';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
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
    const { tilbakekrevingPerioder } = this.props;
    const { selectedItem } = this.state;
    const defaultSelectedElement = tilbakekrevingPerioder.find(period => period.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING);
    const defaultSelectedElementIfNoAP = tilbakekrevingPerioder.find(period => period.hovedsoker);
    if (!selectedItem) {
      this.setState({ selectedItem: defaultSelectedElement || defaultSelectedElementIfNoAP });
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
    const { tilbakekrevingsresultatActivity, activityPanelName } = this.props;
    const { ...verdier } = values;

    const otherThanUpdated = tilbakekrevingsresultatActivity.filter(o => o.id !== verdier.id);
    const sortedActivities = otherThanUpdated.concat(verdier);
    sortedActivities.sort((a, b) => a.id - b.id);
    this.setFormField(activityPanelName, sortedActivities);
    const tilbakekrevingPeriod = otherThanUpdated.find(o => o.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING);
    this.setSelectedTilbakekrevingActivity(tilbakekrevingPeriod || undefined);
  }

  cancelSelectedActivity() {
    this.initializePeriodForm({});
    this.setState({ selectedItem: undefined });
  }

  openPeriodInfo(event) {
    const { tilbakekrevingsresultatActivity } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    if (currentSelectedItem) {
      this.setSelectedTilbakekrevingActivity(undefined);
    } else {
      const period = tilbakekrevingsresultatActivity.find(item => item.id === 1);
      this.setSelectedTilbakekrevingActivity(period);
    }
    event.preventDefault();
  }

  selectHandler(eventProps) {
    const { tilbakekrevingsresultatActivity } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    const selectedItem = tilbakekrevingsresultatActivity.find(item => item.id === eventProps.items[0]);
    if (currentSelectedItem) {
      this.setState({ selectedItem: undefined });
      this.setSelectedTilbakekrevingActivity(selectedItem);
    } else {
      this.setSelectedTilbakekrevingActivity(selectedItem);
    }
    eventProps.event.preventDefault();
  }

  nextPeriod(event) {
    const { tilbakekrevingsresultatActivity } = this.props;
    const { selectedItem } = this.state;
    const newIndex = tilbakekrevingsresultatActivity.findIndex(item => item.id === selectedItem.id) + 1;
    if (newIndex < tilbakekrevingsresultatActivity.length) {
      this.setSelectedTilbakekrevingActivity(tilbakekrevingsresultatActivity[newIndex]);
    }
    event.preventDefault();
  }

  prevPeriod(event) {
    const { tilbakekrevingsresultatActivity } = this.props;
    const { selectedItem } = this.state;
    const newIndex = tilbakekrevingsresultatActivity.findIndex(item => item.id === selectedItem.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedTilbakekrevingActivity(tilbakekrevingsresultatActivity[newIndex]);
    }
    event.preventDefault();
  }

  render() {
    const {
      tilbakekrevingsresultatActivity,
      behandlingFormPrefix,
      reduxFormChange: formChange,
      children,
      formName,
      activityPanelName,
      hovedsokerKjonnKode,
      customTimes,
    } = this.props;
    const { selectedItem } = this.state;
    const childrenWithProps = React.Children.map(children, child => React.cloneElement(child, {
      selectedItemData: selectedItem,
      cancelSelectedActivity: this.cancelSelectedActivity,
      updateActivity: this.updateActivity,
    }));

    return (
      <>
        <BpTimeline
          selectedPeriod={selectedItem}
          customTimes={customTimes}
          tilbakekrevingPerioder={tilbakekrevingsresultatActivity}
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
            tilbakekrevingsresultatActivity={tilbakekrevingsresultatActivity}
            reduxFormChange={formChange}
            behandlingFormPrefix={behandlingFormPrefix}
            formName={formName}
            activityPanelName={activityPanelName}
          >
            { childrenWithProps }
          </BpTimelineData>
        )
        }
      </>
    );
  }
}

BpTimelinePanel.propTypes = {
  tilbakekrevingsresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tilbakekrevingPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  customTimes: PropTypes.shape().isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default BpTimelinePanel;
