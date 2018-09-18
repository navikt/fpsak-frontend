import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import BpPanelTemplate from 'behandlingsprosess/components/vilkar/BpPanelTemplate';
import { getSelectedBehandlingspunktVilkar, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus }
  from 'behandlingsprosess/behandlingsprosessSelectors';
import { getBehandlingsresultat } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import vilkarType from 'kodeverk/vilkarType';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import VilkarResultPicker from 'behandlingsprosess/components/vilkar/VilkarResultPicker';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';

/**
 * FodselVilkarForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av Fødselsvilkåret.
 */
export const FodselVilkarFormImpl = ({
  intl,
  avslagsarsaker,
  lovReferanse,
  readOnly,
  readOnlySubmitButton,
  erVilkarOk,
  hasAksjonspunkt,
  status,
  isAksjonspunktOpen,
  ...formProps
}) => (
  <BpPanelTemplate
    handleSubmit={formProps.handleSubmit}
    titleCode="FodselVilkarForm.Fodsel"
    isAksjonspunktOpen={isAksjonspunktOpen}
    aksjonspunktHelpTexts={['FodselVilkarForm.VurderGjelderSammeBarn']}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    bpStatus={status}
    lovReferanse={lovReferanse}
  >
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    <VerticalSpacer eightPx />
    <VilkarResultPicker avslagsarsaker={avslagsarsaker} erVilkarOk={erVilkarOk} readOnly={readOnly} hasAksjonspunkt={hasAksjonspunkt} />
  </BpPanelTemplate>
);

FodselVilkarFormImpl.propTypes = {
  intl: intlShape.isRequired,
  lovReferanse: PropTypes.string.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  hasAksjonspunkt: PropTypes.bool,
  status: PropTypes.string.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  ...formPropTypes,
};

FodselVilkarFormImpl.defaultProps = {
  erVilkarOk: undefined,
  hasAksjonspunkt: false,
};

const validate = ({ erVilkarOk, avslagCode }) => VilkarResultPicker.validate(erVilkarOk, avslagCode);

export const buildInitialValues = createSelector(
  [getBehandlingsresultat, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus],
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

const formName = 'FodselVilkarForm';

const mapStateToProps = (state, initialProps) => {
  const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
  return {
    status: getSelectedBehandlingspunktStatus(state),
    initialValues: buildInitialValues(state),
    erVilkarOk: behandlingFormValueSelector(formName)(state, 'erVilkarOk'),
    onSubmit: values => initialProps.submitCallback([transformValues(values, aksjonspunkter)]),
    lovReferanse: getSelectedBehandlingspunktVilkar(state)[0].lovReferanse,
    hasAksjonspunkt: aksjonspunkter.length > 0,
    avslagsarsaker: getKodeverk(kodeverkTyper.AVSLAGSARSAK)(state)[vilkarType.FODSELSVILKARET_MOR],
  };
};

const FodselVilkarForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
  validate,
})(FodselVilkarFormImpl)));

FodselVilkarForm.supports = (behandlingspunkt, apCodes) => behandlingspunkt === behandlingspunktCodes.FOEDSEL
    && (apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
    || apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN));

export default FodselVilkarForm;
