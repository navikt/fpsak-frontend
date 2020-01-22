import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import { Element } from 'nav-frontend-typografi';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  behandlingForm, behandlingFormValueSelector, BehandlingspunktBegrunnelseTextField, VilkarResultPicker, ProsessPanelTemplate,
} from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

/**
 * SvangerskapsvilkårForm
 *
 * Presentasjonskomponent.
 */
export const SvangerskapVilkarFormImpl = ({
  avslagsarsaker,
  readOnly,
  readOnlySubmitButton,
  erVilkarOk,
  hasAksjonspunkt,
  isApOpen,
  behandlingId,
  behandlingVersjon,
  originalErVilkarOk,
  ...formProps
}) => (
  <ProsessPanelTemplate
    titleCode="SvangerskapVilkarForm.Svangerskap"
    isAksjonspunktOpen={isApOpen}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    originalErVilkarOk={originalErVilkarOk}
  >
    <Element><FormattedMessage id="SvangerskapVilkarForm.RettTilSvp" /></Element>
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={hasAksjonspunkt}
      customVilkarOppfyltText={{ id: 'SvangerskapVilkarForm.Oppfylt' }}
      customVilkarIkkeOppfyltText={{ id: 'SvangerskapVilkarForm.IkkeOppfylt' }}
    />
    {erVilkarOk === false
      && <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />}
  </ProsessPanelTemplate>
);

SvangerskapVilkarFormImpl.propTypes = {
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

SvangerskapVilkarFormImpl.defaultProps = {
  erVilkarOk: undefined,
  hasAksjonspunkt: false,
};

const validate = ({ erVilkarOk, avslagCode }) => VilkarResultPicker.validate(erVilkarOk, avslagCode);

export const buildInitialValues = createSelector(
  [(ownProps) => ownProps.behandlingsresultat,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.status],
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

const formName = 'SvangerskapVilkarForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { aksjonspunkter, alleKodeverk } = initialOwnProps;
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values, aksjonspunkter)]);

  return (state, ownProps) => {
    const {
      behandlingId, behandlingVersjon, vilkar, status,
    } = ownProps;
    const isOpenAksjonspunkt = aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode));
    const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;
    return {
      originalErVilkarOk: erVilkarOk,
      initialValues: buildInitialValues(ownProps),
      erVilkarOk: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erVilkarOk'),
      lovReferanse: vilkar[0].lovReferanse,
      hasAksjonspunkt: aksjonspunkter.length > 0,
      avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarType.SVANGERSKAPVILKARET],
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
  validate,
})(SvangerskapVilkarFormImpl));
