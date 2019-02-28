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
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { addClassNameGroupIdToPerioder } from '../felles/behandlingspunktTimelineSkjema/BpTimelineHelper';
import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import { getBehandlingVersjon } from '../../../selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId } from '../../../duckTilbake';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '../../../behandlingForm';
import {
  hovedsokerKjonnKode, tilbakekrevingPerioderResultat, customTimes,
} from './mockData';
import TilbakekrevingForm from './TilbakekrevingForm';

const ACTIVITY_PANEL_NAME = 'tilbakekrevingsresultatActivity';
const formName = 'TilbakekrevingForm';
const tilbakekrevingAksjonspunkter = [
  aksjonspunktCodes.VURDER_TILBAKEKREVING,
];

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
        resultatActivity={tilbakekrevingsresultatActivity}
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
  tilbakekrevingsresultatActivity: PropTypes.arrayOf(PropTypes.shape()),
  tilbakekrevingPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
};

TilbakekrevingPanelImpl.defaultProps = {
  tilbakekrevingsresultatActivity: undefined,
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

TilbakekrevingPanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.TILBAKEKREVING || tilbakekrevingAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingPanel;
