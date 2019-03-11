import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { FadingPanel, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingKlage/src/behandlingsprosess/behandlingsprosessKlageSelectors';
import {
  isBehandlingStatusReadOnly, getBehandlingStatus, getBehandlingsresultat, getBehandlingKlageVurdering,
} from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingKlage/src/behandlingForm';
import VedtakKlageSubmitPanel from './VedtakKlageSubmitPanel';

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
  omgjortAarsak,
  previewVedtakCallback,
  isAvvist,
  isOmgjort,
  fritekstTilBrev,
  isOpphevOgHjemsend,
  aksjonspunktKoder,
  avvistArsaker,
  isBehandlingReadOnly,
  behandlingsResultatTekst,
  klageVurdering,
  ...formProps
}) => (
  <FadingPanel>
    <Undertittel>{intl.formatMessage({ id: 'VedtakKlageForm.Header' })}</Undertittel>
    <VerticalSpacer twentyPx />
    <ElementWrapper>
      <div>
        <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.Resultat' })}</Undertekst>
      </div>
      <Normaltekst>
        {intl.formatMessage({ id: behandlingsResultatTekst })}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
      { isAvvist
      && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilAvvisning' })}</Undertekst>
          { avvistArsaker.map(arsak => <Normaltekst key={arsak.navn}>{arsak.navn}</Normaltekst>) }
          <VerticalSpacer sixteenPx />
        </div>
      )
      }
      { isOmgjort
      && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilOmgjoring' })}</Undertekst>
          { omgjortAarsak }
          <VerticalSpacer sixteenPx />
        </div>
      ) }
      { isOpphevOgHjemsend
      && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilOppheving' })}</Undertekst>
          { omgjortAarsak }
          <VerticalSpacer sixteenPx />
        </div>
      ) }
      <VedtakKlageSubmitPanel
        begrunnelse={fritekstTilBrev}
        klageResultat={klageVurdering}
        previewVedtakCallback={previewVedtakCallback}
        formProps={formProps}
        readOnly={readOnly}
      />
    </ElementWrapper>
  </FadingPanel>
);

VedtakKlageFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAvvist: PropTypes.bool.isRequired,
  isOmgjort: PropTypes.bool.isRequired,
  isOpphevOgHjemsend: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsResultatTekst: PropTypes.string.isRequired,
  klageVurdering: PropTypes.shape().isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
  avvistArsaker: PropTypes.arrayOf(PropTypes.object),
  omgjortAarsak: PropTypes.string,
  fritekstTilBrev: PropTypes.string,
  behandlingsresultat: PropTypes.shape().isRequired,
  ...formPropTypes,
};

VedtakKlageFormImpl.defaultProps = {
  omgjortAarsak: undefined,
  avvistArsaker: undefined,
  fritekstTilBrev: undefined,
};

const transformValues = values => values.aksjonspunktKoder.map(apCode => ({
  kode: apCode,
  begrunnelse: values.fritekstTilBrev,
}));

export const getAvvisningsAarsaker = createSelector(
  [getBehandlingKlageVurdering],
  (klageVurderingResultat) => {
    if (klageVurderingResultat) {
      if (klageVurderingResultat.klageFormkravResultatKA && klageVurderingResultat.klageVurderingResultatNK) {
        return klageVurderingResultat.klageFormkravResultatKA.avvistArsaker;
      }
      if (klageVurderingResultat.klageFormkravResultatNFP) {
        return klageVurderingResultat.klageFormkravResultatNFP.avvistArsaker;
      }
    }
    return null;
  },
);

const omgjoerTekstMap = {
  GUNST_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortGunst',
  UGUNST_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortUgunst',
  DELVIS_MEDHOLD_I_KLAGE: 'VedtakKlageForm.KlageOmgjortDelvis',
};

