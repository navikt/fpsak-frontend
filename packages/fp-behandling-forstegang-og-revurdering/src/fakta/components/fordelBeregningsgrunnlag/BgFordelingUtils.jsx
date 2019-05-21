import moment from 'moment';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/visningsnavnHelper';

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

const finnnInntektskategorikode = andel => (andel.inntektskategori
&& andel.inntektskategori.kode !== inntektskategorier.UDEFINERT ? andel.inntektskategori.kode : '');


const createAndelnavn = (andel, harKunYtelse, getKodeverknavn) => {
  if (!andel.aktivitetStatus || andel.aktivitetStatus.kode === aktivitetStatus.UDEFINERT) {
    return '';
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER && andel.arbeidsforhold) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn);
  }
  if (harKunYtelse && andel.aktivitetStatus.kode === aktivitetStatus.BRUKERS_ANDEL) {
    return 'Ytelse';
  }
  return getKodeverknavn(andel.aktivitetStatus);
};

const finnFastsattPrAar = (beregnetPrAar,
  fastsattForrigePrAar, fastsattAvSaksbehandler) => {
  if (!nullOrUndefined(beregnetPrAar) && fastsattAvSaksbehandler) {
    return beregnetPrAar;
  }
  return nullOrUndefined(fastsattForrigePrAar) ? null : fastsattForrigePrAar;
};

export const settFastsattBelop = (beregnetPrAar,
  fastsattForrigePrAar, fastsattAvSaksbehandler) => {
  const fastsatt = finnFastsattPrAar(beregnetPrAar,
    fastsattForrigePrAar, fastsattAvSaksbehandler);
  if (fastsatt !== null) {
    return formatCurrencyNoKr(fastsatt);
  }
  return '';
};

export const settReadOnlyBelop = (snittIBeregningsperiodenPrAar, belopFraInntektsmeldingPrAar) => {
  if (!nullOrUndefined(belopFraInntektsmeldingPrAar)) {
    return formatCurrencyNoKr(belopFraInntektsmeldingPrAar);
  }
  if (!nullOrUndefined(snittIBeregningsperiodenPrAar)) {
    return formatCurrencyNoKr(snittIBeregningsperiodenPrAar);
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

export const setGenerellAndelsinfo = (andel, harKunYtelse, getKodeverknavn) => ({
  andel: createAndelnavn(andel, harKunYtelse, getKodeverknavn),
  aktivitetStatus: andel.aktivitetStatus.kode,
  andelsnr: andel.andelsnr,
  nyAndel: false,
  lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler === true,
  inntektskategori: finnnInntektskategorikode(andel),
});


const listeInneholderAndel = (liste, field) => (liste ? liste.find(element => element.andelsnr === field.andelsnr
|| element.andelsnr === field.andelsnrRef) : undefined);

export const erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon = (field, faktaOmBeregning) => {
  const andelIListe = listeInneholderAndel(faktaOmBeregning
    .arbeidstakerOgFrilanserISammeOrganisasjonListe, field);
  return andelIListe && (andelIListe.inntektPrMnd === null || andelIListe.inntektPrMnd === undefined);
};

const erFrilanser = field => (field.aktivitetStatus && (field.aktivitetStatus === aktivitetStatus.FRILANSER
  || field.aktivitetStatus.kode === aktivitetStatus.FRILANSER));

export const andelErStatusFLOgHarATISammeOrg = (field, faktaOmBeregning) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe
&& erFrilanser(field);

export const starterPaaEllerEtterStp = (bgAndel,
  skjaeringstidspunktBeregning) => (bgAndel && bgAndel.arbeidsforhold
    && bgAndel.arbeidsforhold.startdato && !moment(bgAndel.arbeidsforhold.startdato).isBefore(moment(skjaeringstidspunktBeregning)));

export const harAAPOgRefusjonskravOverstigerInntektsmelding = (andel, beregningsgrunnlag) => {
  if (andel.refusjonskravFraInntektsmelding && andel.refusjonskravFraInntektsmelding > andel.belopFraInntektsmelding) {
    return beregningsgrunnlag.beregningsgrunnlagPeriode.some(periode => periode.beregningsgrunnlagPrStatusOgAndel
      .some(a => a.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER));
  }
  return false;
};

export const skalKunneOverstigeRapportertInntekt = beregningsgrunnlag => (andel) => {
  if (harAAPOgRefusjonskravOverstigerInntektsmelding(andel, beregningsgrunnlag)) {
    return true;
  }
  return false;
};

export const mapToBelop = (andel) => {
  const { fastsattBelop, readOnlyBelop } = andel;
  if (andel.harPeriodeAarsakGraderingEllerRefusjon) {
    return fastsattBelop ? removeSpacesFromNumber(fastsattBelop) : 0;
  }
  return readOnlyBelop ? removeSpacesFromNumber(readOnlyBelop) : 0;
};

export const skalFastsetteForATUavhengigAvATFLSammeOrg = (values,
  faktaOmBeregning) => (skalFastsetteInntektATUtenInntektsmelding(values, faktaOmBeregning.vurderMottarYtelse) || values[lonnsendringField]);

export const skalFastsetteForFLUavhengigAvATFLSammeOrg = values => (frilansMottarYtelse(values) || values[erNyoppstartetFLField]);
