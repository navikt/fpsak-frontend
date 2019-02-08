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
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '../../../behandlingForm';
import { getBehandlingVersjon } from '../../../selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId } from '../../../duckTilbake';
import {
  hovedsokerKjonnKode, tilbakekrevingPerioderResultat, customTimes,
} from '../tilbakekreving/mockData';
import ForeldelseForm from './ForeldelseForm';

const ACTIVITY_PANEL_NAME = 'foreldelsesresultatActivity';
const formName = 'ForeldelseForm';
const foreldelseAksjonspunkter = [
  aksjonspunktCodes.VURDER_FORELDELSE,
];

const ForeldelsePanelImpl = ({
  foreldelsesresultatActivity,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  reduxFormInitialize: formInitialize,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Behandlingspunkt.Foreldelse" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      {foreldelsesresultatActivity && (
      <BpTimelinePanel
        customTimes={customTimes}
        hovedsokerKjonnKode={hovedsokerKjonnKode}
        resultatActivity={foreldelsesresultatActivity}
        activityPanelName={ACTIVITY_PANEL_NAME}
        behandlingFormPrefix={behandlingFormPrefix}
        reduxFormChange={formChange}
        reduxFormInitialize={formInitialize}
        formName={formName}
      >
        <ForeldelseForm
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

ForeldelsePanelImpl.propTypes = {
  foreldelsesresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
};

export const transformValues = values => [{
  ...values,
  kode: '5555',
}];

export const buildInitialValues = foreldelsePerioder => ({
  foreldelsesresultatActivity: foreldelsePerioder.map((period, index) => ({
    ...period,
    id: index + 1,
  })),
});

const mapStateToProps = (state, ownProps) => {
  const foreldelsePerioder = addClassNameGroupIdToPerioder(tilbakekrevingPerioderResultat);
  return {
    initialValues: buildInitialValues(foreldelsePerioder),
    foreldelsesresultatActivity: behandlingFormValueSelector(formName)(state, ACTIVITY_PANEL_NAME),
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

const ForeldelsePanel = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(ForeldelsePanelImpl)));

ForeldelsePanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.FORELDELSE || foreldelseAksjonspunkter.some(ap => apCodes.includes(ap));

export default ForeldelsePanel;
