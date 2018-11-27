import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import {
  getPersonopplysning, getBehandlingYtelseFordeling, getEktefellePersonopplysning, getAksjonspunkter,
} from 'behandling/behandlingSelectors';
import personopplysningPropType from 'behandling/proptypes/personopplysningPropType';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import BostedFaktaView from 'fakta/components/omsorg/BostedFaktaView';
import OmsorgFaktaForm from 'fakta/components/omsorg/OmsorgFaktaForm';
import withDefaultToggling from 'fakta/withDefaultToggling';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import IkkeOmsorgPeriodeField from './IkkeOmsorgPeriodeField';


const { MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG } = aksjonspunktCodes;

const OMSORG_IP = 'omsorg';

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);
const getHelpTexts = (aksjonspunkter) => {
  const helpTexts = [];
  const harAleneomsorgAp = aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG);
  const harOmsorgAp = aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG);
  if (harAleneomsorgAp.length > 0) {
    helpTexts.push(<FormattedMessage key="VurderAleneomsorg" id="OmsorgInfoPanel.VurderAleneomsorg" />);
  }
  if (harOmsorgAp.length > 0) {
    helpTexts.push(<FormattedMessage key="VurderOmsorg" id="OmsorgInfoPanel.VurderOmsorg" />);
  }
  return helpTexts;
};

export const OmsorgInfoPanelImpl = ({
  intl,
  openInfoPanels,
  toggleInfoPanelCallback,
  personopplysning,
  ektefellePersonopplysning,
  readOnly,
  hasOpenAksjonspunkter,
  submittable,
  aksjonspunkter,
  omsorg,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'OmsorgInfoPanel.Omsorg' })}
    isInfoPanelOpen={openInfoPanels.includes(OMSORG_IP)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={OMSORG_IP}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    readOnly={readOnly}
  >
    {!readOnly
    && (
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {getHelpTexts(aksjonspunkter)}
    </AksjonspunktHelpText>
    )
    }
    <BostedFaktaView personopplysning={personopplysning} ektefellePersonopplysning={ektefellePersonopplysning} />
    <form onSubmit={formProps.handleSubmit}>
      <FaktaBegrunnelseTextField isDirty={formProps.dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse hasVurderingText />
      <OmsorgFaktaForm readOnly={readOnly} omsorg={omsorg} aksjonspunkter={aksjonspunkter} />
      <FaktaSubmitButton formName={formProps.form} isSubmittable={submittable} isReadOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
    </form>

  </FaktaEkspandertpanel>
);

OmsorgInfoPanelImpl.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  personopplysning: personopplysningPropType.isRequired,
  annenPartPersonopplysning: personopplysningPropType,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  omsorg: PropTypes.bool,
  intl: intlShape.isRequired,
  ...formPropTypes,
};

OmsorgInfoPanelImpl.defaultProps = {
  annenPartPersonopplysning: undefined,
  omsorg: undefined,
};

const buildInitialValues = createSelector([getBehandlingYtelseFordeling, getAksjonspunkter], (ytelsefordeling, aksjonspunkter) => {
  const omsorgAp = aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG
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
  const aksjonspunkterMedBegrunnelse = aksjonspunkterArray.map(ap => ({
    ...ap,
    ...{ begrunnelse: values.begrunnelse },
  }));

  return submitCallback(aksjonspunkterMedBegrunnelse);
};

const mapStateToProps = (state, initialProps) => ({
  initialValues: buildInitialValues(state),
  personopplysning: getPersonopplysning(state),
  ektefellePersonopplysning: getEktefellePersonopplysning(state),
  omsorg: behandlingFormValueSelector('OmsorgInfoPanel')(state, 'omsorg'),
  onSubmit: values => transformValues(values, initialProps.submitCallback, initialProps.aksjonspunkter),
});

const omsorgAksjonspunkter = [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG];

const OmsorgInfoPanel = withDefaultToggling(OMSORG_IP, omsorgAksjonspunkter)(connect(mapStateToProps)(behandlingForm({
  form: 'OmsorgInfoPanel',
  validate: IkkeOmsorgPeriodeField.validate,
})(injectIntl(OmsorgInfoPanelImpl))));

OmsorgInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => omsorgAksjonspunkter.includes(ap.definisjon.kode));

export default OmsorgInfoPanel;
