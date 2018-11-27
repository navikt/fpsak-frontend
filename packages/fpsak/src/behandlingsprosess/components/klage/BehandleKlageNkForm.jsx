import React from 'react';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getBehandlingKlageVurderingResultatNFP, getBehandlingKlageVurderingResultatNK } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getKodeverk } from 'kodeverk/duck';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import klageVurderingType from 'kodeverk/klageVurdering';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import BehandleKlageForm from './BehandleKlageForm';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NK).
 */
export const BehandleKlageNkFormImpl = ({
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  klageVurdering,
  avvistReasons,
  medholdReasons,
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
BehandleKlageNkFormImpl.propTypes = {
  aksjonspunktCode: PropTypes.string.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  klageVurdering: PropTypes.string,
  begrunnelse: PropTypes.string,
  avvistReasons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  medholdReasons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

BehandleKlageNkFormImpl.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
  klageVurdering: null,
  begrunnelse: null,
};

export const buildInitialValues = createSelector(
  [getBehandlingKlageVurderingResultatNFP, getBehandlingKlageVurderingResultatNK],
  (klageVurderingResultatNFP, klageVurderingResultatNK) => {
    const klageVurderingResultatNfp = klageVurderingResultatNFP || {};
    return {
      klageAvvistArsak: klageVurderingResultatNK ? klageVurderingResultatNK.klageAvvistArsak : null,
      klageMedholdArsak: klageVurderingResultatNK ? klageVurderingResultatNK.klageMedholdArsak : null,
      klageVurdering: klageVurderingResultatNK ? klageVurderingResultatNK.klageVurdering : null,
      begrunnelse: klageVurderingResultatNK ? klageVurderingResultatNK.begrunnelse : null,
      vedtaksdatoPaklagdBehandling: klageVurderingResultatNK
        ? klageVurderingResultatNK.vedtaksdatoPaklagdBehandling
        : klageVurderingResultatNfp.vedtaksdatoPaklagdBehandling,
    };
  },
);

export const transformValues = (values, aksjonspunktCode) => ({
  klageAvvistArsak: values.klageVurdering === klageVurderingType.AVVIS_KLAGE ? values.klageAvvistArsak : null,
  klageMedholdArsak: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageMedholdArsak : null,
  klageVurdering: values.klageVurdering,
  begrunnelse: values.begrunnelse,
  vedtaksdatoPaklagdBehandling: values.vedtaksdatoPaklagdBehandling,
  kode: aksjonspunktCode,
});

const formName = 'BehandleKlageNkForm';

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

const BehandleKlageNkForm = (connect(mapStateToProps)(behandlingForm({
  form: formName,
})(BehandleKlageNkFormImpl)));

BehandleKlageNkForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NK);

export default BehandleKlageNkForm;
