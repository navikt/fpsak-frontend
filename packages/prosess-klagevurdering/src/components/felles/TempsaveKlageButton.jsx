import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

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

export const TempsaveKlageButton = ({
  lastSavedVersionValues,
  formValues,
  saveKlage,
  spinner,
  aksjonspunktCode,
  readOnly,
}) => {
  const lagringDisabled = isEqual(lastSavedVersionValues, transformValues(formValues));

  const tempSave = (event) => {
    event.preventDefault();
    saveKlage(transformValues(formValues, aksjonspunktCode));
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
          <FormattedMessage id="Klage.ResolveKlage.TempSaveButton" />
        </Hovedknapp>
      )}
    </div>
  );
};

TempsaveKlageButton.propTypes = {
  lastSavedVersionValues: PropTypes.shape().isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape().isRequired,
  saveKlage: PropTypes.func.isRequired,
  spinner: PropTypes.bool,
  readOnly: PropTypes.bool,
};

TempsaveKlageButton.defaultProps = {
  spinner: false,
  readOnly: false,
};

const getMellomLagringFormData = createSelector([
  (ownProps) => ownProps.TempsaveKlageButton/*behandlingSelectors.getMellomlagringData*/], (mellomlagringData) => ({
  begrunnelse: mellomlagringData.begrunnelse || null,
  fritekstTilBrev: mellomlagringData.fritekstTilBrev || null,
  klageVurdering: mellomlagringData.klageVurdering || null,
  klageVurderingOmgjoer: mellomlagringData.klageVurderingOmgjoer || null,
  klageMedholdArsak: mellomlagringData.klageMedholdArsak || null,
}));

const mapStateToProps = (state, ownProps) => ({
  lastSavedVersionValues: getMellomLagringFormData(ownProps),
  spinner: false, //behandlingSelectors.getMellomlagringSpinner(state),
});

export default connect(mapStateToProps)(TempsaveKlageButton);
