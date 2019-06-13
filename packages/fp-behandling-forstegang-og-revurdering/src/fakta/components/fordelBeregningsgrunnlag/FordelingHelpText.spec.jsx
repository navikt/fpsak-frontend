import { expect } from 'chai';
import { createEndretArbeidsforholdString, textCase } from './FordelingHelpText';

const fn = () => {};

const arbeidsforhold = [
  {
    arbeidsgiverNavn: 'Sopra Steria',
    arbeidsforholdId: '987654321',
    arbeidsgiverId: '123456789',
    permisjon: {
      permisjonFom: '2016-01-01',
      permisjonTom: '2018-01-01',
    },
    perioderMedGraderingEllerRefusjon: [
      {
        erGradering: true,
        erRefusjon: false,
        fom: '2015-01-01',
        tom: '2025-01-01',
      },
      {
        erGradering: false,
        erRefusjon: true,
        fom: '2016-01-01',
        tom: '2026-01-01',
      },
    ],
  },
];

describe('<FordelingHelpText>', () => {
  it('skal lage endret arbeidsforhold for permisjon', () => {
    const string = createEndretArbeidsforholdString(arbeidsforhold, textCase.PERMISJON, fn);
    expect(string.navnOgOrgnr).to.eql('Sopra Steria (123456789) ...4321');
    expect(string.dato).to.eql('2018-01-01');
  });
  it('skal lage endret arbeidsforhold for gradering', () => {
    const string = createEndretArbeidsforholdString(arbeidsforhold, textCase.GRADERING, fn);
    expect(string).to.eql('Sopra Steria (123456789) ...4321 f.o.m. 01.01.2015 - t.o.m. 01.01.2025');
  });
  it('skal lage endret arbeidsforhold for refusjon', () => {
    const string = createEndretArbeidsforholdString(arbeidsforhold, textCase.REFUSJON, fn);
    expect(string).to.eql('Sopra Steria (123456789) ...4321 f.o.m. 01.01.2016 - t.o.m. 01.01.2026');
  });
});
