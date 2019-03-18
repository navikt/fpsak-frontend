import { expect } from 'chai';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import KunYtelsePanel, { brukersAndelFieldArrayName } from './KunYtelsePanel';
import { besteberegningField } from './KunYtelseBesteberegningPanel';


describe('<KunYtelsePanel>', () => {
  it('skal transform values riktig', () => {
    const kunYtelse = { fodendeKvinneMedDP: false };
    const andel1 = {
      andelsnr: 1, nyAndel: false, lagtTilAvSaksbehandler: false, fastsattBeløp: '10 000', inntektskategori: inntektskategorier.ARBEIDSTAKER,
    };
    const andel2 = {
      andelsnr: null, nyAndel: true, lagtTilAvSaksbehandler: true, fastsattBeløp: '20 000', inntektskategori: inntektskategorier.SJØMANN,
    };
    const values = {};
    values[`${brukersAndelFieldArrayName}`] = [andel1, andel2];
    const transformedValues = KunYtelsePanel.transformValues(values, kunYtelse);
    expect(transformedValues.kunYtelseFordeling.skalBrukeBesteberegning).to.equal(null);
    expect(transformedValues.kunYtelseFordeling.andeler).to.have.length(2);
    expect(transformedValues.kunYtelseFordeling.andeler[0].andelsnr).to.equal(1);
    expect(transformedValues.kunYtelseFordeling.andeler[0].fastsattBeløp).to.equal(10000);
    expect(transformedValues.kunYtelseFordeling.andeler[0].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(transformedValues.kunYtelseFordeling.andeler[0].nyAndel).to.equal(false);
    expect(transformedValues.kunYtelseFordeling.andeler[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(transformedValues.kunYtelseFordeling.andeler[1].andelsnr).to.equal(null);
    expect(transformedValues.kunYtelseFordeling.andeler[1].fastsattBeløp).to.equal(20000);
    expect(transformedValues.kunYtelseFordeling.andeler[1].inntektskategori).to.equal(inntektskategorier.SJØMANN);
    expect(transformedValues.kunYtelseFordeling.andeler[1].nyAndel).to.equal(true);
    expect(transformedValues.kunYtelseFordeling.andeler[1].lagtTilAvSaksbehandler).to.equal(true);
  });


  it('skal bygge initial values', () => {
    const andel1 = {
      andelsnr: 1,
      fastsattBelopPrMnd: null,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: inntektskategorier.UDEFINERT },
      aktivitetStatus: { kode: 'BA', navn: 'Brukers andel' },
    };
    const andel2 = {
      andelsnr: 2,
      fastsattBelopPrMnd: 10000,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: inntektskategorier.ARBEIDSTAKER },
      aktivitetStatus: { kode: 'BA', navn: 'Brukers andel' },
    };
    const kunYtelse = {
      andeler: [andel1, andel2],
    };
    const initialValues = KunYtelsePanel.buildInitialValues(kunYtelse);
    const andeler = initialValues[`${brukersAndelFieldArrayName}`];
    expect(andeler).to.have.length(2);
    expect(andeler[0].andelsnr).to.equal(1);
    expect(andeler[0].andel).to.equal('Brukers andel');
    expect(andeler[0].aktivitetStatus).to.equal('BA');
    expect(andeler[0].fastsattBeløp).to.equal('');
    expect(andeler[0].inntektskategori).to.equal('');
    expect(andeler[0].nyAndel).to.equal(false);
    expect(andeler[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(andeler[1].andelsnr).to.equal(2);
    expect(andeler[1].andel).to.equal('Brukers andel');
    expect(andeler[1].fastsattBeløp).to.equal('10 000');
    expect(andeler[1].aktivitetStatus).to.equal('BA');
    expect(andeler[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(andeler[1].nyAndel).to.equal(false);
    expect(andeler[1].lagtTilAvSaksbehandler).to.equal(true);
  });

  it('skal bygge initial values med besteberegning', () => {
    const andel1 = {
      andelsnr: 1,
      fastsattBelopPrMnd: null,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: inntektskategorier.UDEFINERT },
      aktivitetStatus: { kode: 'BA', navn: 'Brukers andel' },
    };
    const andel2 = {
      andelsnr: 2,
      fastsattBelopPrMnd: 10000,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: inntektskategorier.ARBEIDSTAKER },
      aktivitetStatus: { kode: 'BA', navn: 'Brukers andel' },
    };
    const kunYtelse = {
      andeler: [andel1, andel2],
      fodendeKvinneMedDP: true,
      erBesteberegning: true,
    };
    const initialValues = KunYtelsePanel.buildInitialValues(kunYtelse);
    const andeler = initialValues[`${brukersAndelFieldArrayName}`];
    expect(andeler).to.have.length(2);
    expect(andeler[0].andelsnr).to.equal(1);
    expect(andeler[0].andel).to.equal('Brukers andel');
    expect(andeler[0].aktivitetStatus).to.equal('BA');
    expect(andeler[0].fastsattBeløp).to.equal('');
    expect(andeler[0].inntektskategori).to.equal('');
    expect(andeler[0].nyAndel).to.equal(false);
    expect(andeler[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(andeler[1].andelsnr).to.equal(2);
    expect(andeler[1].andel).to.equal('Brukers andel');
    expect(andeler[1].fastsattBeløp).to.equal('10 000');
    expect(andeler[1].aktivitetStatus).to.equal('BA');
    expect(andeler[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(andeler[1].nyAndel).to.equal(false);
    expect(andeler[1].lagtTilAvSaksbehandler).to.equal(true);

    const erBesteberegning = initialValues[`${besteberegningField}`];
    expect(erBesteberegning).to.equal(true);
  });

  it('skal bygge initial values uten besteberegning', () => {
    const andel1 = {
      andelsnr: 1,
      fastsattBelopPrMnd: null,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: inntektskategorier.UDEFINERT },
      aktivitetStatus: { kode: 'BA', navn: 'Brukers andel' },
    };
    const andel2 = {
      andelsnr: 2,
      fastsattBelopPrMnd: 10000,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: inntektskategorier.ARBEIDSTAKER },
      aktivitetStatus: { kode: 'BA', navn: 'Brukers andel' },
    };
    const kunYtelse = {
      andeler: [andel1, andel2],
      fodendeKvinneMedDP: true,
      erBesteberegning: false,
    };
    const initialValues = KunYtelsePanel.buildInitialValues(kunYtelse);
    const andeler = initialValues[`${brukersAndelFieldArrayName}`];
    expect(andeler).to.have.length(2);
    expect(andeler[0].andelsnr).to.equal(1);
    expect(andeler[0].andel).to.equal('Brukers andel');
    expect(andeler[0].aktivitetStatus).to.equal('BA');
    expect(andeler[0].fastsattBeløp).to.equal('');
    expect(andeler[0].inntektskategori).to.equal('');
    expect(andeler[0].nyAndel).to.equal(false);
    expect(andeler[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(andeler[1].andelsnr).to.equal(2);
    expect(andeler[1].andel).to.equal('Brukers andel');
    expect(andeler[1].fastsattBeløp).to.equal('10 000');
    expect(andeler[1].aktivitetStatus).to.equal('BA');
    expect(andeler[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(andeler[1].nyAndel).to.equal(false);
    expect(andeler[1].lagtTilAvSaksbehandler).to.equal(true);

    const erBesteberegning = initialValues[`${besteberegningField}`];
    expect(erBesteberegning).to.equal(false);
  });
});
