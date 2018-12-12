import inntektskategorier from 'kodeverk/inntektskategorier';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';

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

const finnFastsattPrMnd = (harPeriodeAarsakGraderingEllerRefusjon, beregnetPrMnd,
  fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler) => {
  if (harPeriodeAarsakGraderingEllerRefusjon) {
    if ((beregnetPrMnd || beregnetPrMnd === 0) && fastsattAvSaksbehandler) {
      return beregnetPrMnd;
    }
    if (fastsattForrige || fastsattForrige === 0) {
      return fastsattForrige;
    }
    return null;
  }
  if (fordelingForrigeBehandling || fordelingForrigeBehandling === 0) {
    return fordelingForrigeBehandling;
  }
  return 0;
};

export const settFastsattBelop = (harPeriodeAarsakGraderingEllerRefusjon, beregnet,
  fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler) => {
  const fastsatt = finnFastsattPrMnd(harPeriodeAarsakGraderingEllerRefusjon, beregnet,
    fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
  if (fastsatt !== null) {
    return formatCurrencyNoKr(fastsatt);
  }
  return '';
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
