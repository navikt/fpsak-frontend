import { createSelector } from 'reselect';

import { getLanguageCodeFromSprakkode } from '@fpsak-frontend/utils';
import aksjonspunktCodes, {
  isInnhentSaksopplysningerAksjonspunkt,
  isVilkarForSykdomOppfylt,
  isBeregningAksjonspunkt,
} from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isForeldrepengerFagsak } from 'fagsak/fagsakSelectors';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import fpsakBehandlingApi from './data/fpsakBehandlingApi';
import isFieldEdited from './editedFields';
import { getSelectedBehandlingId } from './duck';

const hasFetchedOriginalBehandlingIfItExists = (behandling, originalBehandlingId) => (behandling && behandling.originalBehandlingId
  ? behandling.originalBehandlingId === originalBehandlingId : true);

export const isBehandlingInSync = createSelector(
  [getSelectedBehandlingId, fpsakBehandlingApi.BEHANDLING.getRestApiData(), fpsakBehandlingApi.ORIGINAL_BEHANDLING.getRestApiData()],
  (behandlingId, behandling = {}, originalBehandling = {}) => behandlingId !== undefined
  && behandlingId === behandling.id && hasFetchedOriginalBehandlingIfItExists(behandling, originalBehandling.id),
);

// NB! Kun intern bruk
const getSelectedBehandling = createSelector(
  [isBehandlingInSync, fpsakBehandlingApi.BEHANDLING.getRestApiData()],
  (isInSync, behandling = {}) => (isInSync ? behandling : undefined),
);

export const hasReadOnlyBehandling = createSelector(
  [fpsakBehandlingApi.BEHANDLING.getRestApiError(), getSelectedBehandling], (behandlingFetchError, selectedBehandling = {}) => (!!behandlingFetchError
    || (selectedBehandling.taskStatus && selectedBehandling.taskStatus.readOnly ? selectedBehandling.taskStatus.readOnly : false)),
);
export const getMellomlagringData = createSelector(
  [fpsakBehandlingApi.SAVE_KLAGE_VURDERING.getRestApiMeta()],
  data => (data ? data.params : {}),
);

export const getMellomlagringSpinner = createSelector(
  [fpsakBehandlingApi.SAVE_REOPEN_KLAGE_VURDERING.getRestApiStarted(), fpsakBehandlingApi.SAVE_KLAGE_VURDERING.getRestApiStarted()],
  (reOpenStarted, saveStarted) => (reOpenStarted || saveStarted),
);

export const getBehandlingVersjon = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.versjon);
export const getBehandlingStatus = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.status);
export const getBehandlingBehandlendeEnhetId = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetId);
export const getBehandlingBehandlendeEnhetNavn = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlendeEnhetNavn);
export const getBehandlingType = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.type);
export const getBehandlingIsRevurdering = createSelector([getBehandlingType], (bt = {}) => bt.kode === behandlingType.REVURDERING);
export const getBehandlingIsInnsyn = createSelector([getBehandlingType], (bt = {}) => bt.kode === behandlingType.DOKUMENTINNSYN);
export const getBehandlingIsKlage = createSelector([getBehandlingType], (bt = {}) => bt.kode === behandlingType.KLAGE);
export const getBehandlingArsaker = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingArsaker);
export const getBehandlingArsakTyper = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.behandlingArsaker
    ? selectedBehandling.behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType) : undefined),
);

export const erManueltOpprettet = createSelector([getBehandlingArsaker], (behandlingArsaker = []) => behandlingArsaker
  .some(ba => ba.manueltOpprettet === true));
export const erArsakTypeHendelseFodsel = createSelector([getBehandlingArsakTyper], (behandlingArsakTyper = []) => behandlingArsakTyper
  .some(bt => bt.kode === 'RE-HENDELSE-FØDSEL'));

export const getBehandlingIsManuellRevurdering = createSelector(
  [getBehandlingIsRevurdering, erManueltOpprettet, erArsakTypeHendelseFodsel],
  (isRevurdering, manueltOpprettet, arsakTypeHendelseFodsel) => isRevurdering && (manueltOpprettet || arsakTypeHendelseFodsel),
);
export const getBehandlingIsOnHold = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingPaaVent);
export const getBehandlingIsQueued = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingKoet);
export const getBehandlingOnHoldDate = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.fristBehandlingPaaVent);
export const getBehandlingsresultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingsresultat);
export const getBehandlingBeregningResultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.beregningResultat);
export const getSkjaeringstidspunktForeldrepenger = createSelector([getSelectedBehandling],
  (selectedBehandling = {}) => selectedBehandling.behandlingsresultat.skjaeringstidspunktForeldrepenger);
