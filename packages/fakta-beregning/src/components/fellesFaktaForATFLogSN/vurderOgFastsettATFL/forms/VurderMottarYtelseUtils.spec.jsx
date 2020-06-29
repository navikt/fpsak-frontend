import { expect } from 'chai';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  andelsnrMottarYtelseMap,
  finnFrilansFieldName,
  harVurdertMottarYtelse,
  skalFastsetteInntektATUtenInntektsmelding,
  utledArbeidsforholdFieldName,
} from './VurderMottarYtelseUtils';

const arbeidsforhold = {
  arbeidsgiverNavn: 'Virksomheten',
  arbeidsgiverId: '3284788923',
  arbeidsforholdId: '321378huda7e2',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforhold2 = {
  arbeidsgiverNavn: 'Virksomheten2',
  arbeidsgiverId: '843597943435',
  arbeidsforholdId: 'jjisefoosfe',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidsforhold3 = {
  arbeidsgiverNavn: 'Virksomheten2',
  arbeidsgiverId: '843597943435',
  arbeidsforholdId: '5465465464',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const andel = {
  aktivitetStatus: { kode: aktivitetStatus.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  andelsnr: 1,
  inntektPrMnd: 25000,
  arbeidsforhold,
};

const andel2 = {
  aktivitetStatus: { kode: aktivitetStatus.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  andelsnr: 2,
  inntektPrMnd: 25000,
  arbeidsforhold: arbeidsforhold2,
};

const andel3 = {
  aktivitetStatus: { kode: aktivitetStatus.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  andelsnr: 3,
  inntektPrMnd: 25000,
  arbeidsforhold: arbeidsforhold3,
};

const frilansAndel = {
  aktivitetStatus: { kode: aktivitetStatus.FRILANSER, navn: 'Frilans' },
  andelsnr: 4,
};

const arbeidstakerAndelerUtenIM = [
  { ...andel, mottarYtelse: null },
  { ...andel2, mottarYtelse: false },
  { ...andel3, mottarYtelse: true },
];

const beregningsgrunnlag = {
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: [
        andel, andel2, andel3, frilansAndel,
      ],
    },
  ],
};

describe('<VurderMottarYtelseUtils>', () => {
  it('skal returnere false når man ikke har vurdert alle punktene i mottar ytelse for frilans', () => {
    const vurderMottarYtelse = {
      erFrilans: true,
      arbeidstakerAndelerUtenIM: [],
    };
    const values = {};
    values[finnFrilansFieldName()] = null;
    const harVurdert = harVurdertMottarYtelse(values, vurderMottarYtelse);
    expect(harVurdert).to.equal(false);
  });

  it('skal returnere true når man har vurdert alle punktene i mottar ytelse for frilans', () => {
    const vurderMottarYtelse = {
      erFrilans: true,
      arbeidstakerAndelerUtenIM: [],
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    const harVurdert = harVurdertMottarYtelse(values, vurderMottarYtelse);
    expect(harVurdert).to.equal(true);
  });

  it('skal returnere true når man har vurdert alle punktene i mottar ytelse for arbeidstaker uten inntektsmelding', () => {
    const vurderMottarYtelse = {
      erFrilans: false,
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = false;
    const harVurdert = harVurdertMottarYtelse(values, vurderMottarYtelse);
    expect(harVurdert).to.equal(true);
  });

  it('skal returnere false når man har ikkje vurdert alle punktene i mottar ytelse for arbeidstaker uten inntektsmelding', () => {
    const vurderMottarYtelse = {
      erFrilans: false,
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = null;
    const harVurdert = harVurdertMottarYtelse(values, vurderMottarYtelse);
    expect(harVurdert).to.equal(false);
  });

  it('skal returnere tomt objekt om vurderMottarYtelseDto ikkje er tilstades', () => {
    const mottarYtelseMap = andelsnrMottarYtelseMap({}, undefined, undefined);
    expect(mottarYtelseMap).to.be.empty;
  });

  it('skal vurdering av mottar ytelse for arbeidstakerandeler', () => {
    const vurderMottarYtelse = {
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = null;
    const mottarYtelseMap = andelsnrMottarYtelseMap(values, vurderMottarYtelse, beregningsgrunnlag);
    expect(mottarYtelseMap[1]).to.equal(true);
    expect(mottarYtelseMap[2]).to.equal(false);
    expect(mottarYtelseMap[3]).to.equal(null);
  });

  it('skal vurdering av mottar ytelse for arbeidstakerandeler og frilans', () => {
    const vurderMottarYtelse = {
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = null;
    values[finnFrilansFieldName()] = true;
    const mottarYtelseMap = andelsnrMottarYtelseMap(values, vurderMottarYtelse, beregningsgrunnlag);
    expect(mottarYtelseMap[1]).to.equal(true);
    expect(mottarYtelseMap[2]).to.equal(false);
    expect(mottarYtelseMap[3]).to.equal(null);
    expect(mottarYtelseMap[4]).to.equal(true);
  });

  it('skalFastsetteInntektATUtenInntektsmelding skal returnere true om det er minst ein AT-andel som skal fastsett inntekt', () => {
    const vurderMottarYtelse = {
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = null;
    values[finnFrilansFieldName()] = true;
    const skalFastsetteAT = skalFastsetteInntektATUtenInntektsmelding(values, vurderMottarYtelse);
    expect(skalFastsetteAT).to.equal(true);
  });

  it('skalFastsetteInntektATUtenInntektsmelding skal returnere false om ingen AT andeler eksisterer i values', () => {
    const vurderMottarYtelse = {
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    const skalFastsetteAT = skalFastsetteInntektATUtenInntektsmelding(values, vurderMottarYtelse);
    expect(skalFastsetteAT).to.equal(false);
  });

  it('skalFastsetteInntektATUtenInntektsmelding skal returnere false om mottarYtelse for alle AT-andeler i values er satt til null', () => {
    const vurderMottarYtelse = {
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = null;
    values[utledArbeidsforholdFieldName(andel2)] = null;
    values[utledArbeidsforholdFieldName(andel3)] = null;
    values[finnFrilansFieldName()] = true;
    const skalFastsetteAT = skalFastsetteInntektATUtenInntektsmelding(values, vurderMottarYtelse);
    expect(skalFastsetteAT).to.equal(false);
  });

  it('skalFastsetteInntektATUtenInntektsmelding skal returnere false om mottarYtelse for alle AT-andeler i values er satt til false', () => {
    const vurderMottarYtelse = {
      arbeidstakerAndelerUtenIM,
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = false;
    values[utledArbeidsforholdFieldName(andel2)] = false;
    values[utledArbeidsforholdFieldName(andel3)] = false;
    values[finnFrilansFieldName()] = true;
    const skalFastsetteAT = skalFastsetteInntektATUtenInntektsmelding(values, vurderMottarYtelse);
    expect(skalFastsetteAT).to.equal(false);
  });
});
