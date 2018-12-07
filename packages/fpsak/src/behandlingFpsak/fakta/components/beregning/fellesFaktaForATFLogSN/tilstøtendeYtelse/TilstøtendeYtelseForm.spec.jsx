import { expect } from 'chai';
import inntektskategorier from 'kodeverk/inntektskategorier';
import beregningsgrunnlagAndeltyper from 'kodeverk/beregningsgrunnlagAndeltyper';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { TilstotendeYtelseFormImpl, getAndelsnr, utledOverskrift } from './TilstøtendeYtelseForm';
import { fordelingAvBruttoBGFieldArrayName } from './FordelingAvBruttoBeregningsgrunnlagPanel';

const buildValues = (andeler) => {
  const initialValues = {};
  initialValues[`${fordelingAvBruttoBGFieldArrayName}`] = andeler;
  return initialValues;
};

const buildAndelFieldValue = (nyAndel, inntektskategori, fastsattBeløp, arbeidsforholdId, andel, andelsnr) => ({
  nyAndel, inntektskategori, fastsattBeløp, arbeidsforholdId, andel, andelsnr,
});

describe('<TilstøtendeYtelseForm>', () => {
  it('skal transform values riktig', () => {
    const andel1 = buildAndelFieldValue(
      false, inntektskategorier.ARBEIDSTAKER, '10 000',
      213819, 'ArbeidsforholdNavn (213819)', 1,
    );
    const andel2 = buildAndelFieldValue(
      false, inntektskategorier.ARBEIDSTAKER, '20 000',
      64564, 'ArbeidsforholdNavn (64564)', 2,
    );
    const values = buildValues([andel1, andel2]);
    const faktor = 0.8;
    const transformedValues = TilstotendeYtelseFormImpl.transformValues(values, faktor);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler).to.have.length(2);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[0].andel).to.equal('ArbeidsforholdNavn (213819)');
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[0].andelsnr).to.equal(1);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[0].arbeidsforholdId).to.equal(213819);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[0].reduserendeFaktor).to.equal(0.8);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[0].fastsattBeløp).to.equal(10000);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[0].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[0].nyAndel).to.equal(false);

    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[1].andel).to.equal('ArbeidsforholdNavn (64564)');
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[1].andelsnr).to.equal(2);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[1].arbeidsforholdId).to.equal(64564);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[1].reduserendeFaktor).to.equal(0.8);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[1].fastsattBeløp).to.equal(20000);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(transformedValues.tilstøtendeYtelse.tilstøtendeYtelseAndeler[1].nyAndel).to.equal(false);
  });


  it('skal finne riktig andelsnr for ny andel med brukers andel', () => {
    const andel = buildAndelFieldValue(
      true, inntektskategorier.ARBEIDSTAKER, '20 000',
      64564, beregningsgrunnlagAndeltyper.BRUKERS_ANDEL, 2,
    );
    const andelsnr = getAndelsnr(andel);
    expect(andelsnr).to.equal(null);
  });

  it('skal finne riktig andelsnr for ny andel for arbeidsforhold', () => {
    const andel = buildAndelFieldValue(
      true, inntektskategorier.ARBEIDSTAKER, '20 000',
      64564, '31', 2,
    );
    const andelsnr = getAndelsnr(andel);
    expect(andelsnr).to.equal('31');
  });

  it('skal finne riktig andelsnr for eksisterende andel', () => {
    const andel = buildAndelFieldValue(
      false, inntektskategorier.ARBEIDSTAKER, '20 000',
      64564, 'ArbeidsforholdNavn (64564)', 2,
    );
    const andelsnr = getAndelsnr(andel);
    expect(andelsnr).to.equal(2);
  });


  it('skal utlede riktig overskrift for tilstøtende ytelse i kombinasjon med kun endret bg', () => {
    const tilfeller = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE, faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const tilstotendeYtelse = { erBesteberegning: false };
    const overskrift = utledOverskrift.resultFunc(tilfeller, tilstotendeYtelse);
    expect(overskrift).to.equal('BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseHeader');
  });

  it('skal utlede riktig overskrift for tilstøtende ytelse i kombinasjon', () => {
    const tilfeller = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const tilstotendeYtelse = { erBesteberegning: false };
    const overskrift = utledOverskrift.resultFunc(tilfeller, tilstotendeYtelse);
    expect(overskrift).to.equal('BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseIKombinasjonHeader');
  });

  it('skal utlede riktig overskrift for tilstøtende ytelse åleine', () => {
    const tilfeller = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE];
    const tilstotendeYtelse = { erBesteberegning: false };
    const overskrift = utledOverskrift.resultFunc(tilfeller, tilstotendeYtelse);
    expect(overskrift).to.equal('BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseHeader');
  });


  it('skal utlede riktig overskrift for tilstøtende ytelse åleine med besteberegning', () => {
    const tilfeller = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE];
    const tilstotendeYtelse = { erBesteberegning: true };
    const overskrift = utledOverskrift.resultFunc(tilfeller, tilstotendeYtelse);
    expect(overskrift).to.equal('BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseBesteberegningHeader');
  });


  it('skal utlede riktig overskrift for tilstøtende ytelse i kombinasjon med besteberegning', () => {
    const tilfeller = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE, faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const tilstotendeYtelse = { erBesteberegning: true };
    const overskrift = utledOverskrift.resultFunc(tilfeller, tilstotendeYtelse);
    expect(overskrift).to.equal('BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseBesteberegningHeader');
  });
});
