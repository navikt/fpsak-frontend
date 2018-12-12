import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingFpsak/behandlingsprosess/behandlingsprosessSelectors';
import { getBehandlingKlageVurderingResultatNFP } from 'behandlingFpsak/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingFpsak/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import BehandleKlageFormNy from './BehandleKlageFormNy';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NFP).
 */
export const BehandleKlageNfpFormImplNy = ({
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  medholdReasons,
  avvistReasons,
  klageVurderingOmgjoer,
  klageVurdering,
  medhold,
  begrunnelse,
  fritekstTilBrev,
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

BehandleKlageNfpFormImplNy.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
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

BehandleKlageNfpFormImplNy.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
  klageVurdering: null,
  klageVurderingOmgjoer: null,
  begrunnelse: null,
  fritekstTilBrev: null,
};

export const buildInitialValues = createSelector([getBehandlingKlageVurderingResultatNFP], klageVurderingResultat => ({
  klageMedholdArsak: klageVurderingResultat ? klageVurderingResultat.klageMedholdArsak : null,
  klageAvvistArsaker: klageVurderingResultat ? klageVurderingResultat.klageAvvistArsak : null,
  klageVurderingOmgjoer: klageVurderingResultat ? klageVurderingResultat.klageVurderingOmgjoer : null,
  klageVurdering: klageVurderingResultat ? klageVurderingResultat.klageVurdering : null,
  begrunnelse: klageVurderingResultat ? klageVurderingResultat.begrunnelse : null,
  fritekstTilBrev: klageVurderingResultat ? klageVurderingResultat.fritekstTilBrev : null,
}));

export const nfpIsReadOnly = createSelector([getBehandlingKlageVurderingResultatNFP, getSelectedBehandlingspunktAksjonspunkter],
  (klageVurderingResultat, ap) => {
    if (klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurderingType.STADFESTE_YTELSESVEDTAK
      && ap[0].status.kode === 'UTFO') {
      return true;
    }
    return false;
  });

export const transformValues = (values, aksjonspunktCode) => ({
  klageMedholdArsak: (values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE
    || values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK) ? values.klageMedholdArsak : null,
  klageAvvistArsaker: values.klageVurdering === klageVurderingType.AVVIS_KLAGE ? values.klageAvvistArsaker : null,
  klageVurderingOmgjoer: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const formName = 'BehandleKlageNfpForm';

const mapStateToProps = (state, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(state)[0].definisjon.kode;
  const readOnly = nfpIsReadOnly(state);
  return {
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    ...behandlingFormValueSelector(formName)(state, 'klageVurdering', 'begrunnelse', 'fritekstTilBrev'),
    onSubmit: values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]),
    medholdReasons: getKodeverk(kodeverkTyper.KLAGE_MEDHOLD_ARSAK)(state),
    avvistReasons: getKodeverk(kodeverkTyper.KLAGE_AVVIST_ARSAK)(state),
    readOnly: readOnly || ownProps.readOnly,
  };
};

const BehandleKlageNfpFormNy = connect(mapStateToProps)(behandlingForm({
  form: formName,
})(BehandleKlageNfpFormImplNy));

BehandleKlageNfpFormNy.supports = apCodes => apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NFP);

export default BehandleKlageNfpFormNy;
