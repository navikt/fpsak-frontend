import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm } from '@fpsak-frontend/fp-felles';

import FormkravKlageForm, { getPaKlagdVedtak, IKKE_PA_KLAGD_VEDTAK } from './FormkravKlageForm';

/**
 * FormkravklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (NFP).
 */
export const FormkravKlageFormNfpImpl = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  alleKodeverk,
  avsluttedeBehandlinger,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FormkravKlageForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
      formProps={formProps}
      alleKodeverk={alleKodeverk}
      avsluttedeBehandlinger={avsluttedeBehandlinger}
    />
  </form>
);

FormkravKlageFormNfpImpl.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

FormkravKlageFormNfpImpl.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
};

const transformValues = (values) => ({
  erKlagerPart: values.erKlagerPart,
  erFristOverholdt: values.erFristOverholdt,
  erKonkret: values.erKonkret,
  erSignert: values.erSignert,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
  vedtak: values.vedtak === IKKE_PA_KLAGD_VEDTAK ? null : values.vedtak,
});

const formName = 'FormkravKlageFormNfp';

const buildInitialValues = createSelector([(ownProps) => ownProps.klageVurdering],
  (klageVurdering) => {
    const klageFormkavResultatNfp = klageVurdering ? klageVurdering.klageFormkravResultatNFP : null;
    return {
      vedtak: klageFormkavResultatNfp ? getPaKlagdVedtak(klageFormkavResultatNfp) : null,
      begrunnelse: klageFormkavResultatNfp ? klageFormkavResultatNfp.begrunnelse : null,
      erKlagerPart: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagerPart : null,
      erKonkret: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlageKonkret : null,
      erFristOverholdt: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagefirstOverholdt : null,
      erSignert: klageFormkavResultatNfp ? klageFormkavResultatNfp.erSignert : null,
    };
  });

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    readOnly: ownProps.readOnly,
    onSubmit,
  });
};

const FormkravKlageFormNfp = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(FormkravKlageFormNfpImpl));

export default FormkravKlageFormNfp;
