import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getBehandlingVerge, getAksjonspunkter } from 'behandlingFpsak/behandlingSelectors';
import { behandlingForm } from 'behandlingFpsak/behandlingForm';
import aksjonspunktPropType from 'behandlingFelles/proptypes/aksjonspunktPropType';
import withDefaultToggling from 'behandlingFpsak/fakta/withDefaultToggling';
import FaktaBegrunnelseTextField from 'behandlingFelles/fakta/components/FaktaBegrunnelseTextField';
import FaktaSubmitButton from 'behandlingFpsak/fakta/components/FaktaSubmitButton';
import FaktaEkspandertpanel from 'behandlingFelles/fakta/components/FaktaEkspandertpanel';
import faktaPanelCodes from 'behandlingFpsak/fakta/faktaPanelCodes';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import RegistrereVergeFaktaForm from './RegistrereVergeFaktaForm';

/**
 * RegistrereVergeInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp formen for att registrere verge.
 */
export const RegistrereVergeInfoPanelImpl = ({
  intl,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  initialValues,
  vergetyper,
  aksjonspunkt,
  ...formProps
}) => {
  if (!aksjonspunkt) {
    return null;
  }
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'RegistrereVergeInfoPanel.Info' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.VERGE)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.VERGE}
      readOnly={readOnly}
    >
      <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {[intl.formatMessage({ id: 'RegistrereVergeInfoPanel.CheckInformation' })]}
      </AksjonspunktHelpText>
      <form onSubmit={formProps.handleSubmit}>
        <RegistrereVergeFaktaForm
          readOnly={readOnly}
          intl={intl}
          vergetyper={vergetyper}
        />
        <VerticalSpacer twentyPx />
        <FaktaBegrunnelseTextField isDirty={formProps.dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton
          formName={formProps.form}
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          doNotCheckForRequiredFields
        />
      </form>
    </FaktaEkspandertpanel>
  );
};

RegistrereVergeInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkt: aksjonspunktPropType.isRequired,
  vergetyper: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  initialValues: PropTypes.shape(),
};

RegistrereVergeInfoPanelImpl.defaultProps = {
  initialValues: {},
  submittable: true,
};

const buildInitialValues = createSelector([getBehandlingVerge, getAksjonspunkter], (verge, aksjonspunkter) => ({
  ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VERGE)[0]),
  ...RegistrereVergeFaktaForm.buildInitialValues(verge),
}));

const transformValues = values => ({
  ...RegistrereVergeFaktaForm.transformValues(values),
  ...{ begrunnelse: values.begrunnelse },
});

const mapStateToProps = (state, initialProps) => ({
  aksjonspunkt: initialProps.aksjonspunkter[0],
  initialValues: buildInitialValues(state),
  vergetyper: getKodeverk(kodeverkTyper.VERGE_TYPE)(state),
  onSubmit: values => initialProps.submitCallback([transformValues(values)]),
});

const vergeAksjonspunkter = [aksjonspunktCodes.AVKLAR_VERGE];

const RegistrereVergeInfoPanel = withDefaultToggling(faktaPanelCodes.VERGE, vergeAksjonspunkter)(connect(mapStateToProps)(behandlingForm({
  form: 'RegistrereVergeInfoPanel',
})(injectIntl(RegistrereVergeInfoPanelImpl))));

RegistrereVergeInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => ap.definisjon.kode === vergeAksjonspunkter[0]);

export default RegistrereVergeInfoPanel;