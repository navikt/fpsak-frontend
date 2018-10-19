import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getBehandlingKlageVurderingResultatNFP } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import klageVurderingType from 'kodeverk/klageVurdering';
import BehandleKlageForm from './BehandleKlageForm';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NFP).
 */
export const BehandleKlageNfpFormImpl = ({
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  avvistReasons,
  medholdReasons,
  klageVurdering,
  begrunnelse,
  previewCallback,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <BehandleKlageForm
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      aksjonspunktCode={aksjonspunktCode}
      klageAvvistArsaker={avvistReasons}
      klageMedholdArsaker={medholdReasons}
      klageVurdering={klageVurdering}
      begrunnelse={begrunnelse}
      previewCallback={previewCallback}
      formProps={formProps}
    />
  </form>
);

BehandleKlageNfpFormImpl.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  klageVurdering: PropTypes.string,
  begrunnelse: PropTypes.string,
  avvistReasons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  medholdReasons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

BehandleKlageNfpFormImpl.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
  klageVurdering: null,
  begrunnelse: null,
};

export const buildInitialValues = createSelector([getBehandlingKlageVurderingResultatNFP], klageVurderingResultat => ({
  klageAvvistArsak: klageVurderingResultat ? klageVurderingResultat.klageAvvistArsak : null,
  klageMedholdArsak: klageVurderingResultat ? klageVurderingResultat.klageMedholdArsak : null,
  klageVurdering: klageVurderingResultat ? klageVurderingResultat.klageVurdering : null,
  begrunnelse: klageVurderingResultat ? klageVurderingResultat.begrunnelse : null,
  vedtaksdatoPaklagdBehandling: klageVurderingResultat ? klageVurderingResultat.vedtaksdatoPaklagdBehandling : null,
}));

export const transformValues = (values, aksjonspunktCode) => ({
  klageAvvistArsak: values.klageVurdering === klageVurderingType.AVVIS_KLAGE ? values.klageAvvistArsak : null,
  klageMedholdArsak: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageMedholdArsak : null,
  klageVurdering: values.klageVurdering,
  begrunnelse: values.begrunnelse,
  vedtaksdatoPaklagdBehandling: values.vedtaksdatoPaklagdBehandling,
  kode: aksjonspunktCode,
});

const formName = 'BehandleKlageNfpForm';

const mapStateToProps = (state, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(state)[0].definisjon.kode;
  return {
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    ...behandlingFormValueSelector(formName)(state, 'klageVurdering', 'begrunnelse'),
    onSubmit: values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]),
    avvistReasons: getKodeverk(kodeverkTyper.KLAGE_AVVIST_ARSAK)(state),
    medholdReasons: getKodeverk(kodeverkTyper.KLAGE_MEDHOLD_ARSAK)(state),
  };
};

const BehandleKlageNfpForm = connect(mapStateToProps)(behandlingForm({
  form: formName,
})(BehandleKlageNfpFormImpl));

BehandleKlageNfpForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NFP);

export default BehandleKlageNfpForm;
