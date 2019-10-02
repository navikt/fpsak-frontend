import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import {
  behandlingForm, behandlingFormValueSelector, BehandlingspunktBegrunnelseTextField, VilkarResultPicker, ProsessPanelTemplate,
} from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

import foreldreansvarVilkarAksjonspunkterPropType from '../propTypes/foreldreansvarVilkarAksjonspunkterPropType';

const createAksjonspunktHelptTexts = (intl, aksjonspunkter, isEngangsstonad) => {
  const helpTexts = [];
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  if (apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD)) {
    if (isEngangsstonad) {
      helpTexts.push('ErForeldreansvarVilkaarOppfyltForm.2LeddParagrafEngangsStonad');
    } else {
      helpTexts.push('ErForeldreansvarVilkaarOppfyltForm.2LeddParagrafForeldrepenger');
    }
  }
  if (apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD)) {
    helpTexts.push('ErForeldreansvarVilkaarOppfyltForm.4LeddParagraf');
  }
  if (apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
      || apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN)) {
    helpTexts.push('ErForeldreansvarVilkaarOppfyltForm.Vurder');
  }
  return helpTexts;
};

/**
 * ErForeldreansvarVilkaarOppfyltForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunkter for avklaring av foreldreansvarvilkåret 2 eller 4 ledd.
 */
export const ErForeldreansvarVilkaarOppfyltForm = ({
  intl,
  avslagsarsaker,
  readOnly,
  readOnlySubmitButton,
  erVilkarOk,
  aksjonspunkter,
  isEngangsstonad,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <ProsessPanelTemplate
    handleSubmit={formProps.handleSubmit}
    titleCode="ErForeldreansvarVilkaarOppfyltForm.Foreldreansvar"
    isAksjonspunktOpen={!readOnlySubmitButton}
    aksjonspunktHelpTexts={createAksjonspunktHelptTexts(intl, aksjonspunkter, isEngangsstonad)}
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

ErForeldreansvarVilkaarOppfyltForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isEngangsstonad: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  aksjonspunkter: PropTypes.arrayOf(foreldreansvarVilkarAksjonspunkterPropType),
  ...formPropTypes,
};

ErForeldreansvarVilkaarOppfyltForm.defaultProps = {
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

const formName = 'ErForeldreansvarVilkaarOppfyltForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const {
    aksjonspunkter, submitCallback, isForeldreansvar2Ledd, alleKodeverk,
  } = initialOwnProps;
  const onSubmit = (values) => submitCallback(transformValues(values, aksjonspunkter));
  const vilkarTypeKode = isForeldreansvar2Ledd ? vilkarType.FORELDREANSVARSVILKARET_2_LEDD : vilkarType.FORELDREANSVARSVILKARET_4_LEDD;
  const avslagsarsaker = alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarTypeKode];

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      initialValues: buildInitialValues(state, ownProps),
      erVilkarOk: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erVilkarOk'),
      avslagsarsaker,
      aksjonspunkter,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
  validate,
})(ErForeldreansvarVilkaarOppfyltForm)));
