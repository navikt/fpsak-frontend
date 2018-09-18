import { expect } from 'chai';
import createVisningsnavnForAktivitet from './arbeidsforholdUtil';

const andelUtenNavn = {
  arbeidsforholdType: {
    navn: 'Arbeidstaker',
  },
  arbeidsforholdId: '123',
  virksomhetId: '321',
};

const andelUtenArbeidsforholdId = {
  arbeidsforholdType: {
    navn: 'Arbeidstaker',
  },
  virksomhetNavn: 'Andeby bank',
  virksomhetId: '321',
};

const andelMedAlt = {
  arbeidsforholdType: {
    navn: 'Arbeidstaker',
  },
  virksomhetNavn: 'Andeby bank',
  virksomhetId: '321',
  arbeidsforholdId: '999888777',
};


it('skal lage visningsnavn når vi mangler navn på bedrift', () => {
  const virksomhetNavnOrgnr = createVisningsnavnForAktivitet(andelUtenNavn);
  expect(virksomhetNavnOrgnr).to.equal('Arbeidstaker');
});

it('skal lage visningsnavn når vi mangler arbeidsforholdId', () => {
  const virksomhetNavnOrgnr = createVisningsnavnForAktivitet(andelUtenArbeidsforholdId);
  expect(virksomhetNavnOrgnr).to.equal('Andeby bank (321)');
});

it('skal lage visningsnavn når vi ikke mangler noe', () => {
  const virksomhetNavnOrgnr = createVisningsnavnForAktivitet(andelMedAlt);
  expect(virksomhetNavnOrgnr).to.equal('Andeby bank (321) ...8777');
});
