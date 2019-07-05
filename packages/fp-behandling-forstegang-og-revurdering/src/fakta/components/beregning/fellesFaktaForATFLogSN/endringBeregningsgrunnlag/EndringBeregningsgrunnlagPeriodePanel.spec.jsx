import { expect } from 'chai';
import moment from 'moment';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import EndringBeregningsgrunnlagPeriodePanel from './EndringBeregningsgrunnlagPeriodePanel';

const stpBeregning = '2018-01-01';

const arbeidsforhold = {
  arbeidsgiverNavn: 'Virksomheten',
  arbeidsgiverId: '3284788923',
  arbeidsforholdId: '321378huda7e2',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforhold2 = {
  arbeidsgiverNavn: 'Virksomheten 2',
  arbeidsgiverId: '32847889234234233',
  arbeidsforholdId: '3534gggg4g45',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforholdEtterStp = {
  arbeidsgiverNavn: 'Virksomheten',
  arbeidsgiverId: '3284788923',
  arbeidsforholdId: '321378huda7e2',
  startdato: '2018-05-01',
  opphoersdato: '2019-01-01',
};

const lagArbeidstakerAndelEtterStp = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandling,
  beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler, refusjonskrav, belopFraInntektsmelding,
  refusjonskravFraInntektsmelding, andelIArbeid) => ({
  arbeidsforhold: arbeidsforholdEtterStp,
  aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  inntektskategori: { kode: 'ARBEIDSTAKER' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandling,
  beregnetPrMnd,
  fastsattForrige,
  fastsattAvSaksbehandler,
  refusjonskrav,
  belopFraInntektsmelding,
  refusjonskravFraInntektsmelding,
  nyttArbeidsforhold: true,
});

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === aktivitetStatuser.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }
  if (kodeverk.kode === aktivitetStatuser.FRILANSER) {
    return 'Frilanser';
  }

  return '';
};

const lagArbeidstakerAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandling,
  beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler, refusjonskrav, belopFraInntektsmelding,
  refusjonskravFraInntektsmelding, andelIArbeid) => ({
  arbeidsforhold,
  aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  inntektskategori: { kode: 'ARBEIDSTAKER' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandling,
  beregnetPrMnd,
  fastsattForrige,
  fastsattAvSaksbehandler,
  refusjonskrav,
  belopFraInntektsmelding,
  refusjonskravFraInntektsmelding,
});

const lagSNAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandling,
  beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler, refusjonskrav, belopFraInntektsmelding,
  refusjonskravFraInntektsmelding, andelIArbeid) => ({
  arbeidsforhold,
  aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, navn: 'Selvstendig næringsdrivende' },
  inntektskategori: { kode: 'SN' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandling,
  beregnetPrMnd,
  fastsattForrige,
  fastsattAvSaksbehandler,
  refusjonskrav,
  belopFraInntektsmelding,
  refusjonskravFraInntektsmelding,
});


const lagFLAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandling,
  beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler, refusjonskrav, belopFraInntektsmelding,
  refusjonskravFraInntektsmelding, andelIArbeid) => ({
  aktivitetStatus: { kode: aktivitetStatuser.FRILANSER, navn: 'Frilanser' },
  inntektskategori: { kode: 'SN' },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandling,
  beregnetPrMnd,
  fastsattForrige,
  fastsattAvSaksbehandler,
  refusjonskrav,
  belopFraInntektsmelding,
  refusjonskravFraInntektsmelding,
});

