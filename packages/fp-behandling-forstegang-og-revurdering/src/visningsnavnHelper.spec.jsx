import { expect } from 'chai';
import { createVisningsnavnForAktivitet } from './visningsnavnHelper';

const andelUtenNavn = {
  arbeidsforholdType: {
    navn: 'Arbeidstaker',
  },
  arbeidsforholdId: '123',
  arbeidsgiverId: '321',
};

const andelUtenArbeidsforholdId = {
  arbeidsforholdType: {
    navn: 'Arbeidstaker',
  },
  arbeidsgiverNavn: 'Andeby bank',
  arbeidsgiverId: '321',
};

const andelMedAlt = {
  arbeidsforholdType: {
    navn: 'Arbeidstaker',
  },
  arbeidsgiverNavn: 'Andeby bank',
  arbeidsgiverId: '321',
  arbeidsforholdId: '999888777',
};

describe('visningsnavnHelper', () => {
  it('skal lage visningsnavn når vi mangler navn på bedrift', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelUtenNavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Arbeidstaker');
  });

  it('skal lage visningsnavn når vi mangler arbeidsforholdId', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelUtenArbeidsforholdId);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321)');
  });

  it('skal lage visningsnavn når vi ikke mangler noe', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelMedAlt);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321) ...8777');
  });
});
