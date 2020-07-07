import React, { FunctionComponent, useMemo } from 'react';
import { connect } from 'react-redux';
import { change, InjectedFormProps } from 'redux-form';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import moment from 'moment';

import {
  DDMMYYYY_DATE_FORMAT, decodeHtmlEntity, getKodeverknavnFn,
} from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import {
  KodeverkMedNavn, Behandling, BeregningsresultatFp, BeregningsresultatEs, Vilkar,
  Aksjonspunkt, SimuleringResultat, Kodeverk,
} from '@fpsak-frontend/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';

import vedtakResultType from '../../kodeverk/vedtakResultType';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagArsakOgBegrunnelsePanel from './VedtakAvslagArsakOgBegrunnelsePanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakFellesPanel from '../felles/VedtakFellesPanel';
import { getTilbakekrevingText } from '../felles/VedtakHelper';
import VedtakFritekstbrevModal from '../felles/svp/VedtakFritekstbrevModal';

const getPreviewManueltBrevCallback = (formProps, begrunnelse, brodtekst, overskrift, skalOverstyre, previewCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    const data = {
      fritekst: skalOverstyre ? brodtekst : begrunnelse,
      dokumentMal: skalOverstyre ? 'FRITKS' : undefined,
      tittel: skalOverstyre ? overskrift : undefined,
      gjelderVedtak: true,
      vedtaksbrev: !skalOverstyre ? {
        kode: 'AUTOMATISK',
      } : undefined,
    };

    previewCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const erArsakTypeBehandlingEtterKlage = (behandlingArsakTyper = []) => behandlingArsakTyper
  .map(({ behandlingArsakType }) => behandlingArsakType)
  .some((bt) => bt.kode === BehandlingArsakType.ETTER_KLAGE
    || bt.kode === BehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === BehandlingArsakType.KLAGE_M_INNTK);

const createAarsakString = (revurderingAarsaker, getKodeverknavn) => {
  if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
    return undefined;
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

const isNewBehandlingResult = (beregningResultat, originaltBeregningResultat) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

export const lagKonsekvensForYtelsenTekst = (konsekvenser, getKodeverknavn) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  }
  return konsekvenser.map((k) => getKodeverknavn(k)).join(' og ');
};

const isNewAmount = (beregningResultat, originaltBeregningResultat, erInnvilget) => {
  if (beregningResultat === null) {
    return false;
  }
  return erInnvilget
    ? beregningResultat.beregnetTilkjentYtelse !== originaltBeregningResultat.beregnetTilkjentYtelse
    : beregningResultat.antallBarn !== originaltBeregningResultat.antallBarn;
};

const resultText = (beregningResultat, originaltBeregningResultat, erInnvilget) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  if (erInnvilget) {
    return isNewAmount(beregningResultat, originaltBeregningResultat, erInnvilget)
      ? 'VedtakForm.Resultat.EndretTilkjentYtelse'
      : 'VedtakForm.Resultat.IngenEndring';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat, erInnvilget)
    ? 'VedtakForm.Resultat.EndretAntallBarn'
    : 'VedtakForm.Resultat.IngenEndring';
};

const finnInvilgetRevurderingTekst = (intl, ytelseTypeKode, konsekvenserForYtelsen,
  getKodeverknavn, tilbakekrevingText, beregningResultat, originaltBeregningResultat) => {
  if (ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD) {
    return intl.formatMessage({ id: resultText(beregningResultat, originaltBeregningResultat, true) });
  }
  const konsekvens = lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn);
  return `${konsekvens}${konsekvens !== '' ? tilbakekrevingText : '. '}`;
};

const getOpphorsdato = (resultatstruktur, medlemskapFom, behandlingsresultat) => {
  if (resultatstruktur && resultatstruktur.opphoersdato) {
    return resultatstruktur.opphoersdato;
  }
  if (medlemskapFom) {
    return medlemskapFom;
  }
  return behandlingsresultat.skjæringstidspunkt
    ? behandlingsresultat.skjæringstidspunkt.dato : '';
};