export const getBehandlingHenlagt = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.behandlingHenlagt);
export const getBehandlingUttaksperiodegrense = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['uttak-periode-grense'],
);
export const getBehandlingYtelseFordeling = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.ytelsefordeling);
export const getGjeldendeDekningsgrad = createSelector([getBehandlingYtelseFordeling], (ytelsesfordeling = {}) => ytelsesfordeling.gjeldendeDekningsgrad);
export const getBehandlingToTrinnsBehandling = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.toTrinnsBehandling);
export const getBehandlingResultatstruktur = createSelector(
  [isForeldrepengerFagsak, getSelectedBehandling], (isForeldrepenger, selectedBehandling = {}) => (isForeldrepenger
    ? selectedBehandling['beregningsresultat-foreldrepenger'] : selectedBehandling['beregningsresultat-engangsstonad']),
);
export const getOpphoersdatoFraUttak = createSelector(
  [getBehandlingResultatstruktur], (behandlingResultatStruktur = {}) => (behandlingResultatStruktur ? behandlingResultatStruktur.opphoersdato : undefined),
);
export const getUttaksresultatPerioder = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['uttaksresultat-perioder']));
export const getBehandlingVenteArsakKode = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.venteArsakKode);
export const getBehandlingAnsvarligSaksbehandler = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.ansvarligSaksbehandler,
);
export const getBehandlingVerge = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['soeker-verge'] ? selectedBehandling['soeker-verge'] : {}),
);
export const getStonadskontoer = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['uttak-stonadskontoer']);
export const getUttakPerioder = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['uttak-kontroller-fakta-perioder']
    ? selectedBehandling['uttak-kontroller-fakta-perioder'].perioder.sort((a, b) => a.fom.localeCompare(b.fom)) : undefined),
);
export const getFaktaArbeidsforhold = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['fakta-arbeidsforhold']
    ? selectedBehandling['fakta-arbeidsforhold'] : undefined),
);
export const getHenleggArsaker = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['henlegg-arsaker']));
export const getHaveSentVarsel = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['sendt-varsel-om-revurdering']));
export const getTotrinnskontrollArsaker = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['totrinnskontroll-arsaker']),
);
export const getTotrinnskontrollArsakerUtenUdefinert = createSelector(
  [getTotrinnskontrollArsaker], (aarsaker = {}) => (aarsaker.filter(aarsak => aarsak.skjermlenkeType !== '-')),
);
export const getTotrinnskontrollArsakerReadOnly = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['totrinnskontroll-arsaker-readOnly']),
);
export const getBrevMottakere = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['brev-mottakere']));
export const getBrevMaler = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['brev-maler']));

export const getSimuleringResultat = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.simuleringResultat));
export const getTilbakekrevingValg = createSelector([getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.tilbakekrevingvalg));

// AKSJONSPUNKTER
export const getAksjonspunkter = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.aksjonspunkter);
export const getOpenAksjonspunkter = createSelector(
  [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter(ap => isAksjonspunktOpen(ap.status.kode)),
);
export const getToTrinnsAksjonspunkter = createSelector([getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter(ap => ap.toTrinnsBehandling));
export const isBehandlingInInnhentSoknadsopplysningerSteg = createSelector(
  [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some(ap => isInnhentSaksopplysningerAksjonspunkt(ap.definisjon.kode)),
);
export const isKontrollerRevurderingAksjonspunkOpen = createSelector(
  [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
    .some(ap => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING),
);
export const hasBehandlingManualPaVent = createSelector(
  [getOpenAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
);
export const doesVilkarForSykdomOppfyltExist = createSelector(
  [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.filter(ap => isVilkarForSykdomOppfylt(ap)).length > 0,
);
export const isKlageBehandlingInFormkrav = createSelector(
  [getAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
    .some(ap => ap.definisjon.kode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP
      || ap.definisjon.kode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA),
);


export const isKlageBehandlingInKA = createSelector(
  [getAksjonspunkter], (openAksjonspunkter = []) => openAksjonspunkter
    .some(ap => ap.definisjon.kode === aksjonspunktCodes.FORMKRAV_KLAGE_NK
      || ap.definisjon.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NK),
);


// BEREGNINGSGRUNNLAG
export const getBeregningsgrunnlag = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.beregningsgrunnlag ? selectedBehandling.beregningsgrunnlag : undefined),
);
export const getGjeldendeBeregningAksjonspunkter = createSelector(
  [getAksjonspunkter], aksjonspunkter => aksjonspunkter.filter(ap => isBeregningAksjonspunkt(ap.definisjon.kode)),
);

export const getBeregningGraderingAksjonspunkt = createSelector(
  [getAksjonspunkter], aksjonspunkter => aksjonspunkter
    .find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG),
);

export const getAktivitetStatuser = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag
    && beregningsgrunnlag.aktivitetStatus ? beregningsgrunnlag.aktivitetStatus : undefined),
);
export const getAlleAndelerIForstePeriode = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag.beregningsgrunnlagPeriode
    && beregningsgrunnlag.beregningsgrunnlagPeriode.length > 0
    ? beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
    : []),
);

