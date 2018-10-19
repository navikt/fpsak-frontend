import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { isBehandlingStatusReadOnly, getBehandlingStatus, getBehandlingsresultat } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { isInnvilget, isAvslag } from 'kodeverk/behandlingResultatType';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import behandlingStatusCode from 'kodeverk/behandlingStatus';
import VedtakKlageSubmitPanel from './VedtakKlageSubmitPanel';
import VedtakAvslagKlagePanel from './VedtakAvslagKlagePanel';
import VedtakKlagePanel from './VedtakKlagePanel';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakInnvilgetKlagePanel from './VedtakInnvilgetKlagePanel';

export const VEDTAK_KLAGE_FORM_NAME = 'VEDTAK_KLAGE_FORM';

/**
 * VedtakKlageForm
 *
 * Redux-form-komponent for klage-vedtak.
 */
export const VedtakKlageFormImpl = ({
  intl,
  readOnly,
  behandlingStatusKode,
  behandlingsresultat,
  previewVedtakCallback,
  aksjonspunktKoder,
  begrunnelse,
  isBehandlingReadOnly,
  ...formProps
}) => (
  <VedtakAksjonspunktPanel
    behandlingStatusKode={behandlingStatusKode}
    aksjonspunktKoder={aksjonspunktKoder}
    readOnly={readOnly}
    isBehandlingReadOnly={isBehandlingReadOnly}
  >
    <ElementWrapper>
      {isInnvilget(behandlingsresultat.type.kode)
      && (
      <VedtakInnvilgetKlagePanel
        behandlingsresultatTypeKode={behandlingsresultat.type.kode}
      />
      )
      }
      {isAvslag(behandlingsresultat.type.kode)
        && (
        <VedtakAvslagKlagePanel
          behandlingStatus={behandlingStatusKode}
          readOnly={readOnly}
          behandlingsresultatTypeKode={behandlingsresultat.type.kode}
          behandlingsresultat={behandlingsresultat}
        />
        )
      }
      {!isAvslag(behandlingsresultat.type.kode)
        && (
        <VedtakKlagePanel
          behandlingStatus={behandlingStatusKode}
          readOnly={readOnly}
        />
        )
      }
      {behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES
        && (
        <VedtakKlageSubmitPanel
          begrunnelse={begrunnelse}
          previewVedtakCallback={previewVedtakCallback}
          formProps={formProps}
          readOnly={readOnly}
        />
        )
      }
    </ElementWrapper>
  </VedtakAksjonspunktPanel>
);

VedtakKlageFormImpl.propTypes = {
  begrunnelse: PropTypes.string,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
  ...formPropTypes,
};

VedtakKlageFormImpl.defaultProps = {
  begrunnelse: undefined,
};

const transformValues = values => values.aksjonspunktKoder.map(apCode => ({
  kode: apCode,
  begrunnelse: values.begrunnelse,
}));


export const buildInitialValues = createSelector(
  [getSelectedBehandlingspunktAksjonspunkter],
  (aksjonspunkter) => {
    const behandlingAksjonspunktCodes = aksjonspunkter.map(ap => ap.definisjon.kode);
    return {
      aksjonspunktKoder: behandlingAksjonspunktCodes,
    };
  },
);

const mapStateToProps = (state, initialProps) => ({
  initialValues: buildInitialValues(state),
  isBehandlingReadOnly: isBehandlingStatusReadOnly(state),
  onSubmit: values => initialProps.submitCallback(transformValues(values)),
  ...behandlingFormValueSelector(VEDTAK_KLAGE_FORM_NAME)(
    state,
    'begrunnelse',
    'aksjonspunktKoder',
  ),
  behandlingStatusKode: getBehandlingStatus(state).kode,
  behandlingsresultat: getBehandlingsresultat(state),
  aksjonspunktKoder: getSelectedBehandlingspunktAksjonspunkter(state).map(ap => ap.definisjon.kode),
});

const VedtakKlageForm = connect(mapStateToProps)(behandlingForm({
  form: VEDTAK_KLAGE_FORM_NAME,
})(VedtakKlageFormImpl));

export default VedtakKlageForm;
