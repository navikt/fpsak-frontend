import moment from 'moment';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';


import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';

import { createVisningsnavnForAktivitet } from './util/visningsnavnHelper';

const nullOrUndefined = (value) => value === null || value === undefined;

export const GRADERING_RANGE_DENOMINATOR = ' - ';

export const settAndelIArbeid = (andelerIArbeid) => {
  if (andelerIArbeid.length === 0) {
    return '';
  }
  if (andelerIArbeid.length === 1) {
    return `${parseFloat(andelerIArbeid[0]).toFixed(2)}`;
  }
  const minAndel = Math.min(...andelerIArbeid);
  const maxAndel = Math.max(...andelerIArbeid);
  return `${minAndel}${GRADERING_RANGE_DENOMINATOR}${maxAndel}`;
};

const finnnInntektskategorikode = (andel) => (andel.inntektskategori
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

export const finnFastsattPrAar = (fordeltPrAar,
  fastsattForrigePrAar) => {
  if (!nullOrUndefined(fordeltPrAar)) {
    return fordeltPrAar;
  }
  return nullOrUndefined(fastsattForrigePrAar) ? null : fastsattForrigePrAar;
};

export const settFastsattBelop = (fordeltPrAar,
  fastsattForrigePrAar) => {
  const fastsatt = finnFastsattPrAar(fordeltPrAar,
    fastsattForrigePrAar);
  if (fastsatt !== null) {
    return formatCurrencyNoKr(fastsatt);
  }
  return '';
};

const finnArbeidsgiverId = (arbeidsforhold) => {
  if (!arbeidsforhold) {
    return '';
  }
  if (arbeidsforhold.aktørId) {
    return arbeidsforhold.aktørId;
  }
  return arbeidsforhold.arbeidsgiverId ? arbeidsforhold.arbeidsgiverId : '';
};

export const setArbeidsforholdInitialValues = (andel) => ({
  arbeidsgiverNavn: andel.arbeidsforhold && andel.arbeidsforhold.arbeidsgiverNavn !== 0 ? andel.arbeidsforhold.arbeidsgiverNavn : '',
  arbeidsgiverId: finnArbeidsgiverId(andel.arbeidsforhold),
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
  forrigeInntektskategori: !andel.inntektskategori || andel.inntektskategori.kode === inntektskategorier.UDEFINERT ? null : andel.inntektskategori.kode,
});

export const starterPaaEllerEtterStp = (bgAndel,
  skjaeringstidspunktBeregning) => (bgAndel && bgAndel.arbeidsforhold
    && bgAndel.arbeidsforhold.startdato && !moment(bgAndel.arbeidsforhold.startdato).isBefore(moment(skjaeringstidspunktBeregning)));

const skalFlytteBeregningsgrunnlagFraAAP = (andel, andeler) => {
  if (andel.refusjonskravFraInntektsmelding && andel.refusjonskravFraInntektsmelding > andel.belopFraInntektsmelding) {
    return andeler
      .some((a) => a.aktivitetStatus === aktivitetStatus.ARBEIDSAVKLARINGSPENGER);
  }
  return false;
};

const harAAPOgRefusjonskravOverstigerInntektsmelding = (andel, beregningsgrunnlag) => {
  if (andel.refusjonskravFraInntektsmelding && andel.refusjonskravFraInntektsmelding > andel.belopFraInntektsmelding) {
    return beregningsgrunnlag.beregningsgrunnlagPeriode.some((periode) => periode.beregningsgrunnlagPrStatusOgAndel
      .some((a) => a.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER));
  }
  return false;
};

const erAAPOgSkalFlytteTilArbeidsgiverSomRefunderer = (andel, andeler) => {
  if (andel.aktivitetStatus !== aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
    return false;
  }
  return andeler.some((a) => {
    const bgPrAar = a.beregningsgrunnlagPrAar ? a.beregningsgrunnlagPrAar : 0;
    return a.refusjonskravFraInntektsmelding && a.refusjonskravFraInntektsmelding > bgPrAar;
  });
};

export const erAAPEllerArbeidsgiverOgSkalFlytteMellomAAPOgArbeidsgiver = (andel, andeler) => (
  skalFlytteBeregningsgrunnlagFraAAP(andel, andeler) || erAAPOgSkalFlytteTilArbeidsgiverSomRefunderer(andel, andeler)
);

const erSNEllerFL = (andel) => andel.aktivitetStatus === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE
|| andel.aktivitetStatus === aktivitetStatus.FRILANSER;

export const skalValidereMotBeregningsgrunnlag = (beregningsgrunnlag) => (andel) => {
  if (harAAPOgRefusjonskravOverstigerInntektsmelding(andel, beregningsgrunnlag)) {
    return false;
  }
  if (erSNEllerFL(andel)) {
    return false;
  }
  return !andel.nyttArbeidsforhold;
};

export const mapToBelop = (andel) => {
  const { fastsattBelop, readOnlyBelop } = andel;
  if (andel.harPeriodeAarsakGraderingEllerRefusjon) {
    return fastsattBelop ? removeSpacesFromNumber(fastsattBelop) : 0;
  }
  return readOnlyBelop ? removeSpacesFromNumber(readOnlyBelop) : 0;
};
