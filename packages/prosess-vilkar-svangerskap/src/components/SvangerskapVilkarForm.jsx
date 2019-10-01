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
  isAksjonspunktOpen,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <ProsessPanelTemplate
    handleSubmit={formProps.handleSubmit}
    titleCode="SvangerskapVilkarForm.Svangerskap"
    isAksjonspunktOpen={isAksjonspunktOpen}
    aksjonspunktHelpTexts={['SvangerskapVilkarForm.FyllerVilkår']}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
  >
    <VilkarResultPicker avslagsarsaker={avslagsarsaker} erVilkarOk={erVilkarOk} readOnly={readOnly} hasAksjonspunkt={hasAksjonspunkt} />
    {erVilkarOk === false
      && <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />}
  </ProsessPanelTemplate>
);

SvangerskapVilkarFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  lovReferanse: PropTypes.string.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  hasAksjonspunkt: PropTypes.bool,
  status: PropTypes.string.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
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

const formName = 'SvangerskapVilkarForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { aksjonspunkter, alleKodeverk } = initialOwnProps;
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values, aksjonspunkter)]);
  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon, vilkar } = ownProps;
    return {
      initialValues: buildInitialValues(state, ownProps),
      erVilkarOk: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erVilkarOk'),
      lovReferanse: vilkar[0].lovReferanse,
      hasAksjonspunkt: aksjonspunkter.length > 0,
      avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarType.SVANGERSKAPVILKARET],
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
  validate,
})(SvangerskapVilkarFormImpl)));