export const getBeregningsgrunnlagPerioder = createSelector([getBeregningsgrunnlag], (beregningsgrunnlag = {}) => beregningsgrunnlag.beregningsgrunnlagPeriode);
export const getBeregningsgrunnlagLedetekster = createSelector([getBeregningsgrunnlag], (beregningsgrunnlag = {}) => ({
  ledetekstBrutto: beregningsgrunnlag.ledetekstBrutto,
  ledetekstAvkortet: beregningsgrunnlag.ledetekstAvkortet,
  ledetekstRedusert: beregningsgrunnlag.ledetekstRedusert,
}));
export const getFaktaOmBeregning = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.faktaOmBeregning : undefined),
);

export const getBehandlingGjelderBesteberegning = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning && faktaOmBeregning.faktaOmBeregningTilfeller
    ? faktaOmBeregning.faktaOmBeregningTilfeller.some(tilfelle => tilfelle.kode === faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)
    : false),
);

export const getVurderMottarYtelse = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.vurderMottarYtelse : undefined),
);
export const getKunYtelse = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.kunYtelse : undefined),
);
export const getTilstøtendeYtelse = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.tilstøtendeYtelse : undefined),
);
export const getKortvarigeArbeidsforhold = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.kortvarigeArbeidsforhold : undefined),
);
export const getSkjæringstidspunktBeregning = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.skjaeringstidspunktBeregning : undefined),
);
export const getEndringBeregningsgrunnlag = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.endringBeregningsgrunnlag : undefined),
);
export const getEndringBeregningsgrunnlagPerioder = createSelector(
  [getEndringBeregningsgrunnlag], (endringBG = {}) => (endringBG ? endringBG.endringBeregningsgrunnlagPerioder : undefined),
);
export const getFaktaOmBeregningTilfeller = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = []) => (faktaOmBeregning ? faktaOmBeregning.faktaOmBeregningTilfeller : undefined),
);
export const getFaktaOmBeregningTilfellerKoder = createSelector(
  [getFaktaOmBeregningTilfeller], (tilfeller = []) => (tilfeller ? tilfeller.map(({ kode }) => kode) : undefined),
);
export const getAvklarAktiviteter = createSelector(
  [getFaktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.avklarAktiviteter : undefined),
);

export const getAndelerMedGraderingUtenBG = createSelector(
  [getBeregningsgrunnlag], (beregningsgrunnlag = {}) => (beregningsgrunnlag ? beregningsgrunnlag.andelerMedGraderingUtenBG : undefined),
);


// FAMILIEHENDELSE
export const getFamiliehendelse = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.familiehendelse);
export const getBehandlingVedtaksDatoSomSvangerskapsuke = createSelector(
  [getFamiliehendelse], (familiehendelse = {}) => familiehendelse.vedtaksDatoSomSvangerskapsuke,
);
export const getFamiliehendelseAntallBarnTermin = createSelector([getFamiliehendelse], (familiehendelse = {}) => familiehendelse.antallBarnTermin);
export const getFamiliehendelseTermindato = createSelector([getFamiliehendelse], (familiehendelse = {}) => familiehendelse.termindato);
export const getBehandlingSkjaringstidspunkt = createSelector([getFamiliehendelse], (familiehendelse = {}) => familiehendelse.skjaringstidspunkt);

