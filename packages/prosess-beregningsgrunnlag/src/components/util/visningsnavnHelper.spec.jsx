import { expect } from 'chai';
import { createVisningsnavnForAktivitet, lagVisningsNavn } from './visningsnavnHelper';

const andelUtenNavn = {
  arbeidsforholdType: {
    kode: 'A',
  },
  arbeidsforholdId: '123',
  arbeidsgiverId: '321',
  eksternArbeidsforholdId: '09876',
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
  eksternArbeidsforholdId: '56789',
};

const getKodeverknavn = (kodeverk) => (kodeverk.kode === 'A' ? 'Arbeidstaker' : '');

describe('visningsnavnHelper..', () => {
  it('skal lage visningsnavnForAktivitet når vi mangler navn på bedrift', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelUtenNavn, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Arbeidstaker');
  });

  it('skal lage visningsnavnForAktivitet når vi mangler arbeidsforholdId', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelUtenArbeidsforholdId, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321)');
  });

  it('skal lage visningsnavnForAktivitet når vi ikke mangler noe', () => {
    const arbeidsgiverNavnOrgnr = createVisningsnavnForAktivitet(andelMedAlt, getKodeverknavn);
    expect(arbeidsgiverNavnOrgnr).to.equal('Andeby bank (321)...6789');
  });

  it('skal lage visningsnavn når vi ikke mangler noe', () => {
    const mockProps = {
      navn: 'Navnet',
      fødselsdato: '1980-01-01',
      virksomhet: 'Virksomhet',
      identifikator: 'id',
    };

    const visningsNavn = lagVisningsNavn(mockProps, 'arbId');
    expect(visningsNavn).to.equal('Navnet (id)...rbId');
  });
  it('skal lage visningsnavn uten virksomhet', () => {
    const mockProps = {
      navn: 'Navnet',
      fødselsdato: '1980-01-01',
      virksomhet: undefined,
      identifikator: 'id',
    };
    const visningsNavn = lagVisningsNavn(mockProps, 'arbId');
    expect(visningsNavn).to.equal('Navne...(01.01.1980)');
  });
});
