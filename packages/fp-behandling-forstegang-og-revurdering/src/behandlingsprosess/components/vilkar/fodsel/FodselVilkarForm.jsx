import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import BpPanelTemplate from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/BpPanelTemplate';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  behandlingFormForstegangOgRevurdering, behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import VilkarResultPicker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPicker';
import { getKodeverk, isForeldrepengerFagsak } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

const avslagsarsakerES = ['1002', '1003', '1032'];

/**
 * FodselVilkarForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av Fødselsvilkåret.
 */
export const FodselVilkarFormImpl = ({
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

const formName = 'FodselVilkarForm';

export const getFodselVilkarAvslagsarsaker = (isFpFagsak, fodselsvilkarAvslagskoder) => (isFpFagsak
  ? fodselsvilkarAvslagskoder.filter((arsak) => !avslagsarsakerES.includes(arsak.kode))
  : fodselsvilkarAvslagskoder);

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunkter = behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState);
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values, aksjonspunkter)]);
  const avslagsarsaker = getKodeverk(kodeverkTyper.AVSLAGSARSAK)(initialState)[vilkarType.FODSELSVILKARET_MOR];
  const filtrerteAvslagsarsaker = getFodselVilkarAvslagsarsaker(isForeldrepengerFagsak(initialState), avslagsarsaker);

  return (state) => ({
    onSubmit,
    avslagsarsaker: filtrerteAvslagsarsaker,
    status: behandlingsprosessSelectors.getSelectedBehandlingspunktStatus(state),
    initialValues: buildInitialValues(state),
    erVilkarOk: behandlingFormValueSelector(formName)(state, 'erVilkarOk'),
    lovReferanse: behandlingsprosessSelectors.getSelectedBehandlingspunktVilkar(state)[0].lovReferanse,
    hasAksjonspunkt: aksjonspunkter.length > 0,
  });
};

const FodselVilkarForm = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: formName,
  validate,
})(FodselVilkarFormImpl));

FodselVilkarForm.supports = (behandlingspunkt, apCodes) => behandlingspunkt === behandlingspunktCodes.FOEDSEL
    && (apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
    || apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN));

export default FodselVilkarForm;
