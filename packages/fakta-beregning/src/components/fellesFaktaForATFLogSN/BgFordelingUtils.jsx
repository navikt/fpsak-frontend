import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import { createSelector } from 'reselect';
import { lonnsendringField } from './vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField } from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { harEtterlonnSluttpakkeField } from './vurderOgFastsettATFL/forms/VurderEtterlonnSluttpakkeForm';
import erAndelUtenReferanseOgGrunnlagHarAndelForSammeArbeidsgiverMedReferanse from './vurderOgFastsettATFL/forms/AvsluttetArbeidsforhold';
import { andelsnrMottarYtelseMap } from './vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';
import { getFormValuesForBeregning } from '../BeregningFormUtils';
import { besteberegningField } from './besteberegningFodendeKvinne/VurderBesteberegningForm';
import { MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD } from './InntektstabellPanel';

export const INNTEKT_FIELD_ARRAY_NAME = 'inntektFieldArray';


const preutfyllInntektskategori = (andel) => (andel.inntektskategori
&& andel.inntektskategori.kode !== inntektskategorier.UDEFINERT ? andel.inntektskategori.kode : '');

export const setArbeidsforholdInitialValues = (andel) => ({
  arbeidsgiverId: andel.arbeidsforhold ? andel.arbeidsforhold.arbeidsgiverId : null,
  arbeidsforholdId: andel.arbeidsforhold ? andel.arbeidsforhold.arbeidsforholdId : null,
  arbeidsperiodeFom: andel.arbeidsforhold ? andel.arbeidsforhold.startdato : '',
  arbeidsperiodeTom: andel.arbeidsforhold ? andel.arbeidsforhold.opphoersdato : '',
  arbeidsforholdType: andel.arbeidsforhold ? andel.arbeidsforhold.arbeidsforholdType : '',
});

export const setGenerellAndelsinfo = (andel) => ({
  andel: andel.visningsnavn,
  aktivitetStatus: andel.aktivitetStatus.kode,
  andelsnr: andel.andelsnr,
  nyAndel: false,
  inntektskategori: preutfyllInntektskategori(andel),
  lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler === true,
});


const listeInneholderAndel = (liste, field) => (liste ? liste.find((element) => element.andelsnr === field.andelsnr
|| element.andelsnr === field.andelsnrRef) : undefined);

const erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon = (field, faktaOmBeregning) => {
  const andelIListe = listeInneholderAndel(faktaOmBeregning
    .arbeidstakerOgFrilanserISammeOrganisasjonListe, field);
  return andelIListe && (andelIListe.inntektPrMnd === null || andelIListe.inntektPrMnd === undefined);
};

// Aktivitetstatus

const erArbeidstaker = (field) => (field.aktivitetStatus && (field.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER
  || field.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER));

const erFrilanser = (field) => (field.aktivitetStatus && (field.aktivitetStatus === aktivitetStatus.FRILANSER
  || field.aktivitetStatus.kode === aktivitetStatus.FRILANSER));

// Nyoppstartet frilanser

const erNyoppstartetFrilanser = (field, values) => {
  const val = values;
  if (!val) {
    return false;
  }
  return erFrilanser(field) && values[erNyoppstartetFLField];
};

// Besteberegning

const skalHaBesteberegning = (values) => values[besteberegningField];

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

// Etterlønn / sluttpakke
const andelErEtterlønnSluttpakkeOgSkalFastsettes = (andel, values) => {
  if (andel.arbeidsforholdType && andel.arbeidsforholdType.kode === OAType.ETTERLONN_SLUTTPAKKE) {
    return values[harEtterlonnSluttpakkeField];
  }
  return false;
};

// Manuelt registrert med handlingstype LAGT_TIL_AV_BRUKER
const erAndelKunstigArbeidsforhold = (andel, beregningsgrunnlag) => {
  const firstBgPeriod = beregningsgrunnlag.beregningsgrunnlagPeriode[0];
  const lagtTilAvBruker = firstBgPeriod.beregningsgrunnlagPrStatusOgAndel.find((a) => a.arbeidsforhold
  && a.arbeidsforhold.arbeidsgiverId === andel.arbeidsgiverId
  && a.arbeidsforhold.organisasjonstype
  && a.arbeidsforhold.organisasjonstype.kode === organisasjonstyper.KUNSTIG);
  return lagtTilAvBruker !== undefined;
};

