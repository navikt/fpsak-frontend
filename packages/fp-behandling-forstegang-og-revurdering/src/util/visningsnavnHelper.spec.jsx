import { expect } from 'chai';
import { createVisningsnavnForAktivitet } from './visningsnavnHelper';

const andelUtenNavn = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsforholdId: '123',
  arbeidsgiverId: '321',
  arbeidsforholdEksternId: '09876',
};

const andelUtenArbeidsforholdId = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsgiverNavn: 'Andeby bank',
  arbeidsgiverId: '321',
};

const andelMedAlt = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsgiverNavn: 'Andeby bank',
  arbeidsgiverId: '321',
  arbeidsforholdId: '999888777',
  arbeidsforholdEksternId: '56789',
};

const getKodeverknavn = (kodeverk) => (kodeverk.kode === 'A' ? 'Arbeidstaker' : '');

describe('visningsnavnHelper', () => {
  it('skal lage visningsnavn når vi mangler navn på bedrift', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelUtenNavn, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Arbeidstaker');
  });

  it('skal lage visningsnavn når vi mangler arbeidsforholdId', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelUtenArbeidsforholdId, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321)');
  });

  it('skal lage visningsnavn når vi ikke mangler noe', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelMedAlt, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321)...6789');
  });
});
