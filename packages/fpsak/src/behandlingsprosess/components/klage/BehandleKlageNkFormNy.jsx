import React from 'react';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getBehandlingKlageVurderingResultatNK } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getKodeverk } from 'kodeverk/duck';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import klageVurderingType from 'kodeverk/klageVurdering';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import BehandleKlageFormNy from './BehandleKlageFormNy';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NK).
 */
export const BehandleKlageNkFormImplNy = ({
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  klageVurdering,
  medholdReasons,
  avvistReasons,
  klageVurderingOmgjoer,
  begrunnelse,
  fritekstTilBrev,
  omgjoer,
  previewCallback,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <BehandleKlageFormNy
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      aksjonspunktCode={aksjonspunktCode}
      klageMedholdArsaker={medholdReasons}
      klageAvvistArsaker={avvistReasons}
      klageVurderingOmgjoer={klageVurderingOmgjoer}
      klageVurdering={klageVurdering}
      begrunnelse={begrunnelse}
      fritekstTilBrev={fritekstTilBrev}
      previewCallback={previewCallback}
      formProps={formProps}
    />
  </form>
);
BehandleKlageNkFormImplNy.propTypes = {
  aksjonspunktCode: PropTypes.string.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  klageVurdering: PropTypes.string,
  klageVurderingOmgjoer: PropTypes.string,
  begrunnelse: PropTypes.string,
  fritekstTilBrev: PropTypes.string,
  medholdReasons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  avvistReasons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

BehandleKlageNkFormImplNy.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
  klageVurdering: null,
  klageVurderingOmgjoer: null,
  begrunnelse: null,
  fritekstTilBrev: null,
};

export const buildInitialValues = createSelector([getBehandlingKlageVurderingResultatNK],
  klageVurderingResultatNK => ({
    klageMedholdArsak: klageVurderingResultatNK ? klageVurderingResultatNK.klageMedholdArsak : null,
    klageAvvistArsaker: klageVurderingResultatNK ? klageVurderingResultatNK.klageAvvistArsaker : null,
    klageVurderingOmgjoer: klageVurderingResultatNK ? klageVurderingResultatNK.klageVurderingOmgjoer : null,
    klageVurdering: klageVurderingResultatNK ? klageVurderingResultatNK.klageVurdering : null,
    begrunnelse: klageVurderingResultatNK ? klageVurderingResultatNK.begrunnelse : null,
    fritekstTilBrev: klageVurderingResultatNK ? klageVurderingResultatNK.fritekstTilBrev : null,
  }));

export const transformValues = (values, aksjonspunktCode) => ({
  klageMedholdArsak: (values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE
    || values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK) ? values.klageMedholdArsak : null,
  klageAvvistArsaker: values.klageVurdering === klageVurderingType.AVVIS_KLAGE ? values.klageAvvistArsaker : null,
  klageVurderingOmgjoer: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  begrunnelse: values.begrunnelse,
  fritekstTilBrev: values.fritekstTilBrev,
  kode: aksjonspunktCode,
});

const formName = 'BehandleKlageNkForm';

const mapStateToProps = (state, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(state)[0].definisjon.kode;
  return {
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    ...behandlingFormValueSelector(formName)(state, 'klageVurdering', 'begrunnelse', 'fritekstTilBrev'),
    onSubmit: values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]),
    medholdReasons: getKodeverk(kodeverkTyper.KLAGE_MEDHOLD_ARSAK)(state),
    avvistReasons: getKodeverk(kodeverkTyper.KLAGE_AVVIST_ARSAK)(state),
  };
};

const BehandleKlageNkFormNy = (connect(mapStateToProps)(behandlingForm({
  form: formName,
})(BehandleKlageNkFormImplNy)));

BehandleKlageNkFormNy.supports = apCodes => apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NK);

export default BehandleKlageNkFormNy;