// Kun Ytelse
const harKunYtelse = (faktaOmBeregning) => !!faktaOmBeregning.faktaOmBeregningTilfeller && faktaOmBeregning.faktaOmBeregningTilfeller
  .find(({ kode }) => kode === faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE) !== undefined;

const skalKunneOverstigeRapportertInntektOgTotaltBeregningsgrunnlag = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => {
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
  if (erAndelUtenReferanseOgGrunnlagHarAndelForSammeArbeidsgiverMedReferanse(andel, beregningsgrunnlag)) {
    return true;
  }
  if (andelErEtterlønnSluttpakkeOgSkalFastsettes(andel, values)) {
    return true;
  }
  return false;
};


const skalKunneEndreTotaltBeregningsgrunnlag = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => {
  if (skalKunneOverstigeRapportertInntektOgTotaltBeregningsgrunnlag(values, faktaOmBeregning, beregningsgrunnlag)(andel)) {
    return true;
  }
  if (erNyoppstartetFrilanser(andel, values)) {
    return true;
  }
  return false;
};

// Overstyring

export const erOverstyring = (values) => !!values && values[MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD] === true;

export const erOverstyringAvBeregningsgrunnlag = createSelector([getFormValuesForBeregning], erOverstyring);

export const skalRedigereInntektForAndel = (values, faktaOmBeregning, beregningsgrunnlag) => (andel) => erOverstyring(values)
|| skalKunneEndreTotaltBeregningsgrunnlag(values, faktaOmBeregning, beregningsgrunnlag)(andel)
|| harKunYtelse(faktaOmBeregning);

export const getSkalRedigereInntekt = createSelector([
  getFormValuesForBeregning,
  (state, ownProps) => ownProps.beregningsgrunnlag.faktaOmBeregning,
  (state, ownProps) => ownProps.beregningsgrunnlag], skalRedigereInntektForAndel);

// Skal redigere inntekt
export const skalFastsetteInntektForSN = createSelector([
  getFormValuesForBeregning,
  getSkalRedigereInntekt],
(values, skalFastsette) => {
  const fields = values[INNTEKT_FIELD_ARRAY_NAME];
  if (!fields) {
    return false;
  }
  return fields.filter((field) => field.aktivitetStatus === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE).map(skalFastsette).includes(true);
});

// Skal redigere inntektskategori

export const skalRedigereInntektskategoriForAndel = (values, beregningsgrunnlag) => (andel) => {
  if (skalHaBesteberegning(values)) {
    return true;
  }
  if (erAndelKunstigArbeidsforhold(andel, beregningsgrunnlag)) {
    return true;
  }
  return false;
};

export const getSkalRedigereInntektskategori = createSelector([
  getFormValuesForBeregning,
  (state, ownProps) => ownProps.beregningsgrunnlag],
skalRedigereInntektskategoriForAndel);

export const mapToBelop = (skalRedigereInntekt) => (andel) => {
  const { fastsattBelop, readOnlyBelop } = andel;
  if (!skalRedigereInntekt || skalRedigereInntekt(andel)) {
    return fastsattBelop ? removeSpacesFromNumber(fastsattBelop) : 0;
  }
  return readOnlyBelop ? removeSpacesFromNumber(readOnlyBelop) : 0;
};

export const mapAndelToField = (andel) => ({
  ...setGenerellAndelsinfo(andel),
  ...setArbeidsforholdInitialValues(andel),
  skalKunneEndreAktivitet: andel.skalKunneEndreAktivitet,
  fastsattBelop: andel.fastsattBelop || andel.fastsattBelop === 0 ? formatCurrencyNoKr(andel.fastsattBelop) : '',
  belopReadOnly: andel.belopReadOnly || andel.belopReadOnly === 0 ? formatCurrencyNoKr(andel.belopReadOnly) : '',
  refusjonskrav: andel.refusjonskrav || andel.refusjonskrav === 0 ? formatCurrencyNoKr(andel.refusjonskrav) : '',
});
