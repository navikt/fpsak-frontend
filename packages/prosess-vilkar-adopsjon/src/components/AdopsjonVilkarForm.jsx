import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  behandlingForm, behandlingFormValueSelector, BehandlingspunktBegrunnelseTextField, VilkarResultPicker, ProsessPanelTemplate,
} from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

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
  originalErVilkarOk,
  hasAksjonspunkt,
  status,
  isApOpen,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <ProsessPanelTemplate
    titleCode="AdopsjonVilkarForm.Adopsjon"
    isAksjonspunktOpen={isApOpen}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    bpStatus={status}
    lovReferanse={lovReferanse}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    originalErVilkarOk={originalErVilkarOk}
  >
    <Element><FormattedMessage id="AdopsjonVilkarForm.TidligereUtbetaltStonad" /></Element>
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={hasAksjonspunkt}
      customVilkarOppfyltText={{ id: 'AdopsjonVilkarForm.Oppfylt' }}
      customVilkarIkkeOppfyltText={{ id: 'AdopsjonVilkarForm.IkkeOppfylt' }}
    />
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
  </ProsessPanelTemplate>
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
  isApOpen: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

AdopsjonVilkarFormImpl.defaultProps = {
  erVilkarOk: undefined,
  hasAksjonspunkt: false,
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

const transformValues = (values, aksjonspunkter) => ({
  ...VilkarResultPicker.transformValues(values),
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
  ...{ kode: aksjonspunkter[0].definisjon.kode },
});

const formName = 'AdopsjonVilkarForm';

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const { aksjonspunkter, status, alleKodeverk } = staticOwnProps;
  const avslagsarsaker = alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarType.ADOPSJONSVILKARET];
  const onSubmit = (values) => staticOwnProps.submitCallback([transformValues(values, aksjonspunkter)]);

  const isOpenAksjonspunkt = aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon, vilkar } = ownProps;
    return {
      originalErVilkarOk: erVilkarOk,
      initialValues: buildInitialValues(state, ownProps),
      erVilkarOk: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erVilkarOk'),
      lovReferanse: vilkar[0].lovReferanse,
      hasAksjonspunkt: aksjonspunkter.length > 0,
      avslagsarsaker,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
  validate,
})(AdopsjonVilkarFormImpl));
