import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import {
  FadingPanel, VerticalSpacer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import { Hovedknapp } from 'nav-frontend-knapper';
import { getBehandlingVersjon } from 'behandlingTilbakekreving/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId } from 'behandlingTilbakekreving/duck';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingTilbakekreving/behandlingForm';
import BpTimelinePanel from 'behandlingFelles/behandlingsprosess/components/BehandlingspunktTimelineSkjema/BpTimelinePanel';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import {
  hovedsokerKjonnKode, tilbakekrevingPerioderResultat, customTimes,
} from './mockData';
import TilbakekrevingForm from './TilbakekrevingForm';

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

const TilbakekrevingPanelImpl = ({
  tilbakekrevingsresultatActivity,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  reduxFormInitialize: formInitialize,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Behandlingspunkt.Tilbakekreving" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      {tilbakekrevingsresultatActivity && (
        <BpTimelinePanel
          customTimes={customTimes}
          hovedsokerKjonnKode={hovedsokerKjonnKode}
          tilbakekrevingPerioder={tilbakekrevingsresultatActivity}
          activityPanelName={ACTIVITY_PANEL_NAME}
          behandlingFormPrefix={behandlingFormPrefix}
          reduxFormChange={formChange}
          reduxFormInitialize={formInitialize}
          formName={formName}
        >
          <TilbakekrevingForm
            behandlingFormPrefix={behandlingFormPrefix}
            formName={formName}
            activityPanelName={ACTIVITY_PANEL_NAME}
          />
        </BpTimelinePanel>
      )
      }
      <VerticalSpacer twentyPx />
      <FlexRow>
        <FlexColumn>
          <Hovedknapp
            mini
            disabled={false}
            spinner={formProps.submitting}
          >
            <FormattedMessage id="Uttak.Confirm" />
          </Hovedknapp>
        </FlexColumn>
      </FlexRow>
    </FadingPanel>
  </form>
);

TilbakekrevingPanelImpl.propTypes = {
  tilbakekrevingsresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tilbakekrevingPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
};

export const transformValues = values => [{
  ...values,
  kode: '5555',
}];

export const buildInitialValues = tilbakekrevingPerioder => ({
  tilbakekrevingsresultatActivity: tilbakekrevingPerioder.map((tb, index) => ({
    ...tb,
    id: index + 1,
  })),
});

const mapStateToProps = (state, ownProps) => {
  const tilbakekrevingPerioder = addClassNameGroupIdToPerioder(tilbakekrevingPerioderResultat);
  return {
    tilbakekrevingPerioder,
    initialValues: buildInitialValues(tilbakekrevingPerioder),
    tilbakekrevingsresultatActivity: behandlingFormValueSelector(formName)(state, ACTIVITY_PANEL_NAME),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    onSubmit: values => ownProps.submitCallback(transformValues(values)),
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
