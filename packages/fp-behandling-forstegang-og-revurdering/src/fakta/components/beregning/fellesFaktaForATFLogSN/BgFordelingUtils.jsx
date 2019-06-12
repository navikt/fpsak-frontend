import moment from 'moment';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { lonnsendringField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
  import { erNyoppstartetFLField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/visningsnavnHelper';
import {
  getFaktaOmBeregning,
  getBeregningsgrunnlag,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { createSelector } from 'reselect';
import { andelsnrMottarYtelseMap, frilansMottarYtelse, skalFastsetteInntektATUtenInntektsmelding } from './vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';
import { getFormValuesForBeregning } from '../BeregningFormUtils';
import { besteberegningField } from './besteberegningFodendeKvinne/VurderBesteberegningForm';
import { MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD } from './InntektstabellPanel';

const nullOrUndefined = value => value === null || value === undefined;

export const settAndelIArbeid = (andelerIArbeid) => {
  if (andelerIArbeid.length === 0) {
    return '';
  }
  if (andelerIArbeid.length === 1) {
    return `${parseFloat(andelerIArbeid[0]).toFixed(2)}`;
  }
  const minAndel = Math.min(...andelerIArbeid);
  const maxAndel = Math.max(...andelerIArbeid);
  return `${minAndel} - ${maxAndel}`;
};

const preutfyllInntektskategori = andel => (andel.inntektskategori
&& andel.inntektskategori.kode !== inntektskategorier.UDEFINERT ? andel.inntektskategori.kode : '');


const createAndelnavn = (andel, getKodeverknavn) => {
  if (!andel.aktivitetStatus || andel.aktivitetStatus.kode === aktivitetStatus.UDEFINERT) {
    return '';
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER && andel.arbeidsforhold) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn);
  }
  return getKodeverknavn(andel.aktivitetStatus);
};

const finnFastsattPrMnd = (beregnetPrMnd,
  fastsattForrige, fastsattAvSaksbehandler) => {
  if (!nullOrUndefined(beregnetPrMnd) && fastsattAvSaksbehandler) {
    return beregnetPrMnd;
  }
  if (!nullOrUndefined(fastsattForrige)) {
    return fastsattForrige;
  }
  return null;
};

export const settFastsattBelop = (beregnet,
  fastsattForrige, fastsattAvSaksbehandler) => {
  const fastsatt = finnFastsattPrMnd(beregnet,
    fastsattForrige, fastsattAvSaksbehandler);
  if (fastsatt !== null) {
    return formatCurrencyNoKr(fastsatt);
  }
  return '';
};

export const settReadOnlyBelop = (snittIBeregningsperiodenPrMnd, belopFraInntektsmeldingPrMnd) => {
  if (!nullOrUndefined(belopFraInntektsmeldingPrMnd)) {
    return formatCurrencyNoKr(belopFraInntektsmeldingPrMnd);
  }
  if (!nullOrUndefined(snittIBeregningsperiodenPrMnd)) {
    return formatCurrencyNoKr(snittIBeregningsperiodenPrMnd);
  }
  return '0';
};

export const setArbeidsforholdInitialValues = andel => ({
  arbeidsgiverNavn: andel.arbeidsforhold && andel.arbeidsforhold.arbeidsgiverNavn !== 0 ? andel.arbeidsforhold.arbeidsgiverNavn : '',
  arbeidsgiverId: andel.arbeidsforhold && andel.arbeidsforhold.arbeidsgiverId !== 0 ? andel.arbeidsforhold.arbeidsgiverId : '',
  arbeidsforholdId: andel.arbeidsforhold && andel.arbeidsforhold.arbeidsforholdId !== 0 ? andel.arbeidsforhold.arbeidsforholdId : '',
  arbeidsperiodeFom: andel.arbeidsforhold ? andel.arbeidsforhold.startdato : '',
  arbeidsperiodeTom: andel.arbeidsforhold && andel.arbeidsforhold.opphoersdato !== null
    ? andel.arbeidsforhold.opphoersdato : '',
  arbeidsforholdType: andel.arbeidsforholdType,
});

export const setGenerellAndelsinfo = (andel, getKodeverknavn) => ({
  andel: createAndelnavn(andel, getKodeverknavn),
  aktivitetStatus: andel.aktivitetStatus.kode,
  andelsnr: andel.andelsnr,
  nyAndel: false,
  lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler === true,
  inntektskategori: preutfyllInntektskategori(andel),
});


const listeInneholderAndel = (liste, field) => (liste ? liste.find(element => element.andelsnr === field.andelsnr
|| element.andelsnr === field.andelsnrRef) : undefined);

export const erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon = (field, faktaOmBeregning) => {
  const andelIListe = listeInneholderAndel(faktaOmBeregning
    .arbeidstakerOgFrilanserISammeOrganisasjonListe, field);
  return andelIListe && (andelIListe.inntektPrMnd === null || andelIListe.inntektPrMnd === undefined);
};

export const starterPaaEllerEtterStp = (bgAndel,
  skjaeringstidspunktBeregning) => (bgAndel && bgAndel.arbeidsforhold
    && bgAndel.arbeidsforhold.startdato && !moment(bgAndel.arbeidsforhold.startdato).isBefore(moment(skjaeringstidspunktBeregning)));


// Aktivitetstatus

const erArbeidstaker = field => (field.aktivitetStatus && (field.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER
  || field.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER));

const erFrilanser = field => (field.aktivitetStatus && (field.aktivitetStatus === aktivitetStatus.FRILANSER
  || field.aktivitetStatus.kode === aktivitetStatus.FRILANSER));

const erDagpenger = field => (field.aktivitetStatus && (field.aktivitetStatus === aktivitetStatus.DAGPENGER
  || field.aktivitetStatus.kode === aktivitetStatus.DAGPENGER));

// Nyoppstartet frilanser

const erNyoppstartetFrilanser = (field, values) => erFrilanser(field) && values[erNyoppstartetFLField];

// Besteberegning

const skalHaBesteberegning = values => values[besteberegningField];

export const skalHaBesteberegningSelector = createSelector([getFormValuesForBeregning], skalHaBesteberegning);

// Lonnsendring

const harLonnsendringUtenInntektsmelding = (values, field, faktaOmBeregning) => faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM
&& listeInneholderAndel(faktaOmBeregning
  .arbeidsforholdMedLønnsendringUtenIM, field) && values[lonnsendringField];

const erATUtenInntektsmeldingMedLonnsendring = (field, values, faktaOmBeregning) => erArbeidstaker(field)
&& harLonnsendringUtenInntektsmelding(values, field, faktaOmBeregning);

// AT og FL i samme organisasjon

export const andelErStatusFLOgHarATISammeOrg = (field, faktaOmBeregning) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
&& erFrilanser(field);

const andelErStatusATUtenInntektsmeldingOgHarFLISammeOrg = (field, faktaOmBeregning) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
&& erArbeidstaker(field) && erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon(field, faktaOmBeregning);

// Søker mottar ytelse

const sokerMottarYtelseForAndel = (values, field, faktaOmBeregning, beregningsgrunnlag) => {
  const mottarYtelseMap = andelsnrMottarYtelseMap(values, faktaOmBeregning.vurderMottarYtelse, beregningsgrunnlag);
  return mottarYtelseMap[field.andelsnr] || mottarYtelseMap[field.andelsnrRef];
};

// Manuelt registrert med handlingstype LAGT_TIL_AV_BRUKER
const erAndelKunstigArbeidsforhold = (andel, beregningsgrunnlag) => {
  const firstBgPeriod = beregningsgrunnlag.beregningsgrunnlagPeriode[0];
  const lagtTilAvBruker = firstBgPeriod.beregningsgrunnlagPrStatusOgAndel.find(a => a.arbeidsforhold
  && a.arbeidsforhold.arbeidsgiverId === andel.arbeidsgiverId
  && a.arbeidsforhold.organisasjonstype
  && a.arbeidsforhold.organisasjonstype.kode === organisasjonstyper.KUNSTIG);
  return lagtTilAvBruker !== undefined;
};

export const harAAPOgRefusjonskravOverstigerInntektsmelding = (andel, beregningsgrunnlag) => {
  if (andel.refusjonskravFraInntektsmelding && andel.refusjonskravFraInntektsmelding > andel.belopFraInntektsmelding) {
    return beregningsgrunnlag.beregningsgrunnlagPeriode.some(periode => periode.beregningsgrunnlagPrStatusOgAndel
      .some(a => a.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER));
  }
  return false;
};

// Kun Ytelse
const harKunYtelse = faktaOmBeregning => !!faktaOmBeregning.faktaOmBeregningTilfeller && faktaOmBeregning.faktaOmBeregningTilfeller
.find(({ kode }) => kode === faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE) !== undefined;

const skalKunneOverstigeRapportertInntektOgTotaltBeregningsgrunnlag = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => {
  if (erDagpenger(andel) && andel.harPeriodeAarsakGraderingEllerRefusjon) {
    return true;
  }
  if (skalHaBesteberegning(values)) {
    return true;
  }
  if (sokerMottarYtelseForAndel(values, andel, faktaOmBeregning, beregningsgrunnlag)) {
    return true;
  }
  if (erATUtenInntektsmeldingMedLonnsendring(andel, values, faktaOmBeregning)) {
    return true;
  }
  if (andelErStatusFLOgHarATISammeOrg(andel, faktaOmBeregning)) {
    return true;
  }
  if (andelErStatusATUtenInntektsmeldingOgHarFLISammeOrg(andel, faktaOmBeregning)) {
    return true;
  }
  if (erAndelKunstigArbeidsforhold(andel, beregningsgrunnlag)) {
    return true;
  }
  return false;
};

export const skalKunneOverstigeRapportertInntekt = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => {
  if (harAAPOgRefusjonskravOverstigerInntektsmelding(andel, beregningsgrunnlag)) {
    return true;
  }
  if (skalKunneOverstigeRapportertInntektOgTotaltBeregningsgrunnlag(values, faktaOmBeregning, beregningsgrunnlag)(andel)) {
    return true;
  }
  return false;
};

export const skalKunneEndreTotaltBeregningsgrunnlag = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => {
  if (skalKunneOverstigeRapportertInntektOgTotaltBeregningsgrunnlag(values, faktaOmBeregning, beregningsgrunnlag)(andel)) {
    return true;
  }
  if (erNyoppstartetFrilanser(andel, values)) {
    return true;
  }
  return false;
};

// Overstyring

export const erOverstyring = values => values && values[MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD] === true;

export const erOverstyringAvBeregningsgrunnlagSelector = createSelector([
  getFormValuesForBeregning], erOverstyring);


// Skal redigere inntekt

export const skalRedigereInntektForAndel = (values, faktaOmBeregning, beregningsgrunnlag) => andel => erOverstyring(values)
|| andel.harPeriodeAarsakGraderingEllerRefusjon === true
|| skalKunneEndreTotaltBeregningsgrunnlag(values, faktaOmBeregning, beregningsgrunnlag)(andel)
|| harKunYtelse(faktaOmBeregning);

export const skalRedigereInntektSelector = createSelector([getFormValuesForBeregning, getFaktaOmBeregning, getBeregningsgrunnlag], skalRedigereInntektForAndel);

export const setSkalRedigereInntektForATFL = (state, fields) => {
  const values = getFormValuesForBeregning(state);
  const beregningsgrunnlag = getBeregningsgrunnlag(state);
  const faktaOmBeregning = getFaktaOmBeregning(state);
  let index = 0;
  const skalRedigere = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag);
  for (index; index < fields.length; index += 1) {
    const field = fields.get(index);
    field.skalRedigereInntekt = skalRedigere(field);
  }
};

