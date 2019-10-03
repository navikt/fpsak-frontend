import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import {
  behandlingForm, behandlingFormValueSelector, VilkarResultPicker, BehandlingspunktBegrunnelseTextField, ProsessPanelTemplate,
} from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

import omsorgVilkarAksjonspunkterPropType from '../propTypes/omsorgVilkarAksjonspunkterPropType';

const createAksjonspunktHelptTexts = (aksjonspunkter) => {
  const helpTexts = [];
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  if (apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET)) {
    helpTexts.push('ErOmsorgVilkaarOppfyltForm.Paragraf');
  }
  if (apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
      || apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN)) {
    helpTexts.push('ErOmsorgVilkaarOppfyltForm.Vurder');
  }
  return helpTexts;
};

/**
 * ErOmsorgVilkaarOppfyltForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunkter for avklaring av omsorgsvilkåret.
 */
export const ErOmsorgVilkaarOppfyltFormImpl = ({
  avslagsarsaker,
  readOnly,
  readOnlySubmitButton,
  erVilkarOk,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <ProsessPanelTemplate
    handleSubmit={formProps.handleSubmit}
    titleCode="ErOmsorgVilkaarOppfyltForm.Omsorg"
    isAksjonspunktOpen={!readOnlySubmitButton}
    aksjonspunktHelpTexts={createAksjonspunktHelptTexts(aksjonspunkter)}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
  >
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={aksjonspunkter.length > 0}
    />
  </ProsessPanelTemplate>
);

ErOmsorgVilkaarOppfyltFormImpl.propTypes = {
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  aksjonspunkter: PropTypes.arrayOf(omsorgVilkarAksjonspunkterPropType),
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

ErOmsorgVilkaarOppfyltFormImpl.defaultProps = {
  erVilkarOk: undefined,
  aksjonspunkter: [],
};

const validate = ({ erVilkarOk, avslagCode }) => VilkarResultPicker.validate(erVilkarOk, avslagCode);

export const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.behandlingsresultat,
    (state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) => ownProps.status],
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

const formName = 'ErOmsorgVilkaarOppfyltForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { alleKodeverk, submitCallback } = initialOwnProps;
  const onSubmit = (values) => submitCallback(transformValues(values, initialOwnProps.aksjonspunkter));
  const avslagsarsaker = alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarType.OMSORGSVILKARET];

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      onSubmit,
      avslagsarsaker,
      initialValues: buildInitialValues(state, ownProps),
      erVilkarOk: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erVilkarOk'),
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
  validate,
})(ErOmsorgVilkaarOppfyltFormImpl));
