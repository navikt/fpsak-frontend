import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import BpPanelTemplate from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/BpPanelTemplate';
import { getBehandlingsresultat } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getSelectedBehandlingspunktVilkar, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus }
  from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/behandlingsprosessSelectors';
import VilkarResultPicker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPicker';

/**
 * AdopsjonVilkarForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av Adopsjonsvilkåret.
 */
export const AdopsjonVilkarFormImpl = ({
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
    titleCode="AdopsjonVilkarForm.Adopsjon"
    isAksjonspunktOpen={isAksjonspunktOpen}
    aksjonspunktHelpTexts={['AdopsjonVilkarForm.VurderGjelderSammeBarn']}
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

AdopsjonVilkarFormImpl.propTypes = {
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

AdopsjonVilkarFormImpl.defaultProps = {
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

const formName = 'AdopsjonVilkarForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const avslagsarsaker = getKodeverk(kodeverkTyper.AVSLAGSARSAK)(initialState)[vilkarType.ADOPSJONSVILKARET];
  const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(initialState);
  const onSubmit = values => ownProps.submitCallback([transformValues(values, aksjonspunkter)]);
  return state => ({
    status: getSelectedBehandlingspunktStatus(state),
    initialValues: buildInitialValues(state),
    erVilkarOk: behandlingFormValueSelector(formName)(state, 'erVilkarOk'),
    lovReferanse: getSelectedBehandlingspunktVilkar(state)[0].lovReferanse,
    hasAksjonspunkt: aksjonspunkter.length > 0,
    avslagsarsaker,
    onSubmit,
  });
};

const AdopsjonVilkarForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
  validate,
})(AdopsjonVilkarFormImpl));

AdopsjonVilkarForm.supports = (behandlingspunkt, apCodes) => behandlingspunkt === behandlingspunktCodes.ADOPSJON
    && (apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
    || apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN));

export default AdopsjonVilkarForm;
