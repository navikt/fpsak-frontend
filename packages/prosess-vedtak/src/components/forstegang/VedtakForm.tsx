import React, { FunctionComponent, useMemo } from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import {
  KodeverkMedNavn, Behandling, BeregningsresultatFp, BeregningsresultatEs, Vilkar,
  Aksjonspunkt, SimuleringResultat, Kodeverk,
} from '@fpsak-frontend/types';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { isAvslag, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';

import { findInnvilgetResultatText, findAvslagResultatText, getTilbakekrevingText } from '../felles/VedtakHelper';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakFellesPanel from '../felles/VedtakFellesPanel';
import VedtakFritekstbrevModal from '../felles/svp/VedtakFritekstbrevModal';

const getPreviewManueltBrevCallback = (formProps, begrunnelse, brodtekst, overskrift, skalOverstyre, previewCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    const data = {
      fritekst: skalOverstyre ? brodtekst : begrunnelse,
      dokumentMal: skalOverstyre ? 'FRITKS' : undefined,
      tittel: overskrift,
      gjelderVedtak: true,
    };

    previewCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const erArsakTypeBehandlingEtterKlage = (behandlingArsakTyper = []) => behandlingArsakTyper
  .map(({ behandlingArsakType }) => behandlingArsakType)
  .some((bt) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE
    || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK);


const finnVedtakstatusTekst = (behandlingsresultat, intl, ytelseTypeKode) => {
  const erInnvilget = isInnvilget(behandlingsresultat.type.kode);
  const erAvslatt = isAvslag(behandlingsresultat.type.kode);

  if (erInnvilget) {
    return intl.formatMessage({ id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode) });
  }
  if (erAvslatt) {
    return intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type.kode, ytelseTypeKode) });
  }
  return '';
};

interface OwnProps {
  behandling: Behandling;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  previewCallback: () => void;
  begrunnelse?: string;
  brødtekst?: string;
  overskrift?: string;
  kanOverstyre?: boolean;
  ytelseTypeKode: string;
  resultatstruktur?: BeregningsresultatFp | BeregningsresultatEs;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  tilbakekrevingvalg?: {
    videreBehandling: Kodeverk;
  };
  simuleringResultat?: SimuleringResultat;
  vilkar?: Vilkar[];
  beregningErManueltFastsatt: boolean;
}

export const VedtakForm: FunctionComponent<OwnProps & InjectedFormProps & WrappedComponentProps> = ({
  intl,
  behandling,
  readOnly,
  aksjonspunkter,
  previewCallback,
  begrunnelse,
  brødtekst,
  overskrift,
  kanOverstyre,
  ytelseTypeKode,
  resultatstruktur,
  alleKodeverk,
  tilbakekrevingvalg,
  simuleringResultat,
  vilkar,
  beregningErManueltFastsatt,
  ...formProps
}) => {
  const {
    behandlingsresultat, sprakkode, status,
  } = behandling;

  const erBehandlingEtterKlage = useMemo(() => erArsakTypeBehandlingEtterKlage(behandling.behandlingArsaker), [behandling.behandlingArsaker]);
  const tilbakekrevingtekst = useMemo(() => getTilbakekrevingText(simuleringResultat, tilbakekrevingvalg, alleKodeverk), [
    simuleringResultat, tilbakekrevingvalg]);
  const vedtakstatusTekst = useMemo(() => finnVedtakstatusTekst(behandlingsresultat, intl, ytelseTypeKode), [behandlingsresultat]);

  const previewOverstyrtBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brødtekst, overskrift, true, previewCallback);
  const previewDefaultBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brødtekst, overskrift, false, previewCallback);

  return (
    <>
      {ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER && (
        <VedtakFritekstbrevModal
          readOnly={readOnly}
          behandlingsresultat={behandlingsresultat}
        />
      )}
      <VedtakFellesPanel
        behandling={behandling}
        vedtakstatusTekst={vedtakstatusTekst}
        aksjonspunkter={aksjonspunkter}
        readOnly={readOnly}
        kanOverstyre={kanOverstyre}
        previewAutomatiskBrev={previewDefaultBrev}
        previewOverstyrtBrev={previewOverstyrtBrev}
        tilbakekrevingtekst={tilbakekrevingtekst}
        erBehandlingEtterKlage={erBehandlingEtterKlage}
        handleSubmit={formProps.handleSubmit}
        submitting={formProps.submitting}
        resetForm={formProps.reset}
        renderPanel={(skalBrukeOverstyrendeFritekstBrev, erInnvilget, erAvslatt) => {
          if (erInnvilget) {
            return (
              <VedtakInnvilgetPanel
                behandlingsresultat={behandlingsresultat}
                readOnly={readOnly}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                ytelseTypeKode={ytelseTypeKode}
                sprakkode={sprakkode}
                resultatstruktur={resultatstruktur}
                beregningErManueltFastsatt={beregningErManueltFastsatt}
              />
            );
          }

          return erAvslatt ? (
            <VedtakAvslagPanel
              behandlingStatusKode={status.kode}
              behandlingsresultat={behandlingsresultat}
              readOnly={readOnly}
              ytelseTypeKode={ytelseTypeKode}
              sprakkode={sprakkode}
              alleKodeverk={alleKodeverk}
              vilkar={vilkar}
              beregningErManueltFastsatt={beregningErManueltFastsatt}
              skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
            />
          ) : null;
        }}
      />
    </>
  );
};

export const buildInitialValues = createSelector(
  [(ownProps: { aksjonspunkter: Aksjonspunkt[] }) => ownProps.aksjonspunkter,
    (ownProps: { behandling: Behandling }) => ownProps.behandling],
  (aksjonspunkter, behandling) => ({
    aksjonspunktKoder: aksjonspunkter.filter((ap) => ap.kanLoses).map((ap) => ap.definisjon.kode),
    overskrift: decodeHtmlEntity(behandling.behandlingsresultat.overskrift),
    brødtekst: decodeHtmlEntity(behandling.behandlingsresultat.fritekstbrev),
  }),
);

const transformValues = (values) => values.aksjonspunktKoder.map((apCode) => ({
  kode: apCode,
  begrunnelse: values.begrunnelse,
  fritekstBrev: values.brødtekst,
  skalBrukeOverstyrendeFritekstBrev: !!values.brødtekst,
  overskrift: values.overskrift,
  isVedtakSubmission: true,
}));

const formName = 'VedtakForm';

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    ...behandlingFormValueSelector(formName, ownProps.behandling.id, ownProps.behandling.versjon)(
      state,
      'aksjonspunktKoder',
      'begrunnelse',
      'overskrift',
      'brødtekst',
    ),
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(injectIntl(VedtakForm)));
