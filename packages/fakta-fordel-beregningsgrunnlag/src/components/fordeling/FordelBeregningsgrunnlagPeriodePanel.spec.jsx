import { expect } from 'chai';
import moment from 'moment';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import FordelBeregningsgrunnlagPeriodePanel from './FordelBeregningsgrunnlagPeriodePanel';

const stpBeregning = '2018-01-01';

const arbeidsforhold = {
  arbeidsgiverNavn: 'Virksomheten',
  arbeidsgiverId: '3284788923',
  arbeidsforholdId: '321378huda7e2',
  eksternArbeidsforholdId: '12345',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforhold2 = {
  arbeidsgiverNavn: 'Virksomheten 2',
  arbeidsgiverId: '32847889234234233',
  arbeidsforholdId: '3534gggg4g45',
  eksternArbeidsforholdId: '234567',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforholdEtterStp = {
  arbeidsgiverNavn: 'Virksomheten',
  arbeidsgiverId: '3284788923',
  arbeidsforholdId: '321378huda7e2',
  eksternArbeidsforholdId: '345678',
  startdato: '2018-05-01',
  opphoersdato: '2019-01-01',
};

const lagArbeidstakerAndelEtterStp = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandlingPrAar,
  beregnetPrAar, fordeltPrAar, refusjonskravPrAar, belopFraInntektsmeldingPrAar,
  refusjonskravFraInntektsmeldingPrAar, andelIArbeid) => ({
  arbeidsforhold: arbeidsforholdEtterStp,
  aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  inntektskategori: { kode: 'ARBEIDSTAKER' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandlingPrAar,
  beregnetPrAar,
  fordeltPrAar,
  refusjonskravPrAar,
  belopFraInntektsmeldingPrAar,
  refusjonskravFraInntektsmeldingPrAar,
  nyttArbeidsforhold: true,
});

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === aktivitetStatuser.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }
  if (kodeverk.kode === aktivitetStatuser.FRILANSER) {
    return 'Frilanser';
  }
  if (kodeverk.kode === aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE) {
    return 'Selvstendig næringsdrivende';
  }
  return '';
};

const lagArbeidstakerAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandlingPrAar,
  beregnetPrAar, fordeltPrAar, refusjonskravPrAar, belopFraInntektsmeldingPrAar,
  refusjonskravFraInntektsmeldingPrAar, andelIArbeid) => ({
  arbeidsforhold,
  aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  inntektskategori: { kode: 'ARBEIDSTAKER' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandlingPrAar,
  fordeltPrAar,
  beregnetPrAar,
  refusjonskravPrAar,
  belopFraInntektsmeldingPrAar,
  refusjonskravFraInntektsmeldingPrAar,
});

const lagSNAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandlingPrAar,
  beregnetPrAar, fordeltPrAar, andelIArbeid) => ({
  arbeidsforhold,
  aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, navn: 'Selvstendig næringsdrivende' },
  inntektskategori: { kode: 'SN' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandlingPrAar,
  beregnetPrAar,
  fordeltPrAar,
  refusjonskravPrAar: null,
  belopFraInntektsmeldingPrAar: null,
  refusjonskravFraInntektsmeldingPrAar: null,
});

const lagFLAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandlingPrAar,
  beregnetPrAar, fordeltPrAar, andelIArbeid) => ({
  aktivitetStatus: { kode: aktivitetStatuser.FRILANSER, navn: 'Frilanser' },
  inntektskategori: { kode: 'SN' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandlingPrAar,
  beregnetPrAar,
  fordeltPrAar,
  refusjonskravPrAar: null,
  belopFraInntektsmeldingPrAar: null,
  refusjonskravFraInntektsmeldingPrAar: null,
});

describe('<FordelBeregningsgrunnlagPeriodePanel>', () => {
  it('skal sette initial values', () => {
    const periode = {
      skalRedigereInntekt: true,
      skalPreutfyllesMedBeregningsgrunnlag: false,
      skalKunneEndreRefusjon: true,
      fordelBeregningsgrunnlagAndeler: [
        lagArbeidstakerAndel(1, false, 10000, 10000, null, 10000, 10000, 10000, [0, 20]),
        lagArbeidstakerAndel(2, false, 20000, 10000, 10000, 10000, 20000, 10000, [0]),
        lagArbeidstakerAndel(3, false, 30000, 10000, 30000, 0, 30000, 0, [0, 20, 80]),
        lagArbeidstakerAndel(4, false, null, 1000, null, 0, null, null, [0, 20]),
        lagArbeidstakerAndelEtterStp(5, false, 20000, null, 10000, 10000, 20000, 10000, [0]),
        lagSNAndel(6, false, null, 10000, 10000, [0]),
        lagArbeidstakerAndel(7, false, null, 1000, null, null, null, null, [0]),
        lagFLAndel(8, false, null, null, null, [0]),
        lagFLAndel(9, false, null, 0, null, [0])],
    };

    const bgPeriode = {
      beregningsgrunnlagPrStatusOgAndel: [
        {
          andelsnr: 1,
          aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
          belopPrAarEtterAOrdningen: 100,
          arbeidsforhold,
          beregnetPrAar: 10000,
          bruttoPrAar: 10000,
        },
        {
          andelsnr: 2,
          aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
          belopPrAarEtterAOrdningen: 100,
          arbeidsforhold,
          beregnetPrAar: 10000,
          overstyrtPrAar: 20000,
          bruttoPrAar: 20000,
        },
        {
          andelsnr: 3,
          aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
          belopPrAarEtterAOrdningen: 100,
          arbeidsforhold,
          beregnetPrAar: 10000,
          overstyrtPrAar: 30000,
          bruttoPrAar: 30000,
        },
        {
          andelsnr: 4,
          aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
          belopPrAarEtterAOrdningen: 1000,
          arbeidsforhold,
          beregnetPrAar: 1000,
          overstyrtPrAar: null,
          bruttoPrAar: 1000,
        },
        {
          andelsnr: 5,
          aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
          belopPrAarEtterAOrdningen: 1000,
          arbeidsforhold: arbeidsforholdEtterStp,
          beregnetPrAar: null,
          overstyrtPrAar: null,
          bruttoPrAar: null,
        },
        {
          andelsnr: 6,
          aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE },
          beregnetPrAar: 10000,
          overstyrtPrAar: null,
          bruttoPrAar: 10000,
        },
        {
          andelsnr: 7,
          aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
          arbeidsforhold: arbeidsforhold2,
          belopPrAarEtterAOrdningen: 40000,
          beregnetPrAar: 1000,
          overstyrtPrAar: null,
          bruttoPrAar: 1000,
        },
        { andelsnr: 8, aktivitetStatus: { kode: aktivitetStatuser.FRILANSER }, belopPrAarEtterAOrdningen: null },
        {
          andelsnr: 9,
          aktivitetStatus: { kode: aktivitetStatuser.FRILANSER },
          belopPrAarEtterAOrdningen: null,
          beregnetPrAar: 0,
        },
      ],
    };

    const initialValues = FordelBeregningsgrunnlagPeriodePanel.buildInitialValues(periode, bgPeriode, stpBeregning, false, getKodeverknavn);
    expect(initialValues).to.have.length(9);
    const arbeidstakerAndelerBeforeStp = initialValues.filter(({ arbeidsperiodeFom }) => arbeidsperiodeFom !== ''
    && moment(arbeidsperiodeFom).isBefore(moment(stpBeregning)))
      .filter(({ aktivitetStatus }) => aktivitetStatus === 'AT');
    expect(arbeidstakerAndelerBeforeStp).to.have.length(5);
    arbeidstakerAndelerBeforeStp.forEach((initialValue) => {
      expect(initialValue.andel).to.equal('Virksomheten (3284788923)...2345');
      expect(initialValue.aktivitetStatus).to.equal('AT');
      expect(initialValue.nyAndel).to.equal(false);
      expect(initialValue.lagtTilAvSaksbehandler).to.equal(false);
      expect(initialValue.inntektskategori).to.equal('ARBEIDSTAKER');
      expect(initialValue.arbeidsforholdId).to.equal('321378huda7e2');
      expect(initialValue.arbeidsperiodeFom).to.equal('2017-01-01');
      expect(initialValue.arbeidsperiodeTom).to.equal('2018-01-01');
      expect(initialValue.skalRedigereInntekt).to.equal(true);
    });
    const SNAndel = initialValues.filter(({ aktivitetStatus }) => aktivitetStatus === 'SN');
    expect(SNAndel).to.have.length(1);
    expect(SNAndel[0].andel).to.equal('Selvstendig næringsdrivende');
    expect(SNAndel[0].aktivitetStatus).to.equal('SN');
    expect(SNAndel[0].nyAndel).to.equal(false);
    expect(SNAndel[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(SNAndel[0].inntektskategori).to.equal('SN');
    expect(SNAndel[0].skalRedigereInntekt).to.equal(true);

    const andelerEtterStp = initialValues.filter(({ nyttArbeidsforhold }) => nyttArbeidsforhold);

    expect(andelerEtterStp).to.have.length(1);
    expect(andelerEtterStp[0].andel).to.equal('Virksomheten (3284788923)...5678');
    expect(andelerEtterStp[0].aktivitetStatus).to.equal('AT');
    expect(andelerEtterStp[0].nyAndel).to.equal(false);
    expect(andelerEtterStp[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(andelerEtterStp[0].inntektskategori).to.equal('ARBEIDSTAKER');
    expect(andelerEtterStp[0].arbeidsforholdId).to.equal('321378huda7e2');
    expect(andelerEtterStp[0].arbeidsperiodeFom).to.equal('2018-05-01');
    expect(andelerEtterStp[0].arbeidsperiodeTom).to.equal('2019-01-01');
    expect(andelerEtterStp[0].skalRedigereInntekt).to.equal(true);

    expect(initialValues[0].andelsnr).to.equal(1);
    expect(initialValues[0].andelIArbeid).to.equal('0 - 20');
    expect(initialValues[0].fordelingForrigeBehandling).to.equal('10 000');
    expect(initialValues[0].fastsattBelop).to.equal('');
    expect(initialValues[0].readOnlyBelop).to.equal('10 000');
    expect(initialValues[0].refusjonskrav).to.equal('10 000');
    expect(initialValues[0].belopFraInntektsmelding).to.equal(10000);
    expect(initialValues[0].refusjonskravFraInntektsmelding).to.equal(10000);
    expect(initialValues[0].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[0].beregningsgrunnlagPrAar).to.equal('10 000');

    expect(initialValues[1].andelsnr).to.equal(2);
    expect(initialValues[1].andelIArbeid).to.equal('0.00');
    expect(initialValues[1].fordelingForrigeBehandling).to.equal('20 000');
    expect(initialValues[1].fastsattBelop).to.equal('10 000');
    expect(initialValues[1].readOnlyBelop).to.equal('20 000');
    expect(initialValues[1].refusjonskrav).to.equal('10 000');
    expect(initialValues[1].belopFraInntektsmelding).to.equal(20000);
    expect(initialValues[1].refusjonskravFraInntektsmelding).to.equal(10000);
    expect(initialValues[1].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[1].beregningsgrunnlagPrAar).to.equal('20 000');

    expect(initialValues[2].andelsnr).to.equal(3);
    expect(initialValues[2].andelIArbeid).to.equal('0 - 80');
    expect(initialValues[2].fordelingForrigeBehandling).to.equal('30 000');
    expect(initialValues[2].fastsattBelop).to.equal('30 000');
    expect(initialValues[2].readOnlyBelop).to.equal('30 000');
    expect(initialValues[2].refusjonskrav).to.equal('0');
    expect(initialValues[2].belopFraInntektsmelding).to.equal(30000);
    expect(initialValues[2].refusjonskravFraInntektsmelding).to.equal(0);
    expect(initialValues[2].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[2].beregningsgrunnlagPrAar).to.equal('30 000');

    expect(initialValues[3].andelsnr).to.equal(4);
    expect(initialValues[3].andelIArbeid).to.equal('0 - 20');
    expect(initialValues[3].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[3].fastsattBelop).to.equal('');
    expect(initialValues[3].readOnlyBelop).to.equal('1 000');
    expect(initialValues[3].refusjonskrav).to.equal('0');
    expect(initialValues[3].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[3].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[3].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[3].beregningsgrunnlagPrAar).to.equal('1 000');

    expect(initialValues[4].andelsnr).to.equal(5);
    expect(initialValues[4].andelIArbeid).to.equal('0.00');
    expect(initialValues[4].fordelingForrigeBehandling).to.equal('20 000');
    expect(initialValues[4].fastsattBelop).to.equal('10 000');
    expect(initialValues[4].readOnlyBelop).to.equal(null);
    expect(initialValues[4].refusjonskrav).to.equal('10 000');
    expect(initialValues[4].belopFraInntektsmelding).to.equal(20000);
    expect(initialValues[4].refusjonskravFraInntektsmelding).to.equal(10000);
    expect(initialValues[4].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[4].beregningsgrunnlagPrAar).to.equal(null);

    expect(initialValues[5].andelsnr).to.equal(6);
    expect(initialValues[5].andelIArbeid).to.equal('0.00');
    expect(initialValues[5].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[5].fastsattBelop).to.equal('10 000');
    expect(initialValues[5].readOnlyBelop).to.equal('10 000');
    expect(initialValues[5].refusjonskrav).to.equal('');
    expect(initialValues[5].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[5].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[5].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[5].beregningsgrunnlagPrAar).to.equal('10 000');

    expect(initialValues[6].andelsnr).to.equal(7);
    expect(initialValues[6].andelIArbeid).to.equal('0.00');
    expect(initialValues[6].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[6].fastsattBelop).to.equal('');
    expect(initialValues[6].readOnlyBelop).to.equal('1 000');
    expect(initialValues[6].refusjonskrav).to.equal('');
    expect(initialValues[6].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[6].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[6].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[6].beregningsgrunnlagPrAar).to.equal('1 000');

    expect(initialValues[7].andelsnr).to.equal(8);
    expect(initialValues[7].andelIArbeid).to.equal('0.00');
    expect(initialValues[7].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[7].fastsattBelop).to.equal('');
    expect(initialValues[7].readOnlyBelop).to.equal(null);
    expect(initialValues[7].refusjonskrav).to.equal('');
    expect(initialValues[7].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[7].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[7].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[7].beregningsgrunnlagPrAar).to.equal(null);

    expect(initialValues[8].andelsnr).to.equal(9);
    expect(initialValues[8].andelIArbeid).to.equal('0.00');
    expect(initialValues[8].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[8].fastsattBelop).to.equal('');
    expect(initialValues[8].readOnlyBelop).to.equal('0');
    expect(initialValues[8].refusjonskrav).to.equal('');
    expect(initialValues[8].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[8].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[8].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[8].beregningsgrunnlagPrAar).to.equal('0');
  });
});
