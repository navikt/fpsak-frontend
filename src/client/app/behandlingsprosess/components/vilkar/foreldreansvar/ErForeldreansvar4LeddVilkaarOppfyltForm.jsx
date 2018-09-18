import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import BpPanelTemplate from 'behandlingsprosess/components/vilkar/BpPanelTemplate';
import { getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getBehandlingsresultat } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import vilkarType from 'kodeverk/vilkarType';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import VilkarResultPicker from 'behandlingsprosess/components/vilkar/VilkarResultPicker';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';

const createAksjonspunktHelptTexts = (intl, aksjonspunkter) => {
  const helpTexts = [];
  const apCodes = aksjonspunkter.map(ap => ap.definisjon.kode);
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
  initialValues,
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
  [getBehandlingsresultat, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus],
  (behandlingsresultat, aksjonspunkter, status) => ({
    ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

const transformValues = (values, aksjonspunkter) => aksjonspunkter.map(ap => ({
  ...VilkarResultPicker.transformValues(values),
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
  ...{ kode: ap.definisjon.kode },
}));

const formName = 'ErForeldreansvar4LeddVilkaarOppfyltForm';

const mapStateToProps = (state, initialProps) => {
  const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
  return {
    aksjonspunkter,
    initialValues: buildInitialValues(state),
    erVilkarOk: behandlingFormValueSelector(formName)(state, 'erVilkarOk'),
    avslagsarsaker: getKodeverk(kodeverkTyper.AVSLAGSARSAK)(state)[vilkarType.FORELDREANSVARSVILKARET_4_LEDD],
    onSubmit: values => initialProps.submitCallback(transformValues(values, aksjonspunkter)),
  };
};

const ErForeldreansvar4LeddVilkaarOppfyltForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
  validate,
})(ErForeldreansvar4LeddVilkaarOppfyltFormImpl)));

const hasAksjonspunktCode = apCodes => apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD)
|| apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
|| apCodes.includes(aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN);

ErForeldreansvar4LeddVilkaarOppfyltForm.supports = (behandlingspunkt, apCodes, vilkarTypeCodes) => behandlingspunkt === behandlingspunktCodes.FORELDREANSVAR
  && vilkarTypeCodes.includes(vilkarType.FORELDREANSVARSVILKARET_4_LEDD)
  && hasAksjonspunktCode(apCodes);

export default ErForeldreansvar4LeddVilkaarOppfyltForm;