// INNSYN
const getBehandlingInnsyn = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.innsyn ? selectedBehandling.innsyn : undefined),
);
export const getBehandlingInnsynResultatType = createSelector([getBehandlingInnsyn], (innsyn = {}) => innsyn.innsynResultatType);
export const getBehandlingInnsynMottattDato = createSelector([getBehandlingInnsyn], (innsyn = {}) => innsyn.innsynMottattDato);
export const getBehandlingInnsynDokumenter = createSelector([getBehandlingInnsyn], (innsyn = {}) => (innsyn.dokumenter ? innsyn.dokumenter : []));
export const getBehandlingInnsynVedtaksdokumentasjon = createSelector(
  [getBehandlingInnsyn], (innsyn = {}) => (innsyn.vedtaksdokumentasjon ? innsyn.vedtaksdokumentasjon : []),
);

// INNTEKT - ARBEID - YTELSE
const getBehandlingInntektArbeidYtelse = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['inntekt-arbeid-ytelse']);
export const getInntektsmeldinger = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.inntektsmeldinger,
);
export const getBehandlingRelatertTilgrensendeYtelserForSoker = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker,
);
export const getBehandlingRelatertTilgrensendeYtelserForAnnenForelder = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder,
);
export const getInnvilgetRelatertTilgrensendeYtelserForAnnenForelder = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => (inntektArbeidYtelse.innvilgetRelatertTilgrensendeYtelserForAnnenForelder
    ? inntektArbeidYtelse.innvilgetRelatertTilgrensendeYtelserForAnnenForelder : []),
);
export const getBehandlingArbeidsforhold = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.arbeidsforhold,
);

// KLAGEVURDERING
export const getBehandlingKlageVurdering = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling['klage-vurdering'] ? selectedBehandling['klage-vurdering'] : undefined),
);
export const getBehandlingKlageVurderingResultatNFP = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNFP,
);
export const getBehandlingKlageVurderingResultatNK = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageVurderingResultatNK,
);
export const getBehandlingKlageFormkravResultatNFP = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageFormkravResultatNFP,
);
export const getBehandlingKlageFormkravResultatKA = createSelector(
  [getBehandlingKlageVurdering], (klageVurdering = {}) => klageVurdering.klageFormkravResultatKA,
);

// MEDLEM
export const getBehandlingMedlemNew = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['soeker-medlemskap-v2']);
// TODO petter remove when feature toggle is removed
export const getBehandlingMedlem = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['soeker-medlemskap']);

export const isBehandlingRevurderingFortsattMedlemskap = createSelector(
  [getBehandlingType, getBehandlingMedlem], (type, medlem = {}) => type.kode === behandlingType.REVURDERING && !!medlem.fom,
);
export const getBehandlingRevurderingAvFortsattMedlemskapFom = createSelector(
  [getBehandlingMedlem], (medlem = {}) => medlem.fom,
);
export const getBehandlingMedlemEndredeOpplysninger = createSelector([getBehandlingMedlem], (medlem = {}) => (medlem.endringer ? medlem.endringer : []));

// OPPTJENING
const getBehandlingOpptjening = createSelector(
  [getSelectedBehandling], (selectedBehandling = {}) => (selectedBehandling.opptjening ? selectedBehandling.opptjening : undefined),
);
export const getBehandlingFastsattOpptjening = createSelector(
  [getBehandlingOpptjening], (opptjening = {}) => (opptjening ? opptjening.fastsattOpptjening : undefined),
);
export const getBehandlingFastsattOpptjeningFomDate = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningFom : undefined),
);
export const getBehandlingFastsattOpptjeningTomDate = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningTom : undefined),
);
export const getBehandlingFastsattOpptjeningperiodeMnder = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningperiode.måneder : undefined),
);
export const getBehandlingFastsattOpptjeningperiodeDager = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.opptjeningperiode.dager : undefined),
);
export const getBehandlingOpptjeningActivities = createSelector(
  [getBehandlingOpptjening], (opptjening = {}) => (opptjening.opptjeningAktivitetList ? opptjening.opptjeningAktivitetList : []),
);
export const getBehandlingFastsattOpptjeningActivities = createSelector(
  [getBehandlingFastsattOpptjening], (fastsattOpptjening = {}) => (fastsattOpptjening ? fastsattOpptjening.fastsattOpptjeningAktivitetList : undefined),
);