export const skalFastsettInntektForStatus = (inntektFieldArrayName, status) => createSelector([
  getFormValuesForBeregning,
  skalRedigereInntektSelector],
(values, skalFastsette) => {
  const fields = values[inntektFieldArrayName];
  if (!fields) {
    return false;
  }
  for (let i = 0; i < fields.length; i += 1) {
    if (fields.get(i).aktivitetStatus === status && skalFastsette(fields.get(i))) {
      return true;
    }
  }
  return false;
});


// Skal redigere inntektskategori

export const skalRedigereInntektskategoriForAndel = (values, beregningsgrunnlag) => (andel) => {
  if (skalHaBesteberegning(values)) {
    return true;
  }
  if (erAndelKunstigArbeidsforhold(andel, beregningsgrunnlag)) {
    return true;
  }
  return andel.harPeriodeAarsakGraderingEllerRefusjon === true;
};

export const skalRedigereInntektskategoriSelector = createSelector([getFormValuesForBeregning, getBeregningsgrunnlag], skalRedigereInntektskategoriForAndel);

export const mapToBelop = skalRedigereInntekt => (andel) => {
  const { fastsattBelop, readOnlyBelop } = andel;
  if (!skalRedigereInntekt || skalRedigereInntekt(andel)) {
    return fastsattBelop ? removeSpacesFromNumber(fastsattBelop) : 0;
  }
  return readOnlyBelop ? removeSpacesFromNumber(readOnlyBelop) : 0;
};

