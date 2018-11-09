import { expect } from 'chai';
import EndringBereningsgrunnlagPeriodePanel from './EndringBeregningsgrunnlagPeriodePanel';

const lagArbeidstakerAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandling,
  beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler, refusjonskrav, belopFraInntektsmelding,
  refusjonskravFraInntektsmelding, andelIArbeid) => ({
  arbeidsforhold: {
    arbeidsgiverNavn: 'Virksomheten',
    arbeidsgiverId: '3284788923',
    arbeidsforholdId: '321378huda7e2',
    startdato: '2017-01-01',
    opphoersdato: '2018-01-01',
  },
  aktivitetStatus: { kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' },
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


describe('<EndringBereningsgrunnlagPeriodePanel>', () => {
  it('skal sette initial values', () => {
    const periode = {
      harPeriodeAarsakGraderingEllerRefusjon: true,
      skalKunneEndreRefusjon: true,
      endringBeregningsgrunnlagAndeler: [
        lagArbeidstakerAndel(1, false, 10000, null, null, false, 10000, 10000, 10000, [0, 20]),
        lagArbeidstakerAndel(2, false, 20000, 10000, 10000, true, 10000, 20000, 10000, [0]),
        lagArbeidstakerAndel(3, false, 30000, null, 30000, false, 0, 30000, 0, [0, 20, 80]),
        lagArbeidstakerAndel(4, false, null, null, null, false, 0, null, null, [0, 20])],
    };

    const initialValues = EndringBereningsgrunnlagPeriodePanel.buildInitialValues(periode);
    expect(initialValues).to.have.length(4);
    initialValues.forEach((initialValue) => {
      expect(initialValue.andel).to.equal('Virksomheten (3284788923) ...a7e2');
      expect(initialValue.aktivitetStatus).to.equal('ARBEIDSTAKER');
      expect(initialValue.nyAndel).to.equal(false);
      expect(initialValue.lagtTilAvSaksbehandler).to.equal(false);
      expect(initialValue.inntektskategori).to.equal('ARBEIDSTAKER');
      expect(initialValue.arbeidsforholdId).to.equal('321378huda7e2');
      expect(initialValue.arbeidsperiodeFom).to.equal('2017-01-01');
      expect(initialValue.arbeidsperiodeTom).to.equal('2018-01-01');
      expect(initialValue.skalKunneEndreRefusjon).to.equal(true);
      expect(initialValue.harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);
    });

    expect(initialValues[0].andelsnr).to.equal(1);
    expect(initialValues[0].andelIArbeid).to.equal('0 - 20');
    expect(initialValues[0].fordelingForrigeBehandling).to.equal('10 000');
    expect(initialValues[0].fastsattBeløp).to.equal('');
    expect(initialValues[0].refusjonskrav).to.equal('10 000');
    expect(initialValues[0].belopFraInntektsmelding).to.equal(10000);
    expect(initialValues[0].refusjonskravFraInntektsmelding).to.equal(10000);

    expect(initialValues[1].andelsnr).to.equal(2);
    expect(initialValues[1].andelIArbeid).to.equal('0.00');
    expect(initialValues[1].fordelingForrigeBehandling).to.equal('20 000');
    expect(initialValues[1].fastsattBeløp).to.equal('10 000');
    expect(initialValues[1].refusjonskrav).to.equal('10 000');
    expect(initialValues[1].belopFraInntektsmelding).to.equal(20000);
    expect(initialValues[1].refusjonskravFraInntektsmelding).to.equal(10000);

    expect(initialValues[2].andelsnr).to.equal(3);
    expect(initialValues[2].andelIArbeid).to.equal('0 - 80');
    expect(initialValues[2].fordelingForrigeBehandling).to.equal('30 000');
    expect(initialValues[2].fastsattBeløp).to.equal('30 000');
    expect(initialValues[2].refusjonskrav).to.equal('0');
    expect(initialValues[2].belopFraInntektsmelding).to.equal(30000);
    expect(initialValues[2].refusjonskravFraInntektsmelding).to.equal(0);

    expect(initialValues[3].andelsnr).to.equal(4);
    expect(initialValues[3].andelIArbeid).to.equal('0 - 20');
    expect(initialValues[3].fordelingForrigeBehandling).to.equal('');
    expect(initialValues[3].fastsattBeløp).to.equal('');
    expect(initialValues[3].refusjonskrav).to.equal('0');
    expect(initialValues[3].belopFraInntektsmelding).to.equal(null);
    expect(initialValues[3].refusjonskravFraInntektsmelding).to.equal(null);
  });
});