// PERSONOPPLYSNINGER
export const getPersonopplysning = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling['soeker-personopplysninger']);
export const getAnnenPartPersonopplysning = createSelector([getPersonopplysning], (personopplysning = {}) => personopplysning.annenPart);
export const getEktefellePersonopplysning = createSelector([getPersonopplysning], (personopplysning = {}) => personopplysning.ektefelle);
export const getBarnFraTpsRelatertTilSoknad = createSelector(
  [getPersonopplysning], (personopplysning = {}) => (personopplysning.barnFraTpsRelatertTilSoknad ? personopplysning.barnFraTpsRelatertTilSoknad : []),
);
const FNR_DODFODT_PART = '00001';
export const getAntallDodfodteBarn = createSelector(
  [getBarnFraTpsRelatertTilSoknad], (barnFraTpsRelatertTilSoknad = []) => barnFraTpsRelatertTilSoknad
    .reduce((nrOfDodfodteBarn, barn) => nrOfDodfodteBarn + (barn.fnr && barn.fnr.endsWith(FNR_DODFODT_PART) ? 1 : 0), 0),
);

// SPRÅK
export const getBehandlingSprak = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.sprakkode);
export const getBehandlingLanguageCode = createSelector([getBehandlingSprak], (sprakkode = {}) => getLanguageCodeFromSprakkode(sprakkode));

// SØKNAD
export const getSoknad = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.soknad);
export const getSoknadUtstedtdato = createSelector([getSoknad], soknad => soknad.utstedtdato);
export const getSoknadTermindato = createSelector([getSoknad], soknad => soknad.termindato);
export const getSoknadFodselsdatoer = createSelector([getSoknad], soknad => (soknad.fodselsdatoer ? soknad.fodselsdatoer : {}));
export const getSoknadAntallBarn = createSelector([getSoknad], soknad => (soknad.antallBarn));
export const getBehandlingHasSoknad = createSelector([getSoknad], soknad => !!soknad);
export const getBehandlingStartDatoForPermisjon = createSelector(
  [getSoknad], (soknad = {}) => (soknad.oppgittFordeling ? soknad.oppgittFordeling.startDatoForPermisjon : undefined),
);

// VILKÅR
export const getBehandlingVilkar = createSelector([getSelectedBehandling], (selectedBehandling = {}) => selectedBehandling.vilkar);
export const getBehandlingVilkarCodes = createSelector([getBehandlingVilkar], (vilkar = []) => vilkar.map(v => v.vilkarType.kode));

// ORIGINAL BEHANDLING
export const getOriginalBehandlingId = createSelector(
  [getSelectedBehandling], selectedBehandling => (selectedBehandling ? selectedBehandling.originalBehandlingId : undefined),
);


//-------------------------------------------------------------------------------------------------------------------------------------------------------------

const hasBehandlingLukketStatus = createSelector(
  [getBehandlingStatus], (status = {}) => status.kode === behandlingStatus.AVSLUTTET || status.kode === behandlingStatus.IVERKSETTER_VEDTAK
|| status.kode === behandlingStatus.FATTER_VEDTAK,
);

export const hasBehandlingUtredesStatus = createSelector(
  [getBehandlingStatus], (status = {}) => status.kode === behandlingStatus.BEHANDLING_UTREDES,
);

export const isBehandlingStatusReadOnly = createSelector(
  [getBehandlingIsOnHold, hasReadOnlyBehandling, hasBehandlingLukketStatus],
  (behandlingPaaVent, isBehandlingReadOnly, hasLukketStatus) => hasLukketStatus || behandlingPaaVent || isBehandlingReadOnly,
);

export const getEditedStatus = createSelector(
  [getSoknad, getFamiliehendelse, getPersonopplysning],
  (soknad, familiehendelse, personopplysning) => (
    isFieldEdited(soknad || {}, familiehendelse || {}, personopplysning || {})
  ),
);

export const getAllMerknaderFraBeslutter = createSelector([getBehandlingStatus, getAksjonspunkter], (status, aksjonspunkter = []) => {
  let merknader = {};
  if (status && status.kode === behandlingStatus.BEHANDLING_UTREDES) {
    merknader = aksjonspunkter
      .reduce((obj, ap) => ({ ...obj, [ap.definisjon.kode]: { notAccepted: ap.toTrinnsBehandling && ap.toTrinnsBehandlingGodkjent === false } }), {});
  }
  return merknader;
});

export const getMerknaderFraBeslutter = aksjonspunktCode => createSelector(getAllMerknaderFraBeslutter, allMerknaderFraBeslutter => (
  allMerknaderFraBeslutter[aksjonspunktCode] || {}
));
