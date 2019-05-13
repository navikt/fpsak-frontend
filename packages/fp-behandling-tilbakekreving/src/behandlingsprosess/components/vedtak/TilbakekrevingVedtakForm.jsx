import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingTilbakekreving/src/behandlingsprosess/behandlingsprosessTilbakeSelectors';
import {
  behandlingForm, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, isBehandlingFormDirty,
} from 'behandlingTilbakekreving/src/behandlingForm';

const formName = 'TilbakekrevingVedtakForm';

export const TilbakekrevingVedtakFormImpl = ({
  readOnly,
  readOnlySubmitButton,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <VerticalSpacer twentyPx />
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} textCode="TilbakekrevingVedtakForm.FritekstIVedtaksbrevet" />
    <VerticalSpacer twentyPx />
    <BehandlingspunktSubmitButton
      textCode="TilbakekrevingVedtakForm.TilGodkjenning"
      formName={formName}
      isReadOnly={readOnly}
      isSubmittable={!readOnlySubmitButton}
      isBehandlingFormSubmitting={isBehandlingFormSubmitting}
      isBehandlingFormDirty={isBehandlingFormDirty}
      hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
    />
  </form>
);

TilbakekrevingVedtakFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

const transformValues = values => [{
  kode: tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK,
  ...values,
}];

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values));
  const aksjonspunkt = getSelectedBehandlingspunktAksjonspunkter(initialState)[0];
  const initialValues = BehandlingspunktBegrunnelseTextField.buildInitialValues([{ begrunnelse: aksjonspunkt.begrunnelse }]);
  return () => ({
    initialValues,
    onSubmit: submitCallback,
  });
};

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(TilbakekrevingVedtakFormImpl));

export default TilbakekrevingVedtakForm;