export const skalFastsetteForATUavhengigAvATFLSammeOrg = (values,
  faktaOmBeregning) => (skalFastsetteInntektATUtenInntektsmelding(values, faktaOmBeregning.vurderMottarYtelse) || values[lonnsendringField]);

export const skalFastsetteForFLUavhengigAvATFLSammeOrg = values => (frilansMottarYtelse(values) || values[erNyoppstartetFLField]);

const mapToFastsattBelop = (andel) => {
  if (andel.fastsattAvSaksbehandler) {
    if (andel.besteberegningPrAar || andel.besteberegningPrAar === 0) {
      return formatCurrencyNoKr(andel.besteberegningPrAar / 12);
    }
    if (andel.beregnetPrAar || andel.beregnetPrAar === 0) {
      return formatCurrencyNoKr(andel.beregnetPrAar / 12);
    }
  }
  return '';
};

const mapToReadOnlyBelop = (bgAndel, faktaOmBeregning) => {
    if (erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon(bgAndel, faktaOmBeregning)) {
      return '';
    }
    if (andelErStatusFLOgHarATISammeOrg(bgAndel, faktaOmBeregning)) {
      return '';
    }
    if (bgAndel.arbeidsforhold && (bgAndel.arbeidsforhold.belopFraInntektsmeldingPrMnd || bgAndel.arbeidsforhold.belopFraInntektsmeldingPrMnd === 0)) {
      return formatCurrencyNoKr(bgAndel.arbeidsforhold.belopFraInntektsmeldingPrMnd);
    }
    if (bgAndel.belopPrMndEtterAOrdningen || bgAndel.belopPrMndEtterAOrdningen === 0) {
      return formatCurrencyNoKr(bgAndel.belopPrMndEtterAOrdningen);
    }
    return bgAndel.belopFraMeldekortPrMnd ? formatCurrencyNoKr(bgAndel.belopFraMeldekortPrMnd) : '';
};

export const mapAndelToField = (andel, getKodeverknavn, faktaOmBeregning) => ({
  ...setGenerellAndelsinfo(andel, getKodeverknavn),
  ...setArbeidsforholdInitialValues(andel),
  skalKunneEndreAktivitet: andel.lagtTilAvSaksbehandler && andel.aktivitetStatus.kode !== aktivitetStatus.DAGPENGER,
  fastsattBelop: mapToFastsattBelop(andel),
  belopReadOnly: mapToReadOnlyBelop(andel, faktaOmBeregning),
  refusjonskrav: andel.arbeidsforhold && andel.arbeidsforhold.refusjonPrAar !== null
  && andel.arbeidsforhold.refusjonPrAar !== undefined ? formatCurrencyNoKr(andel.arbeidsforhold.refusjonPrAar / 12) : '',
});
