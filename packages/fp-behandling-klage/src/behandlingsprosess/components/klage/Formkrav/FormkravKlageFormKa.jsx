import React from 'react';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingKlage/src/behandlingsprosess/behandlingsprosessKlageSelectors';
import { behandlingForm } from 'behandlingKlage/src/behandlingForm';
import { getBehandlingKlageFormkravResultatKA } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
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

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(initialState)[0].definisjon.kode;
  const onSubmit = values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return state => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    onSubmit,
  });
};

const FormkravKlageFormKa = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(FormkravKlageFormKaImpl));

FormkravKlageFormKa.supports = apCodes => apCodes.includes(aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA);

export default FormkravKlageFormKa;
