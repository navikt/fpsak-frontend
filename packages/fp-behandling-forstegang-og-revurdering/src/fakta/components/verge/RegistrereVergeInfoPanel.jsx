import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getBehandlingVerge } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import {
  FaktaBegrunnelseTextField, FaktaEkspandertpanel, withDefaultToggling, faktaPanelCodes,
} from '@fpsak-frontend/fp-felles';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
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
  intl: PropTypes.shape().isRequired,
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

const buildInitialValues = createSelector([getBehandlingVerge, behandlingSelectors.getAksjonspunkter], (verge, aksjonspunkter) => ({
  ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VERGE)[0]),
  ...RegistrereVergeFaktaForm.buildInitialValues(verge),
}));

const transformValues = (values) => ({
  ...RegistrereVergeFaktaForm.transformValues(values),
  ...{ begrunnelse: values.begrunnelse },
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values)]);
  return (state) => ({
    aksjonspunkt: ownProps.aksjonspunkter[0],
    initialValues: buildInitialValues(state),
    vergetyper: getKodeverk(kodeverkTyper.VERGE_TYPE)(state),
    onSubmit,
  });
};

const vergeAksjonspunkter = [aksjonspunktCodes.AVKLAR_VERGE];

const RegistrereVergeInfoPanel = withDefaultToggling(faktaPanelCodes.VERGE, vergeAksjonspunkter)(
  connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
    form: 'RegistrereVergeInfoPanel',
  })(injectIntl(RegistrereVergeInfoPanelImpl))),
);

RegistrereVergeInfoPanel.supports = (aksjonspunkter) => aksjonspunkter.some((ap) => ap.definisjon.kode === vergeAksjonspunkter[0]);

export default RegistrereVergeInfoPanel;
