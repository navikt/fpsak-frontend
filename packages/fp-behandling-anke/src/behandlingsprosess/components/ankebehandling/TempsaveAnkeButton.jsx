import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import connect from 'react-redux/es/connect/connect';
import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

import behandlingSelectors from 'behandlingAnke/src/selectors/ankeBehandlingSelectors';
import behandlingspunktAnkeSelectors from '../../selectors/behandlingsprosessAnkeSelectors';

const isEqual = (lastSavedVersionValues, formValues) => {
  const formvaluesBegrunnelse = formValues.begrunnelse === '' ? null : formValues.begrunnelse;
  const formvaluesFritekst = formValues.fritekstTilBrev === '' ? null : formValues.fritekstTilBrev;
  return lastSavedVersionValues.klageVurdering === formValues.klageVurdering
    && lastSavedVersionValues.begrunnelse === formvaluesBegrunnelse
    && lastSavedVersionValues.fritekstTilBrev === formvaluesFritekst
    && lastSavedVersionValues.klageVurderingOmgjoer === formValues.klageVurderingOmgjoer
    && lastSavedVersionValues.klageMedholdArsak === formValues.klageMedholdArsak;
};

const transformValues = (values, aksjonspunktCode) => ({
  klageMedholdArsak: (values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE
    || values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK) ? values.klageMedholdArsak : null,
  klageVurderingOmgjoer: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

export const TempsaveAnkeButtonImpl = ({
  lastSavedVersionValues,
  formValues,
  saveAnke,
  spinner,
  aksjonspunktCode,
  hasForeslaVedtakAp,
  readOnly,
}) => {
  const lagringDisabled = isEqual(lastSavedVersionValues, transformValues(formValues));

  const tempSave = (event) => {
    event.preventDefault();
    saveAnke(transformValues(formValues, aksjonspunktCode), hasForeslaVedtakAp);
  };

  return (
    <div>
      {!readOnly && (
        <Hovedknapp
          mini
          htmlType="button"
          disabled={lagringDisabled}
          spinner={spinner}
          onClick={(event) => { tempSave(event); }}
        >
          <FormattedMessage id="Ankebehandling.TempSaveButton" />
        </Hovedknapp>
      )}
    </div>
  );
};

const getMellomLagringFormData = createSelector([behandlingSelectors.getMellomlagringData], (mellomlagringData) => ({
  begrunnelse: mellomlagringData.begrunnelse || null,
  fritekstTilBrev: mellomlagringData.fritekstTilBrev || null,
  klageVurdering: mellomlagringData.klageVurdering || null,
  klageVurderingOmgjoer: mellomlagringData.klageVurderingOmgjoer || null,
  klageMedholdArsak: mellomlagringData.klageMedholdArsak || null,
}));

const getForeslaVedtakAp = createSelector([behandlingSelectors.getOpenAksjonspunkter], (openAksjonspunkter) => openAksjonspunkter
  .filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK).length === 1);

const mapStateToProps = (state) => ({
  lastSavedVersionValues: getMellomLagringFormData(state),
  aksjonspunktCode: behandlingspunktAnkeSelectors.getSelectedBehandlingspunktAksjonspunkter(state)[0].definisjon.kode,
  spinner: behandlingSelectors.getMellomlagringSpinner(state),
  hasForeslaVedtakAp: getForeslaVedtakAp(state),
});

TempsaveAnkeButtonImpl.propTypes = {
  lastSavedVersionValues: PropTypes.shape().isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape().isRequired,
  saveAnke: PropTypes.func.isRequired,
  hasForeslaVedtakAp: PropTypes.bool,
  spinner: PropTypes.bool,
  readOnly: PropTypes.bool,
};

TempsaveAnkeButtonImpl.defaultProps = {
  hasForeslaVedtakAp: false,
  spinner: false,
  readOnly: false,
};


export default connect(mapStateToProps)(TempsaveAnkeButtonImpl);