const getKlageResultat = createSelector(
  [getBehandlingKlageVurdering],
  behandlingKlageVurdering => (behandlingKlageVurdering.klageVurderingResultatNK
    ? behandlingKlageVurdering.klageVurderingResultatNK : behandlingKlageVurdering.klageVurderingResultatNFP),
);

const getResultatText = createSelector(
  [getBehandlingKlageVurdering],
  (behandlingKlageVurdering) => {
    const klageResultat = behandlingKlageVurdering.klageVurderingResultatNK
      ? behandlingKlageVurdering.klageVurderingResultatNK : behandlingKlageVurdering.klageVurderingResultatNFP;
    switch (klageResultat.klageVurdering) {
      case klageVurderingCodes.AVVIS_KLAGE:
        return 'VedtakKlageForm.KlageAvvist';
      case klageVurderingCodes.STADFESTE_YTELSESVEDTAK:
        return 'VedtakKlageForm.KlageStadfestet';
      case klageVurderingCodes.OPPHEVE_YTELSESVEDTAK:
        return 'VedtakKlageForm.YtelsesvedtakOpphevet';
      case klageVurderingCodes.HJEMSENDE_UTEN_Å_OPPHEVE:
        return 'VedtakKlageForm.HjemmsendUtenOpphev';
      case klageVurderingCodes.MEDHOLD_I_KLAGE:
        return omgjoerTekstMap[klageResultat.klageVurderingOmgjoer];
      default:
        return null;
    }
  },
);

const getOmgjortAarsak = createSelector(
  [getBehandlingKlageVurdering],
  (klageVurderingResultat) => {
    if (klageVurderingResultat) {
      if (klageVurderingResultat.klageVurderingResultatNK) {
        return klageVurderingResultat.klageVurderingResultatNK.klageMedholdArsakNavn;
      }
      if (klageVurderingResultat.klageVurderingResultatNFP) {
        return klageVurderingResultat.klageVurderingResultatNFP.klageMedholdArsakNavn;
      }
    }
    return null;
  },
);

const getIsOmgjort = createSelector(
  [getBehandlingsresultat],
  behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.KLAGE_MEDHOLD,
);

export const getIsAvvist = createSelector(
  [getBehandlingsresultat],
  behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.KLAGE_AVVIST,
);

export const getIsOpphevOgHjemsend = createSelector(
  [getBehandlingsresultat],
  behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET,
);

export const getFritekstTilBrev = createSelector(
  [getBehandlingKlageVurdering],
  (behandlingKlageVurdering) => {
    const klageResultat = behandlingKlageVurdering.klageVurderingResultatNK
      ? behandlingKlageVurdering.klageVurderingResultatNK : behandlingKlageVurdering.klageVurderingResultatNFP;
    return klageResultat.fritekstTilBrev;
  },
);

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
  isAvvist: getIsAvvist(state),
  avvistArsaker: getAvvisningsAarsaker(state),
  isOpphevOgHjemsend: getIsOpphevOgHjemsend(state),
  isOmgjort: getIsOmgjort(state),
  omgjortAarsak: getOmgjortAarsak(state),
  behandlingStatusKode: getBehandlingStatus(state).kode,
  fritekstTilBrev: getFritekstTilBrev(state),
  behandlingsResultatTekst: getResultatText(state),
  klageVurdering: getKlageResultat(state),
  behandlingsresultat: getBehandlingsresultat(state),
  aksjonspunktKoder: getSelectedBehandlingspunktAksjonspunkter(state).map(ap => ap.definisjon.kode),
  onSubmit: values => initialProps.submitCallback(transformValues(values)),
  ...behandlingFormValueSelector(VEDTAK_KLAGE_FORM_NAME)(
    state,
    'begrunnelse',
    'aksjonspunktKoder',
  ),
});
const VedtakKlageForm = connect(mapStateToProps)(behandlingForm({
  form: VEDTAK_KLAGE_FORM_NAME,
})(injectIntl(VedtakKlageFormImpl)));

export default VedtakKlageForm;
