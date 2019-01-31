import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getBehandlingVersjon } from 'behandlingTilbakekreving/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId } from 'behandlingTilbakekreving/duck';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingTilbakekreving/behandlingForm';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import {
  hovedsokerKjonnKode, tilbakekrevingPerioderResultat, customTimes,
} from './mockData';
import TilbakekrevingTimeLine from './TilbakekrevingTimeLine';
import TilbakekrevingData from './TilbakekrevingData';

const ACTIVITY_PANEL_NAME = 'tilbakekrevingsresultatActivity';
const formName = 'TilbakekrevingForm';
const godkjentKlassenavn = 'godkjentPeriode';
const avvistKlassenavn = 'avvistPeriode';

export const getStatusPeriode = (resultatType) => {
  if (resultatType.kode === periodeResultatType.INNVILGET) {
    return godkjentKlassenavn;
  }
  if (resultatType.kode === periodeResultatType.MANUELL_BEHANDLING) {
    return 'undefined';
  }
  return avvistKlassenavn;
};

const addClassNameGroupIdToPerioder = (tilbakekrevingPerioder) => {
  const perioderMedClassName = [];

  tilbakekrevingPerioder.forEach((item, index) => {
    const periodMedClassName = {
      ...item,
      id: index + 1,
      className: getStatusPeriode(item.periodeResultatType),
      hovedsoker: true,
      group: 1,
    };
    perioderMedClassName.push(periodMedClassName);
  });
  return perioderMedClassName;
};

export class TilbakekrevingPanelImpl extends Component {
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
    const { reduxFormChange: formChange, behandlingFormPrefix } = this.props;
    formChange(`${behandlingFormPrefix}.${formName}`, fieldName, fieldValue);
  }

  setSelectedTilbakekrevingActivity(tilbakekrevingPeriod, isMounting) {
    if (!isMounting) {
      this.initializePeriodForm(tilbakekrevingPeriod);
    }
    this.setState({ selectedItem: tilbakekrevingPeriod });
  }

  initializePeriodForm(tilbakekrevingPeriod) {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${ACTIVITY_PANEL_NAME}`, tilbakekrevingPeriod);
  }

  updateActivity(values) {
    const { tilbakekrevingsresultatActivity } = this.props;
    const { ...verdier } = values;

    const otherThanUpdated = tilbakekrevingsresultatActivity.filter(o => o.id !== verdier.id);
    const sortedActivities = otherThanUpdated.concat(verdier);
    sortedActivities.sort((a, b) => a.id - b.id);
    this.setFormField(ACTIVITY_PANEL_NAME, sortedActivities);
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
    } = this.props;
    const { selectedItem } = this.state;
    return (
      <FadingPanel>
        <Undertittel>
          <FormattedMessage id="Behandlingspunkt.Tilbakekreving" />
        </Undertittel>
        <VerticalSpacer twentyPx />
        {tilbakekrevingsresultatActivity && (
          <TilbakekrevingTimeLine
            selectedPeriod={selectedItem}
            customTimes={customTimes}
            tilbakekrevingPerioder={tilbakekrevingsresultatActivity}
            selectPeriodCallback={this.selectHandler}
            openPeriodInfo={this.openPeriodInfo}
            hovedsokerKjonnKode={hovedsokerKjonnKode}
          />
        )
        }
        {selectedItem && (
          <TilbakekrevingData
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
            activityPanelName={ACTIVITY_PANEL_NAME}
          />
        )
        }
      </FadingPanel>
    );
  }
}

TilbakekrevingPanelImpl.propTypes = {
  tilbakekrevingsresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tilbakekrevingPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
};

export const buildInitialValues = tilbakekrevingPerioder => ({
  tilbakekrevingsresultatActivity: tilbakekrevingPerioder.map((tb, index) => ({
    ...tb,
    id: index + 1,
  })),
});

const mapStateToProps = (state) => {
  const tilbakekrevingPerioder = addClassNameGroupIdToPerioder(tilbakekrevingPerioderResultat);
  return {
    tilbakekrevingPerioder,
    initialValues: buildInitialValues(tilbakekrevingPerioder),
    tilbakekrevingsresultatActivity: behandlingFormValueSelector(formName)(state, ACTIVITY_PANEL_NAME),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const TilbakekrevingPanel = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(TilbakekrevingPanelImpl)));

export default TilbakekrevingPanel;
