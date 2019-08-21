import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import VilkarResultPicker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPicker';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  behandlingFormForstegangOgRevurdering, behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import BpPanelTemplate from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/BpPanelTemplate';
import OpptjeningVilkarView from './OpptjeningVilkarView';

const FORM_NAME = 'OpptjeningVilkarForm';

/**
 * OpptjeningVilkarAksjonspunktPanel
 *
 * Presentasjonskomponent. Viser panel for å løse aksjonspunkt for avslått opptjeningsvilkår
 */
export const OpptjeningVilkarAksjonspunktPanelImpl = ({
  isAksjonspunktOpen,
  erVilkarOk,
  readOnlySubmitButton,
  readOnly,
  lovReferanse,
  ...formProps
}) => (
  <BpPanelTemplate
    handleSubmit={formProps.handleSubmit}
    titleCode="Behandlingspunkt.Opptjeningsvilkaret"
    isAksjonspunktOpen={isAksjonspunktOpen}
    aksjonspunktHelpTexts={['OpptjeningVilkarView.VurderOmSøkerHarRett']}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    isDirty={formProps.dirty}
    readOnly={readOnly}
    lovReferanse={lovReferanse}
  >
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    <VilkarResultPicker
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt
    />
    <VerticalSpacer fourPx />
    <OpptjeningVilkarView />
    <VerticalSpacer twentyPx />
  </BpPanelTemplate>
);

OpptjeningVilkarAksjonspunktPanelImpl.propTypes = {
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  lovReferanse: PropTypes.string.isRequired,
};

OpptjeningVilkarAksjonspunktPanelImpl.defaultProps = {
  erVilkarOk: undefined,
};

export const buildInitialValues = createSelector(
  [behandlingSelectors.getBehandlingsresultat, behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter,
    behandlingsprosessSelectors.getSelectedBehandlingspunktStatus],
  (behandlingsresultat, aksjonspunkter, status) => ({
    ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

const transformValues = (values, aksjonspunkter) => ({
  ...VilkarResultPicker.transformValues(values),
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
  ...{ kode: aksjonspunkter[0].definisjon.kode },
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunkter = behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState);
  const onSubmit = values => ownProps.submitCallback([transformValues(values, aksjonspunkter)]);

  return state => ({
    onSubmit,
    initialValues: buildInitialValues(state),
    erVilkarOk: behandlingFormValueSelector(FORM_NAME)(state, 'erVilkarOk'),
    lovReferanse: behandlingsprosessSelectors.getSelectedBehandlingspunktVilkar(state)[0].lovReferanse,
  });
  };

const OpptjeningVilkarAksjonspunktPanel = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: FORM_NAME,
})(OpptjeningVilkarAksjonspunktPanelImpl));

export default OpptjeningVilkarAksjonspunktPanel;
