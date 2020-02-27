import { expect } from 'chai';
import { harDuplikateArbeidsforholdFraSammeArbeidsgiver, createArbeidsGiverNavn } from './visningsnavnHelper';

const andelUtenNavn = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsforholdId: '123',
  arbeidsgiverId: '321',
  eksternArbeidsforholdId: '09876',
};

const andelMedAlt = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsgiverNavn: 'Andeby bank',
  arbeidsgiverId: '321',
  arbeidsforholdId: '999888777',
  eksternArbeidsforholdId: '56789',
};

const getKodeverknavn = (kodeverk) => (kodeverk.kode === 'A' ? 'Arbeidstaker' : '');

describe('visningsnavnHelper..', () => {
  it('skal lage visningsnavnForAktivitet når vi mangler navn på bedrift', () => {
    const arbeidsgiverNavnOrgnr = createArbeidsGiverNavn(andelUtenNavn, false, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Arbeidstaker');
  });


  it('skal lage visningsnavnForAktivitet når vi ikke mangler noe', () => {
    const arbeidsgiverNavnOrgnr = createArbeidsGiverNavn(andelMedAlt, false, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank');
  });
  it('skal lage visningsnavnForAktivitet når vi ikke mangler noe og har duplikate arbeidsforehold', () => {
    const arbeidsgiverNavnOrgnr = createArbeidsGiverNavn(andelMedAlt, true, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (...6789)');
  });

  it('skal sjekke om duplikate arbeidsforholdl', () => {
    const mockAndeler = [
      {
        beregningsperiodeFom: '2019-06-01',
        beregningsperiodeTom: '2019-08-31',
        arbeidsforhold: andelMedAlt,
      },
      {
        beregningsperiodeFom: '2019-06-01',
        beregningsperiodeTom: '2019-08-31',
        arbeidsforhold: andelMedAlt,
      },
    ];
    const harduplikate = harDuplikateArbeidsforholdFraSammeArbeidsgiver(mockAndeler);
    expect(harduplikate).to.equal(true);
  });
});
