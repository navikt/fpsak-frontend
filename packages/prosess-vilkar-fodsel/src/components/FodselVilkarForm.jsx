import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  behandlingForm, behandlingFormValueSelector, BehandlingspunktBegrunnelseTextField, VilkarResultPicker, ProsessPanelTemplate,
} from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

const avslagsarsakerES = ['1002', '1003', '1032'];

/**
 * FodselVilkarForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av Fødselsvilkåret.
 */
export const FodselVilkarFormImpl = ({
  isApOpen,
  avslagsarsaker,
  lovReferanse,
  readOnly,
  readOnlySubmitButton,
  erVilkarOk,
  originalErVilkarOk,
  hasAksjonspunkt,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <ProsessPanelTemplate
    titleCode="FodselVilkarForm.Fodsel"
    isAksjonspunktOpen={isApOpen}
    formProps={formProps}
    isDirty={formProps.dirty}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    lovReferanse={lovReferanse}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    originalErVilkarOk={originalErVilkarOk}
  >
    <Element><FormattedMessage id="FodselVilkarForm.TidligereUtbetaltStonad" /></Element>
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={hasAksjonspunkt}
      customVilkarOppfyltText={{ id: 'FodselVilkarForm.Oppfylt' }}
      customVilkarIkkeOppfyltText={{ id: 'FodselVilkarForm.IkkeOppfylt' }}
    />
    <BehandlingspunktBegrunnelseTextField useAllWidth readOnly={readOnly} />
  </ProsessPanelTemplate>
);

FodselVilkarFormImpl.propTypes = {
  lovReferanse: PropTypes.string.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  originalErVilkarOk: PropTypes.bool,
  hasAksjonspunkt: PropTypes.bool,
  isApOpen: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

FodselVilkarFormImpl.defaultProps = {
  erVilkarOk: undefined,
  originalErVilkarOk: undefined,
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

const formName = 'FodselVilkarForm';

export const getFodselVilkarAvslagsarsaker = (isFpFagsak, fodselsvilkarAvslagskoder) => (isFpFagsak
  ? fodselsvilkarAvslagskoder.filter((arsak) => !avslagsarsakerES.includes(arsak.kode))
  : fodselsvilkarAvslagskoder);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const {
    aksjonspunkter, status, alleKodeverk, submitCallback, ytelseTypeKode,
  } = initialOwnProps;
  const onSubmit = (values) => submitCallback([transformValues(values, aksjonspunkter)]);
  const avslagsarsaker = alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarType.FODSELSVILKARET_MOR];
  const filtrerteAvslagsarsaker = getFodselVilkarAvslagsarsaker(ytelseTypeKode === fagsakYtelseType.FORELDREPENGER, avslagsarsaker);

  const isOpenAksjonspunkt = aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon, vilkar } = ownProps;
    return {
      onSubmit,
      avslagsarsaker: filtrerteAvslagsarsaker,
      originalErVilkarOk: erVilkarOk,
      initialValues: buildInitialValues(state, ownProps),
      erVilkarOk: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erVilkarOk'),
      lovReferanse: vilkar[0].lovReferanse,
      hasAksjonspunkt: aksjonspunkter.length > 0,
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
  validate,
})(FodselVilkarFormImpl));
