import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { lonnsendringField }
  from 'behandlingFpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField }
  from 'behandlingFpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { formatCurrencyNoKr, createVisningsnavnForAktivitet, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import {
  getFaktaOmBeregning,
  getBeregningsgrunnlag,
} from 'behandlingFpsak/src/behandlingSelectors';
import { createSelector } from 'reselect';
import { andelsnrMottarYtelseMap, frilansMottarYtelse, skalFastsetteInntektATUtenInntektsmelding } from './vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';
import { getFormValuesForBeregning } from '../BeregningFormUtils';
import { besteberegningField } from './besteberegningFodendeKvinne/VurderBesteberegningForm';

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

export const preutfyllInntektskategori = andel => (andel.inntektskategori
&& andel.inntektskategori.kode !== inntektskategorier.UDEFINERT ? andel.inntektskategori.kode : '');


export const createAndelnavn = (andel) => {
  if (!andel.aktivitetStatus || andel.aktivitetStatus.kode === aktivitetStatus.UDEFINERT) {
    return '';
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER && andel.arbeidsforhold) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold);
  }
  return andel.aktivitetStatus.navn;
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

export const settReadOnlyBelop = (readOnly, fordelingForrigeBehandling, beregnetPrMnd, snittIBeregningsperiodenPrMnd) => {
  if (!nullOrUndefined(snittIBeregningsperiodenPrMnd) && !readOnly) {
    return formatCurrencyNoKr(snittIBeregningsperiodenPrMnd);
  }
  if (!nullOrUndefined(beregnetPrMnd)) {
    return formatCurrencyNoKr(beregnetPrMnd);
  }
  if (!nullOrUndefined(fordelingForrigeBehandling)) {
    return formatCurrencyNoKr(fordelingForrigeBehandling);
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
});

export const setGenerellAndelsinfo = andel => ({
  andel: createAndelnavn(andel),
  aktivitetStatus: andel.aktivitetStatus.kode,
  andelsnr: andel.andelsnr,
  nyAndel: false,
  lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler === true,
  inntektskategori: preutfyllInntektskategori(andel),
});


const listeInneholderAndel = (liste, field) => (liste ? liste.find(element => element.andelsnr === field.andelsnr
|| element.andelsnr === field.andelsnrRef) : undefined);

const erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon = (field, faktaOmBeregning) => {
  const andelIListe = listeInneholderAndel(faktaOmBeregning
    .arbeidstakerOgFrilanserISammeOrganisasjonListe, field);
  return andelIListe && (andelIListe.inntektPrMnd === null || andelIListe.inntektPrMnd === undefined);
};

// Aktivitetstatus

const erArbeidstaker = field => field.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER;

const erFrilanser = field => field.aktivitetStatus === aktivitetStatus.FRILANSER;

// Nyoppstartet frilanser

const erNyoppstartetFrilanser = (field, values) => erFrilanser(field) && values[erNyoppstartetFLField];

// Besteberegning

const skalHaBesteberegning = values => values[besteberegningField];

export const skalHaBesteberegningSelector = createSelector([getFormValuesForBeregning], skalHaBesteberegning);

// Lonnsendring

const harLonnsendringUtenInntektsmelding = (values, field, faktaOmBeregning) => listeInneholderAndel(faktaOmBeregning
  .arbeidsforholdMedLønnsendringUtenIM, field) && values[lonnsendringField];

const erATUtenInntektsmeldingMedLonnsendring = (field, values, faktaOmBeregning) => erArbeidstaker(field)
&& harLonnsendringUtenInntektsmelding(values, field, faktaOmBeregning);

// AT og FL i samme organisasjon

const andelErStatusFLOgHarATISammeOrg = (field, faktaOmBeregning) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
&& erFrilanser(field);

const andelErStatusATUtenInntektsmeldingOgHarFLISammeOrg = (field, faktaOmBeregning) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
&& erArbeidstaker(field) && erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon(field, faktaOmBeregning);

// Søker mottar ytelse

const sokerMottarYtelseForAndel = (values, field, faktaOmBeregning, beregningsgrunnlag) => {
  const mottarYtelseMap = andelsnrMottarYtelseMap(values, faktaOmBeregning.vurderMottarYtelse, beregningsgrunnlag);
  return mottarYtelseMap[field.andelsnr] || mottarYtelseMap[field.andelsnrRef];
};

// Skal redigere inntekt

export const skalRedigereInntektForAndel = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => {
  if (skalHaBesteberegning(values)) {
    return true;
  }
  if (sokerMottarYtelseForAndel(values, andel, faktaOmBeregning, beregningsgrunnlag)) {
    return true;
  }
  if (erNyoppstartetFrilanser(andel, values)) {
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
  return andel.harPeriodeAarsakGraderingEllerRefusjon === true;
};

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
  return fields.filter(field => field.aktivitetStatus === status).map(skalFastsette).includes(true);
});


// Skal redigere inntektskategori

export const skalRedigereInntektskategoriForAndel = values => (andel) => {
  if (skalHaBesteberegning(values)) {
    return true;
  }
  return andel.harPeriodeAarsakGraderingEllerRefusjon === true;
};

export const skalRedigereInntektskategoriSelector = createSelector([getFormValuesForBeregning], skalRedigereInntektskategoriForAndel);

export const mapToBelop = skalRedigereInntekt => (andel) => {
  const { fastsattBeløp, readOnlyBelop } = andel;
  if (!skalRedigereInntekt || skalRedigereInntekt(andel)) {
    return fastsattBeløp ? removeSpacesFromNumber(fastsattBeløp) : 0;
  }
  return readOnlyBelop ? removeSpacesFromNumber(readOnlyBelop) : 0;
};

export const skalFastsetteForATUavhengigAvATFLSammeOrg = (values,
  faktaOmBeregning) => (skalFastsetteInntektATUtenInntektsmelding(values, faktaOmBeregning.vurderMottarYtelse) || values[lonnsendringField]);

export const skalFastsetteForFLUavhengigAvATFLSammeOrg = values => (frilansMottarYtelse(values) || values[erNyoppstartetFLField]);

const mapToFastsattBelop = (andel) => {
  if (andel.besteberegningPrAar || andel.besteberegningPrAar === 0) {
    return formatCurrencyNoKr(andel.besteberegningPrAar / 12);
  }
  if (andel.beregnetPrAar || andel.beregnetPrAar === 0) {
    return formatCurrencyNoKr(andel.beregnetPrAar / 12);
  }
  return '';
};

export const mapAndelToField = andel => ({
  ...setGenerellAndelsinfo(andel),
  ...setArbeidsforholdInitialValues(andel),
  skalKunneEndreAktivitet: andel.lagtTilAvSaksbehandler && andel.aktivitetStatus.kode !== aktivitetStatus.DAGPENGER,
  fastsattBelop: mapToFastsattBelop(andel),
  refusjonskrav: andel.arbeidsforhold && andel.arbeidsforhold.refusjonPrAar !== null
  && andel.arbeidsforhold.refusjonPrAar !== undefined ? formatCurrencyNoKr(andel.refusjonPrAar / 12) : '',
});
