import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  behandlingForm, behandlingFormValueSelector, VilkarResultPicker, BehandlingspunktBegrunnelseTextField, ProsessPanelTemplate,
} from '@fpsak-frontend/fp-felles';

import { fastsattOpptjeningPropType } from '../propTypes/opptjeningVilkarOpptjeningPropType';
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
  behandlingId,
  behandlingVersjon,
  fastsattOpptjening,
  ...formProps
}) => (
  <ProsessPanelTemplate
    handleSubmit={formProps.handleSubmit}
    titleCode="OpptjeningVilkarAksjonspunktPanel.Opptjeningsvilkaret"
    isAksjonspunktOpen={isAksjonspunktOpen}
    aksjonspunktHelpTexts={['OpptjeningVilkarView.VurderOmSøkerHarRett']}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    isDirty={formProps.dirty}
    readOnly={readOnly}
    lovReferanse={lovReferanse}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
  >
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    <VilkarResultPicker
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt
    />
    <VerticalSpacer fourPx />
    <OpptjeningVilkarView
      months={fastsattOpptjening.opptjeningperiode.måneder}
      days={fastsattOpptjening.opptjeningperiode.dager}
      fastsattOpptjeningActivities={fastsattOpptjening.fastsattOpptjeningAktivitetList}
      opptjeningFomDate={fastsattOpptjening.opptjeningFom}
      opptjeningTomDate={fastsattOpptjening.opptjeningTom}
    />
    <VerticalSpacer twentyPx />
  </ProsessPanelTemplate>
);

OpptjeningVilkarAksjonspunktPanelImpl.propTypes = {
  fastsattOpptjening: fastsattOpptjeningPropType.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  erVilkarOk: PropTypes.bool,
  lovReferanse: PropTypes.string,
};

OpptjeningVilkarAksjonspunktPanelImpl.defaultProps = {
  erVilkarOk: undefined,
  lovReferanse: undefined,
};

export const buildInitialValues = createSelector(
  [(ownProps) => ownProps.behandlingsresultat,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.status],
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

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { aksjonspunkter, submitCallback } = initialOwnProps;
  const onSubmit = (values) => submitCallback([transformValues(values, aksjonspunkter)]);

  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    erVilkarOk: behandlingFormValueSelector(FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'erVilkarOk'),
    lovReferanse: ownProps.lovReferanse,
  });
};

const OpptjeningVilkarAksjonspunktPanel = connect(mapStateToPropsFactory)(behandlingForm({
  form: FORM_NAME,
})(OpptjeningVilkarAksjonspunktPanelImpl));

export default OpptjeningVilkarAksjonspunktPanel;
