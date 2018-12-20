import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import connect from 'react-redux/es/connect/connect';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingFpsak/behandlingsprosess/behandlingsprosessSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getMellomlagringData,
  getMellomlagringSpinner,
  getOpenAksjonspunkter,
} from 'behandlingFpsak/behandlingSelectors';
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

export const TempsaveKlageButtonImpl = ({
  lastSavedVersionValues,
  formValues,
  saveKlage,
  spinner,
  aksjonspunktCode,
  hasForeslaVedtakAp,
  readOnly,
}) => {
  const lagringDisabled = isEqual(lastSavedVersionValues, transformValues(formValues));
  const tempSave = () => {
    saveKlage(transformValues(formValues, aksjonspunktCode), hasForeslaVedtakAp);
  };
  return (
    <div>
      {!readOnly && (
        <Hovedknapp
          mini
          htmlType="button"
          disabled={lagringDisabled}
          spinner={spinner}
          onClick={(e) => { tempSave(e); }}
        >
          <FormattedMessage id="Klage.ResolveKlage.TempSaveButton" />
        </Hovedknapp>
      )
      }
    </div>
  );
};

const getMellomLagringFormData = mellomlagringData => ({
  begrunnelse: mellomlagringData.begrunnelse || null,
  fritekstTilBrev: mellomlagringData.fritekstTilBrev || null,
  klageVurdering: mellomlagringData.klageVurdering || null,
  klageVurderingOmgjoer: mellomlagringData.klageVurderingOmgjoer || null,
  klageMedholdArsak: mellomlagringData.klageMedholdArsak || null,
});

const mapStateToProps = state => ({
  lastSavedVersionValues: getMellomLagringFormData(getMellomlagringData(state)),
  aksjonspunktCode: getSelectedBehandlingspunktAksjonspunkter(state)[0].definisjon.kode,
  spinner: getMellomlagringSpinner(state),
  hasForeslaVedtakAp: getOpenAksjonspunkter(state).filter(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK).length === 1,
});

TempsaveKlageButtonImpl.propTypes = {
  lastSavedVersionValues: PropTypes.shape().isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape().isRequired,
  saveKlage: PropTypes.func.isRequired,
  hasForeslaVedtakAp: PropTypes.bool,
  spinner: PropTypes.bool,
  readOnly: PropTypes.bool,
};

TempsaveKlageButtonImpl.defaultProps = {
  hasForeslaVedtakAp: false,
  spinner: false,
  readOnly: false,
};


export default connect(mapStateToProps)(TempsaveKlageButtonImpl);
