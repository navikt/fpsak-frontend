import { expect } from 'chai';
import { lagTotalInntektArbeidsforholdList } from './TotalbelopPrArbeidsgiverError';


const stpBeregning = '2018-01-01';

const arbeidsgiver1 = {
 arbeidsgiverNavn: 'Statoil AS',
arbeidsgiverId: '123456789',
arbeidsperiodeFom: '2017-01-01',
registerInntekt: '20 000',
belopFraInntektsmelding: 20000,
};

const arbeidsgiver1Key = 'Statoil AS (123456789)';

const arbeidsgiver2 = {
 arbeidsgiverNavn: 'Sopra Steria AS',
arbeidsgiverId: '9987432724',
arbeidsperiodeFom: '2019-01-01',
registerInntekt: '30 000',
belopFraInntektsmelding: null,
};

const arbeidsgiver2Key = 'Sopra Steria AS (9987432724)';

const frilanser = {
 arbeidsgiverNavn: '',
arbeidsgiverId: '',
arbeidsforholdType: { kode: 'FRILANS', navn: 'Frilans' },
arbeidsperiodeFom: '',
registerInntekt: '30 000',
belopFraInntektsmelding: null,
};

const frilanserKey = 'Frilans';

describe('<InntektstabellPanel>', () => {
  it('skal vise children og skal vise tabell', () => {
    const values = [
      {
 ...arbeidsgiver1,
      fastsattBelop: '10 000',
      inntektskategori: 'ARBEIDSTAKER',
     },
     {
 ...arbeidsgiver1,
      fastsattBelop: '20 000',
      inntektskategori: 'FRILANSER',
     },
     {
 ...arbeidsgiver2,
      fastsattBelop: '20 000',
      inntektskategori: 'ARBEIDSTAKER',
     },
     {
 ...frilanser,
      fastsattBelop: '20 000',
      inntektskategori: 'FRILANSER',
     },
    ];

    const inntektPrArbeidsforholdList = lagTotalInntektArbeidsforholdList(values, stpBeregning);
    expect(inntektPrArbeidsforholdList.length).to.equal(3);
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

    const inntektForFrilans = inntektPrArbeidsforholdList.find(({ key }) => key === frilanserKey);
    expect(inntektForFrilans.fastsattBelop).to.equal(20000);
    expect(inntektForFrilans.registerInntekt).to.equal(30000);
    expect(inntektForFrilans.belopFraInntektsmelding).to.equal(undefined);
    expect(inntektForFrilans.beforeStp).to.equal(true);
  });
});