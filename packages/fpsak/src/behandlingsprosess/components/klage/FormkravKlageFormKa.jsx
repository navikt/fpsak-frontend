import React from 'react';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { behandlingForm } from 'behandling/behandlingForm';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { getBehandlingKlageFormkravResultatKA } from 'behandling/behandlingSelectors';
import { createSelector } from 'reselect';
import FormkravKlageForm, { getPaKlagdVedtak, IKKE_PA_KLAGD_VEDTAK } from './FormkravKlageForm';

/**
 * FormkravKlageForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (KA).
 */
export const FormkravKlageFormKaImpl = ({
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FormkravKlageForm
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      aksjonspunktCode={aksjonspunktCode}
      formProps={formProps}
    />
  </form>
);

FormkravKlageFormKaImpl.propTypes = {
  aksjonspunktCode: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

FormkravKlageFormKaImpl.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
};

export const transformValues = (values, aksjonspunktCode) => ({
  erKlagerPart: values.erKlagerPart,
  erFristOverholdt: values.erFristOverholdt,
  erKonkret: values.erKonkret,
  erSignert: values.erSignert,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
  vedtak: values.vedtak === IKKE_PA_KLAGD_VEDTAK ? null : values.vedtak,
});

const formName = 'FormkravKlageFormKa';

const buildInitialValues = createSelector(
  [getBehandlingKlageFormkravResultatKA],
  (klageFormkavResultatKA) => {
    const klageFormkavResultatKa = klageFormkavResultatKA || null;
    return {
      vedtak: klageFormkavResultatKa ? getPaKlagdVedtak(klageFormkavResultatKa) : null,
      begrunnelse: klageFormkavResultatKa ? klageFormkavResultatKa.begrunnelse : null,
      erKlagerPart: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagerPart : null,
      erKonkret: klageFormkavResultatKa ? klageFormkavResultatKa.erKlageKonkret : null,
      erFristOverholdt: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagefirstOverholdt : null,
      erSignert: klageFormkavResultatKa ? klageFormkavResultatKa.erSignert : null,
    };
  },
);

const mapStateToProps = (state, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(state)[0].definisjon.kode;
  return {
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    onSubmit: values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]),
  };
};

const FormkravKlageFormKa = connect(mapStateToProps)(behandlingForm({
  form: formName,
})(FormkravKlageFormKaImpl));

FormkravKlageFormKa.supports = apCodes => apCodes.includes(aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA);

export default FormkravKlageFormKa;
