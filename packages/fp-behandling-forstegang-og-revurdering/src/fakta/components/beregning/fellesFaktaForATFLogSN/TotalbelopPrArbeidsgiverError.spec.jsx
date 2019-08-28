import { expect } from 'chai';
import { lagTotalInntektArbeidsforholdList } from './TotalbelopPrArbeidsgiverError';

const arbeidsgiver1 = {
  andel: 'Statoil AS (123456789)',
  arbeidsgiverNavn: 'Statoil AS',
  arbeidsgiverId: '123456789',
  arbeidsperiodeFom: '2017-01-01',
  registerInntekt: '20 000',
  belopFraInntektsmelding: 20000,
};

const arbeidsgiver1Key = 'Statoil AS (123456789)';

const arbeidsgiver2 = {
  andel: 'Sopra Steria AS (9987432724)',
  arbeidsgiverNavn: 'Sopra Steria AS',
  arbeidsgiverId: '9987432724',
  arbeidsperiodeFom: '2019-01-01',
  registerInntekt: '30 000',
  belopFraInntektsmelding: null,
};

const arbeidsgiver2Key = 'Sopra Steria AS (9987432724)';

const arbeidsgiver3 = {
  andel: 'NAV AS (4364634634)',
  arbeidsgiverNavn: 'NAV AS',
  arbeidsgiverId: '4364634634',
  arbeidsperiodeFom: '2019-01-01',
  registerInntekt: '30 000',
  belopFraInntektsmelding: null,
  refusjonskravFraInntektsmelding: 20000,
};

const arbeidsgiver3Key = 'NAV AS (4364634634)';

const frilanser = {
  andel: 'Frilans',
  arbeidsgiverNavn: '',
  arbeidsgiverId: '',
  arbeidsforholdType: { kode: 'FRILANS' },
  arbeidsperiodeFom: '',
  registerInntekt: '30 000',
  belopFraInntektsmelding: null,
};

const frilanserKey = 'Frilans';

describe('<TotalbelopPrArbeidsgiverError>', () => {
  it('skal vise children og skal vise tabell', () => {
    const values = [
      {
        ...arbeidsgiver1,
        fastsattBelop: '10 000',
        inntektskategori: 'ARBEIDSTAKER',
        nyttArbeidsforhold: false,
      },
      {
        ...arbeidsgiver1,
        fastsattBelop: '20 000',
        inntektskategori: 'FRILANSER',
        nyttArbeidsforhold: false,
      },
      {
        ...arbeidsgiver2,
        fastsattBelop: '20 000',
        inntektskategori: 'ARBEIDSTAKER',
        nyttArbeidsforhold: true,
      },
      {
        ...arbeidsgiver3,
        fastsattBelop: '20 000',
        inntektskategori: 'ARBEIDSTAKER',
        nyttArbeidsforhold: false,
      },
      {
        ...frilanser,
        fastsattBelop: '20 000',
        inntektskategori: 'FRILANSER',
        nyttArbeidsforhold: false,
      },
    ];

    const skalValidereMotRefusjon = (andel) => andel.arbeidsgiverId === '4364634634';

    const inntektPrArbeidsforholdList = lagTotalInntektArbeidsforholdList(values, () => true, skalValidereMotRefusjon);
    expect(inntektPrArbeidsforholdList.length).to.equal(4);
    const inntektForArbeidsgiver1 = inntektPrArbeidsforholdList.find(({ key }) => key === arbeidsgiver1Key);
    expect(inntektForArbeidsgiver1.fastsattBelop).to.equal(30000);
    expect(inntektForArbeidsgiver1.registerInntekt).to.equal(20000);
    expect(inntektForArbeidsgiver1.belopFraInntektsmelding).to.equal(20000);
    expect(inntektForArbeidsgiver1.beforeStp).to.equal(true);

    const inntektForArbeidsgiver2 = inntektPrArbeidsforholdList.find(({ key }) => key === arbeidsgiver2Key);
    expect(inntektForArbeidsgiver2.fastsattBelop).to.equal(20000);
    expect(inntektForArbeidsgiver2.registerInntekt).to.equal(30000);
    expect(inntektForArbeidsgiver2.belopFraInntektsmelding).to.equal(null);
    expect(inntektForArbeidsgiver2.beforeStp).to.equal(false);


    const inntektForArbeidsgiver3 = inntektPrArbeidsforholdList.find(({ key }) => key === arbeidsgiver3Key);
    expect(inntektForArbeidsgiver3.fastsattBelop).to.equal(20000);
    expect(inntektForArbeidsgiver3.registerInntekt).to.equal(30000);
    expect(inntektForArbeidsgiver3.belopFraInntektsmelding).to.equal(null);
    expect(inntektForArbeidsgiver3.refusjonskrav).to.equal(20000);
    expect(inntektForArbeidsgiver3.validerMotRefusjon).to.equal(true);
    expect(inntektForArbeidsgiver3.beforeStp).to.equal(true);


    const inntektForFrilans = inntektPrArbeidsforholdList.find(({ key }) => key === frilanserKey);
    expect(inntektForFrilans.fastsattBelop).to.equal(20000);
    expect(inntektForFrilans.registerInntekt).to.equal(30000);
    expect(inntektForFrilans.belopFraInntektsmelding).to.equal(undefined);
    expect(inntektForFrilans.beforeStp).to.equal(true);
  });
});
