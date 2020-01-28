import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import {
  behandlingForm, FaktaBegrunnelseTextField, behandlingFormValueSelector, FaktaSubmitButton,
} from '@fpsak-frontend/fp-felles';

import omsorgAksjonspunkterPropType from '../propTypes/omsorgAksjonspunkterPropType';
import omsorgPersonopplysningerPropType from '../propTypes/omsorgPersonopplysningerPropType';
import OmsorgFaktaForm from './OmsorgFaktaForm';
import BostedFaktaView from './BostedFaktaView';
import IkkeOmsorgPeriodeField from './IkkeOmsorgPeriodeField';

const { MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG } = aksjonspunktCodes;

const getHelpTexts = (aksjonspunkter) => {
  const helpTexts = [];
  const harAleneomsorgAp = aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG);
  const harOmsorgAp = aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG);
  if (harAleneomsorgAp.length > 0) {
    helpTexts.push(<FormattedMessage key="VurderAleneomsorg" id="OmsorgInfoPanel.VurderAleneomsorg" />);
  }
  if (harOmsorgAp.length > 0) {
    helpTexts.push(<FormattedMessage key="VurderOmsorg" id="OmsorgInfoPanel.VurderOmsorg" />);
  }
  return helpTexts;
};

export const OmsorgInfoPanel = ({
  personopplysninger,
  readOnly,
  hasOpenAksjonspunkter,
  submittable,
  aksjonspunkter,
  omsorg,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  ytelsefordeling,
  soknad,
  alleMerknaderFraBeslutter,
  ...formProps
}) => (
  <>
    {!readOnly && (
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {getHelpTexts(aksjonspunkter)}
      </AksjonspunktHelpTextTemp>
    )}
    <BostedFaktaView personopplysning={personopplysninger} ektefellePersonopplysning={personopplysninger.ektefelle} alleKodeverk={alleKodeverk} />
    <form onSubmit={formProps.handleSubmit}>
      <FaktaBegrunnelseTextField isDirty={formProps.dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse hasVurderingText />
      <OmsorgFaktaForm
        readOnly={readOnly}
        omsorg={omsorg}
        aksjonspunkter={aksjonspunkter}
        ytelsefordeling={ytelsefordeling}
        soknad={soknad}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      />
      <FaktaSubmitButton
        formName={formProps.form}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      />
    </form>

  </>
);

OmsorgInfoPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(omsorgAksjonspunkterPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  omsorg: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  personopplysninger: omsorgPersonopplysningerPropType.isRequired,
  ...formPropTypes,
};

OmsorgInfoPanel.defaultProps = {
  omsorg: undefined,
};

const buildInitialValues = createSelector([
  (ownProps) => ownProps.ytelsefordeling, (ownProps) => ownProps.aksjonspunkter], (ytelsefordeling, aksjonspunkter) => {
  const omsorgAp = aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG
    || ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG);
  return {
    ...OmsorgFaktaForm.buildInitialValues(ytelsefordeling, omsorgAp),
    ...FaktaBegrunnelseTextField.buildInitialValues(omsorgAp),
  };
});

const transformValues = (values, submitCallback, aksjonspunkter) => {
  const aksjonspunkterArray = [];
  if (hasAksjonspunkt(MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, aksjonspunkter)) {
    aksjonspunkterArray.push(OmsorgFaktaForm.transformAleneomsorgValues(values));
  }
  if (hasAksjonspunkt(MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG, aksjonspunkter)) {
    aksjonspunkterArray.push(OmsorgFaktaForm.transformOmsorgValues(values));
  }
  const aksjonspunkterMedBegrunnelse = aksjonspunkterArray.map((ap) => ({
    ...ap,
    ...{ begrunnelse: values.begrunnelse },
  }));

  return submitCallback(aksjonspunkterMedBegrunnelse);
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => transformValues(values, initialOwnProps.submitCallback, initialOwnProps.aksjonspunkter);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    omsorg: behandlingFormValueSelector('OmsorgInfoPanel', ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'omsorg'),
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'OmsorgInfoPanel',
  validate: IkkeOmsorgPeriodeField.validate,
})(OmsorgInfoPanel));
