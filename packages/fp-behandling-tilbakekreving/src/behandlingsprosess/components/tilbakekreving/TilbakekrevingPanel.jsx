import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  FadingPanel, VerticalSpacer, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingTilbakekreving/src/behandlingForm';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingTilbakekreving/src/duckTilbake';
import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import { getBehandlingVersjon, getBehandlingVilkarsvurderingsperioder } from '../../../selectors/tilbakekrevingBehandlingSelectors';
import TilbakekrevingForm from './TilbakekrevingForm';

const formName = 'TilbakekrevingForm';
const ACTIVITY_PANEL_NAME = 'tilbakekrevingsresultatActivity';

const tilbakekrevingAksjonspunkter = [aksjonspunktCodes.VURDER_TILBAKEKREVING];

const TilbakekrevingPanelImpl = ({
  tilbakekrevingsresultatActivity,
  behandlingFormPrefix,
  isApOpen,
  kjonn,
  readOnly,
  readOnlySubmitButton,
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
      <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
        {[<FormattedMessage key="AksjonspunktHjelpetekst" id="TilbakekrevingPanel.AksjonspunktHjelpetekst" />] }
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />
      {tilbakekrevingsresultatActivity && (
        <BpTimelinePanel
          hovedsokerKjonnKode={kjonn}
          resultatActivity={tilbakekrevingsresultatActivity}
          activityPanelName={ACTIVITY_PANEL_NAME}
          behandlingFormPrefix={behandlingFormPrefix}
          reduxFormChange={formChange}
          reduxFormInitialize={formInitialize}
          formName={formName}
        >
          <TilbakekrevingForm
            behandlingFormPrefix={behandlingFormPrefix}
            aktiviteter={tilbakekrevingsresultatActivity}
            formName={formName}
            activityPanelName={ACTIVITY_PANEL_NAME}
            readOnly={readOnly}
          />
        </BpTimelinePanel>
      )}
      <VerticalSpacer twentyPx />
      <BehandlingspunktSubmitButton
        formName={formName}
        isReadOnly={readOnly}
        isSubmittable={!readOnlySubmitButton}
        isBehandlingFormSubmitting={isBehandlingFormSubmitting}
        isBehandlingFormDirty={isBehandlingFormDirty}
        hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
      />
    </FadingPanel>
  </form>
);

TilbakekrevingPanelImpl.propTypes = {
  tilbakekrevingsresultatActivity: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  kjonn: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
};

TilbakekrevingPanelImpl.defaultProps = {
  tilbakekrevingsresultatActivity: undefined,
};

export const transformValues = values => [{
  ...values,
}];

export const buildInitialValues = perioder => ({
  tilbakekrevingsresultatActivity: perioder.map((tb, index) => ({
    ...tb,
    id: index + 1,
    group: 1,
  })),
});


const getStatusPeriode = () => 'undefined';
const addClassname = perioder => (perioder ? perioder.map(p => ({
  ...p,
  className: getStatusPeriode(),
})) : undefined);

const mapStateToProps = (state, ownProps) => ({
    initialValues: buildInitialValues(getBehandlingVilkarsvurderingsperioder(state)),
    kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
    tilbakekrevingsresultatActivity: addClassname(behandlingFormValueSelector(formName)(state, ACTIVITY_PANEL_NAME)),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    onSubmit: values => ownProps.submitCallback(transformValues(values)),
  });

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const TilbakekrevingPanel = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
})(TilbakekrevingPanelImpl)));

TilbakekrevingPanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.TILBAKEKREVING || tilbakekrevingAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingPanel;
