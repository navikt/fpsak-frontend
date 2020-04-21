import React, { FunctionComponent, useMemo } from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';

import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  KodeverkMedNavn, Behandling, BeregningsresultatFp, BeregningsresultatEs, Vilkar,
  Aksjonspunkt, SimuleringResultat, Kodeverk,
} from '@fpsak-frontend/types';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { decodeHtmlEntity, getKodeverknavnFn } from '@fpsak-frontend/utils';

import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagArsakOgBegrunnelsePanel from './VedtakAvslagArsakOgBegrunnelsePanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakFellesPanel from '../VedtakFellesPanel';
import { getTilbakekrevingText } from '../VedtakHelper';
import VedtakFritekstbrevModal from '../svp/VedtakFritekstbrevModal';

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

const createAarsakString = (revurderingAarsaker, getKodeverknavn) => {
  if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
    return '';
  }
  const aarsakTekstList = [];
  const endringFraBrukerAarsak = revurderingAarsaker
    .find((aarsak) => aarsak.kode === BehandlingArsakType.RE_ENDRING_FRA_BRUKER);
  const alleAndreAarsakerNavn = revurderingAarsaker
    .filter((aarsak) => aarsak.kode !== BehandlingArsakType.RE_ENDRING_FRA_BRUKER)
    .map((aarsak) => getKodeverknavn(aarsak));
  // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
  if (endringFraBrukerAarsak !== undefined) {
    aarsakTekstList.push(getKodeverknavn(endringFraBrukerAarsak));
  }
  aarsakTekstList.push(...alleAndreAarsakerNavn);
  return aarsakTekstList.join(', ');
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
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  tilbakekrevingvalg?: {
    videreBehandling: Kodeverk;
  };
  simuleringResultat?: SimuleringResultat;
  vilkar?: Vilkar[];
  beregningErManueltFastsatt: boolean;
  medlemskapFom?: string;
  resultatstrukturOriginalBehandling?: {
    'beregningsresultat-engangsstonad'?: {};
    'beregningsresultat-foreldrepenger'?: {};
  };
}

export const VedtakRevurderingForm: FunctionComponent<OwnProps & InjectedFormProps> = ({
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
  medlemskapFom,
  resultatstrukturOriginalBehandling,
  ...formProps
}) => {
  const {
    behandlingsresultat, behandlingPaaVent, sprakkode, status, type, behandlingArsaker,
  } = behandling;

  const erBehandlingEtterKlage = useMemo(() => erArsakTypeBehandlingEtterKlage(behandling.behandlingArsaker), [behandling.behandlingArsaker]);
  const aksjonspunktKoder = useMemo(() => aksjonspunkter.map((a) => a.definisjon.kode), [aksjonspunkter]);
  const revurderingsAarsakString = useMemo(() => createAarsakString(behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType), getKodeverknavnFn(alleKodeverk, kodeverkTyper)), [behandlingArsaker]);

  const previewOverstyrtBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brødtekst, overskrift, true, previewCallback);
  const previewDefaultBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brødtekst, overskrift, false, previewCallback);

  const tilbakekrevingtekst = getTilbakekrevingText(simuleringResultat, tilbakekrevingvalg, alleKodeverk);

  return (
    <>
      {ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER && (
        <VedtakFritekstbrevModal
          readOnly={readOnly}
          behandlingsresultat={behandlingsresultat}
        />
      )}
      <VedtakFellesPanel
        alleKodeverk={alleKodeverk}
        behandlingsresultat={behandlingsresultat}
        ytelseTypeKode={ytelseTypeKode}
        behandlingStatusKode={status.kode}
        aksjonspunkter={aksjonspunkter}
        behandlingType={type}
        readOnly={readOnly}
        kanOverstyre={kanOverstyre}
        sprakkode={sprakkode}
        previewAutomatiskBrev={previewDefaultBrev}
        previewOverstyrtBrev={previewOverstyrtBrev}
        tilbakekrevingtekst={tilbakekrevingtekst}
        erBehandlingEtterKlage={erBehandlingEtterKlage}
        resultatstruktur={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        handleSubmit={formProps.handleSubmit}
        submitting={formProps.submitting}
        medlemskapFom={medlemskapFom}
        resetForm={formProps.reset}
        behandlingPaaVent={behandlingPaaVent}
        renderPanel={(_skalBrukeOverstyrendeFritekstBrev, erInnvilget, erAvslatt) => {
          if (erInnvilget) {
            return (
              <VedtakInnvilgetRevurderingPanel
                antallBarn={ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD ? resultatstruktur.antallBarn : null}
                ytelseTypeKode={ytelseTypeKode}
                revurderingsAarsakString={revurderingsAarsakString}
                readOnly={readOnly}
                resultatstruktur={resultatstruktur}
                sprakKode={sprakkode}
                behandlingsresultat={behandlingsresultat}
                beregningErManueltFastsatt={beregningErManueltFastsatt}
              />
            );
          }

          if (erAvslatt) {
            return (
              <VedtakAvslagArsakOgBegrunnelsePanel
                behandlingStatusKode={status.kode}
                vilkar={vilkar}
                behandlingsresultat={behandlingsresultat}
                sprakkode={sprakkode}
                readOnly={readOnly}
                alleKodeverk={alleKodeverk}
              />
            );
          }

          return isOpphor(behandlingsresultat.type.kode) ? (
            <VedtakOpphorRevurderingPanel
              revurderingsAarsakString={revurderingsAarsakString}
              readOnly={readOnly}
              behandlingsresultat={behandlingsresultat}
              sprakKode={sprakkode}
              beregningErManueltFastsatt={beregningErManueltFastsatt}
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
    aksjonspunktKoder: aksjonspunkter.filter((ap) => ap.kanLoses && ap.kanLoses).map((ap) => ap.definisjon.kode),
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

export const VEDTAK_REVURDERING_FORM_NAME = 'VEDTAK_REVURDERING_FORM';

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    ...behandlingFormValueSelector(VEDTAK_REVURDERING_FORM_NAME, ownProps.behandling.id, ownProps.behandling.versjon)(
      state,
      'aksjonspunktKoder',
      'begrunnelse',
      'overskrift',
      'brødtekst',
    ),
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: VEDTAK_REVURDERING_FORM_NAME,
})(VedtakRevurderingForm));
