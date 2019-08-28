import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import BpPanelTemplate from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/BpPanelTemplate';
import behandlingspunktSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  behandlingFormForstegangOgRevurdering, behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import VilkarResultPicker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPicker';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

const createAksjonspunktHelptTexts = (intl, aksjonspunkter) => {
  const helpTexts = [];
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  if (apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD)) {
    helpTexts.push('ErForeldreansvar4LeddVilkaarOppfyltForm.Paragraf');
  }
  if (apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
      || apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN)) {
    helpTexts.push('ErForeldreansvar4LeddVilkaarOppfyltForm.Vurder');
  }
  return helpTexts;
};

/**
 * ErForeldreansvar4LeddVilkaarOppfyltForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av foreldreansvarvilkåret 4.ledd.
 */
export const ErForeldreansvar4LeddVilkaarOppfyltFormImpl = ({
  intl,
  avslagsarsaker,
  readOnly,
  readOnlySubmitButton,
  erVilkarOk,
  aksjonspunkter,
  ...formProps
}) => (
  <BpPanelTemplate
    handleSubmit={formProps.handleSubmit}
    titleCode="ErForeldreansvar4LeddVilkaarOppfyltForm.Foreldreansvar"
    isAksjonspunktOpen={!readOnlySubmitButton}
    aksjonspunktHelpTexts={createAksjonspunktHelptTexts(intl, aksjonspunkter)}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
  >
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={aksjonspunkter.length > 0}
    />
  </BpPanelTemplate>
);

ErForeldreansvar4LeddVilkaarOppfyltFormImpl.propTypes = {
  intl: intlShape.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  ...formPropTypes,
};

ErForeldreansvar4LeddVilkaarOppfyltFormImpl.defaultProps = {
  erVilkarOk: undefined,
  aksjonspunkter: [],
};

const validate = ({ erVilkarOk, avslagCode }) => VilkarResultPicker.validate(erVilkarOk, avslagCode);

export const buildInitialValues = createSelector(
  [behandlingSelectors.getBehandlingsresultat, behandlingspunktSelectors.getSelectedBehandlingspunktAksjonspunkter,
    behandlingspunktSelectors.getSelectedBehandlingspunktStatus],
  (behandlingsresultat, aksjonspunkter, status) => ({
    ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

const transformValues = (values, aksjonspunkter) => aksjonspunkter.map((ap) => ({
  ...VilkarResultPicker.transformValues(values),
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
  ...{ kode: ap.definisjon.kode },
}));

const formName = 'ErForeldreansvar4LeddVilkaarOppfyltForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunkter = behandlingspunktSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState);
  const onSubmit = (values) => ownProps.submitCallback(transformValues(values, aksjonspunkter));
  const avslagsarsaker = getKodeverk(kodeverkTyper.AVSLAGSARSAK)(initialState)[vilkarType.FORELDREANSVARSVILKARET_4_LEDD];

  return (state) => ({
    initialValues: buildInitialValues(state),
    erVilkarOk: behandlingFormValueSelector(formName)(state, 'erVilkarOk'),
    avslagsarsaker,
    aksjonspunkter,
    onSubmit,
  });
};

const ErForeldreansvar4LeddVilkaarOppfyltForm = connect(mapStateToPropsFactory)(injectIntl(behandlingFormForstegangOgRevurdering({
  form: formName,
  validate,
})(ErForeldreansvar4LeddVilkaarOppfyltFormImpl)));

const hasAksjonspunktCode = (apCodes) => apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD)
|| apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
|| apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN);

ErForeldreansvar4LeddVilkaarOppfyltForm.supports = (behandlingspunkt, apCodes, vilkarTypeCodes) => behandlingspunkt === behandlingspunktCodes.FORELDREANSVAR
  && vilkarTypeCodes.includes(vilkarType.FORELDREANSVARSVILKARET_4_LEDD)
  && hasAksjonspunktCode(apCodes);

export default ErForeldreansvar4LeddVilkaarOppfyltForm;