describe('<EndringBeregningsgrunnlagPeriodePanel>', () => {
  it('skal sette initial values', () => {
    const periode = {
      harPeriodeAarsakGraderingEllerRefusjon: true,
      skalKunneEndreRefusjon: true,
      endringBeregningsgrunnlagAndeler: [
        lagArbeidstakerAndel(1, false, 10000, null, null, false, 10000, 10000, 10000, [0, 20]),
        lagArbeidstakerAndel(2, false, 20000, 10000, 10000, true, 10000, 20000, 10000, [0]),
        lagArbeidstakerAndel(3, false, 30000, null, 30000, false, 0, 30000, 0, [0, 20, 80]),
        lagArbeidstakerAndel(4, false, null, null, null, false, 0, null, null, [0, 20]),
        lagArbeidstakerAndelEtterStp(5, false, 20000, 10000, 10000, true, 10000, 20000, 10000, [0]),
        lagSNAndel(6, false, null, 10000, 10000, true, null, null, null, [0]),
        lagArbeidstakerAndel(7, false, null, null, null, false, null, null, null, [0]),
        lagFLAndel(8, false, null, null, null, false, null, null, null, [0], null)],
    };

    const bgPeriode = {
      beregningsgrunnlagPrStatusOgAndel: [
        {
 andelsnr: 1, aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER }, belopPrMndEtterAOrdningen: 100, arbeidsforhold,
},
        {
 andelsnr: 2, aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER }, belopPrMndEtterAOrdningen: 100, arbeidsforhold,
},
        {
 andelsnr: 3, aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER }, belopPrMndEtterAOrdningen: 100, arbeidsforhold,
},
        {
 andelsnr: 4, aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER }, belopPrMndEtterAOrdningen: 1000, arbeidsforhold,
},
        {
 andelsnr: 5, aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER }, belopPrMndEtterAOrdningen: 1000, arbeidsforhold: arbeidsforholdEtterStp,
},
        { andelsnr: 6, aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE } },
        {
 andelsnr: 7, aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER }, arbeidsforhold: arbeidsforhold2, belopPrMndEtterAOrdningen: 40000,
},
        { andelsnr: 8, aktivitetStatus: { kode: aktivitetStatuser.FRILANSER }, belopPrMndEtterAOrdningen: null },
      ],
    };

    const faktaOmBeregning = {
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [
        { andelsnr: 7, inntektPrMnd: null },
      ],
    };

    const initialValues = EndringBeregningsgrunnlagPeriodePanel.buildInitialValues(periode, bgPeriode, stpBeregning, faktaOmBeregning, getKodeverknavn, {});
    expect(initialValues).to.have.length(7);
    const arbeidstakerAndelerBeforeStp = initialValues.filter(({ arbeidsperiodeFom }) => arbeidsperiodeFom !== ''
    && moment(arbeidsperiodeFom).isBefore(moment(stpBeregning)));
    expect(arbeidstakerAndelerBeforeStp).to.have.length(5);
    arbeidstakerAndelerBeforeStp.forEach((initialValue) => {
      expect(initialValue.andel).to.equal('Virksomheten (3284788923) ...a7e2');
      expect(initialValue.aktivitetStatus).to.equal('AT');
      expect(initialValue.nyAndel).to.equal(false);
      expect(initialValue.lagtTilAvSaksbehandler).to.equal(false);
      expect(initialValue.inntektskategori).to.equal('ARBEIDSTAKER');
      expect(initialValue.arbeidsforholdId).to.equal('321378huda7e2');
      expect(initialValue.arbeidsperiodeFom).to.equal('2017-01-01');
      expect(initialValue.arbeidsperiodeTom).to.equal('2018-01-01');
      expect(initialValue.harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);
    });


    const andelerEtterStp = initialValues.filter(({ nyttArbeidsforhold }) => nyttArbeidsforhold);
    expect(andelerEtterStp).to.have.length(1);
    expect(andelerEtterStp[0].andel).to.equal('Virksomheten (3284788923) ...a7e2');
    expect(andelerEtterStp[0].aktivitetStatus).to.equal('AT');
    expect(andelerEtterStp[0].nyAndel).to.equal(false);
    expect(andelerEtterStp[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(andelerEtterStp[0].inntektskategori).to.equal('ARBEIDSTAKER');
    expect(andelerEtterStp[0].arbeidsforholdId).to.equal('321378huda7e2');
    expect(andelerEtterStp[0].arbeidsperiodeFom).to.equal('2018-05-01');
    expect(andelerEtterStp[0].arbeidsperiodeTom).to.equal('2019-01-01');
    expect(andelerEtterStp[0].harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);

    expect(initialValues[0].andelsnr).to.equal(1);
    expect(initialValues[0].andelIArbeid).to.equal('0 - 20');
    expect(initialValues[0].fordelingForrigeBehandling).to.equal('10 000');
    expect(initialValues[0].fastsattBelop).to.equal('');
    expect(initialValues[0].refusjonskrav).to.equal('10 000');
    expect(initialValues[0].belopFraInntektsmelding).to.equal(10000);
    expect(initialValues[0].refusjonskravFraInntektsmelding).to.equal(10000);
    expect(initialValues[0].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[0].registerInntekt).to.equal('10 000');

    expect(initialValues[1].andelsnr).to.equal(2);
    expect(initialValues[1].andelIArbeid).to.equal('0.00');
    expect(initialValues[1].fordelingForrigeBehandling).to.equal('20 000');
    expect(initialValues[1].fastsattBelop).to.equal('10 000');
    expect(initialValues[1].refusjonskrav).to.equal('10 000');
    expect(initialValues[1].belopFraInntektsmelding).to.equal(20000);
    expect(initialValues[1].refusjonskravFraInntektsmelding).to.equal(10000);
    expect(initialValues[1].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[1].registerInntekt).to.equal('20 000');

    expect(initialValues[2].andelsnr).to.equal(3);
    expect(initialValues[2].andelIArbeid).to.equal('0 - 80');
    expect(initialValues[2].fordelingForrigeBehandling).to.equal('30 000');
    expect(initialValues[2].fastsattBelop).to.equal('30 000');
    expect(initialValues[2].refusjonskrav).to.equal('0');
    expect(initialValues[2].belopFraInntektsmelding).to.equal(30000);
    expect(initialValues[2].refusjonskravFraInntektsmelding).to.equal(0);
    expect(initialValues[2].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[2].registerInntekt).to.equal('30 000');

    expect(initialValues[3].andelsnr).to.equal(4);
    expect(initialValues[3].andelIArbeid).to.equal('0 - 20');
    expect(initialValues[3].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[3].fastsattBelop).to.equal('');
    expect(initialValues[3].refusjonskrav).to.equal('0');
    expect(initialValues[3].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[3].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[3].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[3].registerInntekt).to.equal('1 000');

    expect(initialValues[4].andelsnr).to.equal(5);
    expect(initialValues[4].andelIArbeid).to.equal('0.00');
    expect(initialValues[4].fordelingForrigeBehandling).to.equal('20 000');
    expect(initialValues[4].fastsattBelop).to.equal('10 000');
    expect(initialValues[4].refusjonskrav).to.equal('10 000');
    expect(initialValues[4].belopFraInntektsmelding).to.equal(20000);
    expect(initialValues[4].refusjonskravFraInntektsmelding).to.equal(10000);
    expect(initialValues[4].skalKunneEndreRefusjon).to.equal(true);
    expect(initialValues[4].registerInntekt).to.equal(null);

    expect(initialValues[5].andelsnr).to.equal(7);
    expect(initialValues[5].andelIArbeid).to.equal('0.00');
    expect(initialValues[5].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[5].fastsattBelop).to.equal('');
    expect(initialValues[5].refusjonskrav).to.equal('');
    expect(initialValues[5].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[5].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[5].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[5].registerInntekt).to.equal(null);

    expect(initialValues[6].andelsnr).to.equal(8);
    expect(initialValues[6].andelIArbeid).to.equal('0.00');
    expect(initialValues[6].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[6].fastsattBelop).to.equal('');
    expect(initialValues[6].refusjonskrav).to.equal('');
    expect(initialValues[6].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[6].refusjonskravFraInntektsmelding).to.equal(null);
    expect(initialValues[6].skalKunneEndreRefusjon).to.equal(false);
    expect(initialValues[6].registerInntekt).to.equal(null);
  });
});
