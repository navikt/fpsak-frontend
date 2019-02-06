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
import { getBehandlingFormValues } from 'behandlingFpsak/src/behandlingForm';
import { andelsnrMottarYtelseMap, frilansMottarYtelse, skalFastsetteInntektATUtenInntektsmelding } from './vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';

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
  lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler,
  inntektskategori: preutfyllInntektskategori(andel),
});

const erArbeidstakerFrilansISammeOrganisasjon = (field, faktaOmBeregning) => {
  const andelsnrListe = faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
    .map(({ andelsnr }) => andelsnr);
  return andelsnrListe.includes(field.andelsnr) || andelsnrListe.includes(field.andelsnrRef);
};

const erArbeidstaker = field => field.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER;

const erFrilanser = field => field.aktivitetStatus === aktivitetStatus.FRILANSER;

const erNyoppstartetFrilanser = (field, values) => erFrilanser(field) && values[erNyoppstartetFLField];

const erATUtenInntektsmeldingMedLonnsendring = (field, values) => erArbeidstaker(field)
&& (field.belopFraInntektsmelding === undefined || field.belopFraInntektsmelding === null) && values[lonnsendringField];

const andelErStatusFLOgHarATISammeOrg = (field, faktaOmBeregning) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
&& erFrilanser(field);

const andelErStatusATOgHarFLISammeOrg = (field, faktaOmBeregning) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
&& erArbeidstaker(field) && erArbeidstakerFrilansISammeOrganisasjon(field, faktaOmBeregning);

const sokerMottarYtelseForAndel = (values, field, faktaOmBeregning, beregningsgrunnlag) => {
  const mottarYtelseMap = andelsnrMottarYtelseMap(values, faktaOmBeregning.vurderMottarYtelse, beregningsgrunnlag);
  return mottarYtelseMap[field.andelsnr] || mottarYtelseMap[field.andelsnrRef];
};

export const skalRedigereInntektForAndel = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => {
  if (sokerMottarYtelseForAndel(values, andel, faktaOmBeregning, beregningsgrunnlag)) {
    return true;
  }
  if (erNyoppstartetFrilanser(andel, values)) {
    return true;
  }
  if (erATUtenInntektsmeldingMedLonnsendring(andel, values)) {
    return true;
  }
  if (andelErStatusFLOgHarATISammeOrg(andel, faktaOmBeregning)) {
    return true;
  }
  if (andelErStatusATOgHarFLISammeOrg(andel, faktaOmBeregning)) {
    return true;
  }
  return andel.harPeriodeAarsakGraderingEllerRefusjon;
};

export const setSkalRedigereInntektForATFL = (state, fields, formName) => {
  const values = getBehandlingFormValues(formName)(state);
  const beregningsgrunnlag = getBeregningsgrunnlag(state);
  const faktaOmBeregning = getFaktaOmBeregning(state);
  let index = 0;
  const skalRedigere = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag);
  for (index; index < fields.length; index += 1) {
    const field = fields.get(index);
    field.skalRedigereInntekt = skalRedigere(field);
  }
};

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
