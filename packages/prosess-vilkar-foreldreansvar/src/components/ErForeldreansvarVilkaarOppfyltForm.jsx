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
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

import foreldreansvarVilkarAksjonspunkterPropType from '../propTypes/foreldreansvarVilkarAksjonspunkterPropType';

/**
 * ErForeldreansvarVilkaarOppfyltForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunkter for avklaring av foreldreansvarvilkåret 2 eller 4 ledd.
 */
export const ErForeldreansvarVilkaarOppfyltForm = ({
  avslagsarsaker,
  readOnly,
  readOnlySubmitButton,
  erVilkarOk,
  originalErVilkarOk,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  isEngangsstonad,
  ...formProps
}) => (
  <ProsessPanelTemplate
    titleCode="ErForeldreansvarVilkaarOppfyltForm.Foreldreansvar"
    isAksjonspunktOpen={!readOnlySubmitButton}
    formProps={formProps}
    readOnlySubmitButton={readOnlySubmitButton}
    readOnly={readOnly}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    originalErVilkarOk={originalErVilkarOk}
  >
    <Element><FormattedMessage id="ErForeldreansvarVilkaarOppfyltForm.RettTilStonad" /></Element>
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={aksjonspunkter.length > 0}
      customVilkarOppfyltText={{ id: isEngangsstonad ? 'FodselVilkarForm.OppfyltEs' : 'FodselVilkarForm.OppfyltFp' }}
      customVilkarIkkeOppfyltText={{ id: isEngangsstonad ? 'FodselVilkarForm.IkkeOppfyltEs' : 'FodselVilkarForm.IkkeOppfyltFp' }}
    />
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
  </ProsessPanelTemplate>
);

ErForeldreansvarVilkaarOppfyltForm.propTypes = {
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isEngangsstonad: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool,
  originalErVilkarOk: PropTypes.bool,
  aksjonspunkter: PropTypes.arrayOf(foreldreansvarVilkarAksjonspunkterPropType),
  ...formPropTypes,
};

ErForeldreansvarVilkaarOppfyltForm.defaultProps = {
  erVilkarOk: undefined,
  originalErVilkarOk: undefined,
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
    aksjonspunkter, submitCallback, isForeldreansvar2Ledd, alleKodeverk, status,
  } = initialOwnProps;
  const onSubmit = (values) => submitCallback(transformValues(values, aksjonspunkter));
  const vilkarTypeKode = isForeldreansvar2Ledd ? vilkarType.FORELDREANSVARSVILKARET_2_LEDD : vilkarType.FORELDREANSVARSVILKARET_4_LEDD;
  const avslagsarsaker = alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarTypeKode];

  const isOpenAksjonspunkt = aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      initialValues: buildInitialValues(state, ownProps),
      erVilkarOk: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'erVilkarOk'),
      originalErVilkarOk: erVilkarOk,
      avslagsarsaker,
      aksjonspunkter,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
  validate,
})(ErForeldreansvarVilkaarOppfyltForm));