const finnVedtakstatusTekst = (behandlingsresultat, intl, ytelseTypeKode, konsekvenserForYtelsen,
  getKodeverknavn, tilbakekrevingtekst, resultatstruktur, resultatstrukturOriginalBehandling, medlemskapFom) => {
  if (isInnvilget(behandlingsresultat.type.kode)) {
    return finnInvilgetRevurderingTekst(intl, ytelseTypeKode, konsekvenserForYtelsen,
      getKodeverknavn, tilbakekrevingtekst, resultatstruktur, resultatstrukturOriginalBehandling);
  }
  if (isAvslag(behandlingsresultat.type.kode)) {
    return intl.formatMessage({ id: resultText(resultatstruktur, resultatstrukturOriginalBehandling, false) });
  }
  if (isOpphor(behandlingsresultat.type.kode)) {
    return intl.formatMessage({
      id: ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER
        ? 'VedtakForm.RevurderingSVP.SvangerskapspengerOpphoerer' : 'VedtakForm.RevurderingFP.ForeldrepengerOpphoerer',
    }, { dato: moment(getOpphorsdato(resultatstruktur, medlemskapFom, behandlingsresultat)).format(DDMMYYYY_DATE_FORMAT) });
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
  ytelseTypeKode: string;
  resultatstruktur?: BeregningsresultatFp | BeregningsresultatEs;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  tilbakekrevingvalg?: {
    videreBehandling: Kodeverk;
  };
  simuleringResultat?: SimuleringResultat;
  vilkar?: Vilkar[];
  beregningErManueltFastsatt: boolean;
  medlemskapFom?: string;
  resultatstrukturOriginalBehandling?: {
    'beregningsresultat-engangsstonad'?: any;
    'beregningsresultat-foreldrepenger'?: any;
  };
  clearFormField: (fieldId: string) => void;
}

export const VedtakRevurderingForm: FunctionComponent<OwnProps & InjectedFormProps & WrappedComponentProps> = ({
  intl,
  behandling,
  readOnly,
  aksjonspunkter,
  previewCallback,
  begrunnelse,
  brødtekst,
  overskrift,
  ytelseTypeKode,
  resultatstruktur,
  alleKodeverk,
  tilbakekrevingvalg,
  simuleringResultat,
  vilkar,
  beregningErManueltFastsatt,
  medlemskapFom,
  resultatstrukturOriginalBehandling,
  clearFormField,
  ...formProps
}) => {
  const {
    behandlingsresultat, sprakkode, status, behandlingArsaker,
  } = behandling;

  const erBehandlingEtterKlage = useMemo(() => erArsakTypeBehandlingEtterKlage(behandling.behandlingArsaker), [behandling.behandlingArsaker]);
  const revurderingsAarsakString = useMemo(() => createAarsakString(behandlingArsaker
    .map((arsak) => arsak.behandlingArsakType), getKodeverknavnFn(alleKodeverk, kodeverkTyper)), [behandlingArsaker]);
  const tilbakekrevingtekst = useMemo(() => getTilbakekrevingText(simuleringResultat, tilbakekrevingvalg, alleKodeverk), [
    simuleringResultat, tilbakekrevingvalg]);
  const konsekvenserForYtelsen = behandlingsresultat !== undefined ? behandlingsresultat.konsekvenserForYtelsen : undefined;

  // TODO (TOR) Kan ein forenkle dette? Frykteleg mykje kode for utleding av ein enkel tekst
  const vedtakstatusTekst = useMemo(() => finnVedtakstatusTekst(behandlingsresultat, intl, ytelseTypeKode, konsekvenserForYtelsen,
    getKodeverknavnFn(alleKodeverk, kodeverkTyper), tilbakekrevingtekst, resultatstruktur, resultatstrukturOriginalBehandling, medlemskapFom), [
    behandlingsresultat, konsekvenserForYtelsen, tilbakekrevingtekst, resultatstruktur, medlemskapFom]);

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
        previewAutomatiskBrev={previewDefaultBrev}
        previewOverstyrtBrev={previewOverstyrtBrev}
        tilbakekrevingtekst={tilbakekrevingtekst}
        erBehandlingEtterKlage={erBehandlingEtterKlage}
        handleSubmit={formProps.handleSubmit}
        submitting={formProps.submitting}
        clearFormField={clearFormField}
        renderPanel={(skalBrukeOverstyrendeFritekstBrev, erInnvilget, erAvslatt, erOpphor) => {
          if (erInnvilget) {
            return (
              <VedtakInnvilgetRevurderingPanel
                ytelseTypeKode={ytelseTypeKode}
                revurderingsAarsakString={revurderingsAarsakString}
                readOnly={readOnly}
                resultatstruktur={resultatstruktur}
                sprakKode={sprakkode}
                behandlingsresultat={behandlingsresultat}
                beregningErManueltFastsatt={beregningErManueltFastsatt}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
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
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
              />
            );
          }

          return erOpphor ? (
            <VedtakOpphorRevurderingPanel
              revurderingsAarsakString={revurderingsAarsakString}
              readOnly={readOnly}
              behandlingsresultat={behandlingsresultat}
              sprakKode={sprakkode}
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    clearFormField: (fieldId) => change(`${getBehandlingFormPrefix(
      ownProps.behandlingId, ownProps.behandlingVersjon,
    )}.${VEDTAK_REVURDERING_FORM_NAME}`, fieldId, null),
  }, dispatch),
});

export default connect(mapStateToPropsFactory, mapDispatchToProps)(behandlingForm({
  form: VEDTAK_REVURDERING_FORM_NAME,
})(injectIntl(VedtakRevurderingForm)));
