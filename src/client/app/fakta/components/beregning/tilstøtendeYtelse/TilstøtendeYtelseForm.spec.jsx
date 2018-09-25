import { expect } from 'chai';
import inntektskategorier from '@fpsak-frontend/kodeverk/inntektskategorier';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/beregningsgrunnlagAndeltyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/aksjonspunktCodes';
import { TilstotendeYtelseFormImpl, getAndelsnr } from './TilstøtendeYtelseForm';
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
    const transformedValues = TilstotendeYtelseFormImpl.transformValues(values, 'begrunnelse', faktor);
    expect(transformedValues.begrunnelse).to.equal('begrunnelse');
    expect(transformedValues.kode).to
      .equal(aksjonspunktCodes.AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE);
    expect(transformedValues.tilstøtendeYtelseAndeler).to.have.length(2);
    expect(transformedValues.tilstøtendeYtelseAndeler[0].andel).to.equal('ArbeidsforholdNavn (213819)');
    expect(transformedValues.tilstøtendeYtelseAndeler[0].andelsnr).to.equal(1);
    expect(transformedValues.tilstøtendeYtelseAndeler[0].arbeidsforholdId).to.equal(213819);
    expect(transformedValues.tilstøtendeYtelseAndeler[0].reduserendeFaktor).to.equal(0.8);
    expect(transformedValues.tilstøtendeYtelseAndeler[0].fastsattBeløp).to.equal(10000);
    expect(transformedValues.tilstøtendeYtelseAndeler[0].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(transformedValues.tilstøtendeYtelseAndeler[0].nyAndel).to.equal(false);

    expect(transformedValues.tilstøtendeYtelseAndeler[1].andel).to.equal('ArbeidsforholdNavn (64564)');
    expect(transformedValues.tilstøtendeYtelseAndeler[1].andelsnr).to.equal(2);
    expect(transformedValues.tilstøtendeYtelseAndeler[1].arbeidsforholdId).to.equal(64564);
    expect(transformedValues.tilstøtendeYtelseAndeler[1].reduserendeFaktor).to.equal(0.8);
    expect(transformedValues.tilstøtendeYtelseAndeler[1].fastsattBeløp).to.equal(20000);
    expect(transformedValues.tilstøtendeYtelseAndeler[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(transformedValues.tilstøtendeYtelseAndeler[1].nyAndel).to.equal(false);
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
});
