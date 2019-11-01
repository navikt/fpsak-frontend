import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  mapToBelop,
  setArbeidsforholdInitialValues,
  setGenerellAndelsinfo,
  settAndelIArbeid,
  settFastsattBelop,
  skalValidereMotBeregningsgrunnlag,
} from './BgFordelingUtils';

const arbeidsgiver = {
  arbeidsgiverNavn: 'Virksomheten',
  arbeidsgiverId: '3284788923',
  startdato: '2017-01-01',
  opphoersdato: '2018-01-01',
};

const arbeidstakerIkkeFastsatt = {
  lagtTilAvSaksbehandler: false,
  fastsattAvSaksbehandler: false,
  aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
  inntektskategori: { kode: 'ARBEIDSTAKER' },
};

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === aktivitetStatuser.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }
  if (kodeverk.kode === aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE) {
    return 'Selvstendig næringsdrivende';
  }
  return '';
};

describe('<BgFordelingUtils>', () => {
  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon og fastsatt beregnetPrÅr', () => {
    const beregnetPrMnd = 10000;
    const fastsattAvSaksbehandler = true;
    const fastsattForrige = 50000;
    const fastsattBelop = settFastsattBelop(beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler);
    expect(fastsattBelop).to.equal(formatCurrencyNoKr(beregnetPrMnd));
  });

  it('skal returnere tom streng om ingen andeler i arbeid', () => {
    const andelIArbeid = settAndelIArbeid([]);
    expect(andelIArbeid).to.equal('');
  });

  it('skal returnere ein andel i arbeid om det finnes ein andel', () => {
    const andelIArbeid = settAndelIArbeid([50]);
    expect(andelIArbeid).to.equal('50.00');
  });

  it('skal returnere min - max om fleire andeler i arbeid', () => {
    const andelIArbeid = settAndelIArbeid([20, 30, 40, 60, 10]);
    expect(andelIArbeid).to.equal('10 - 60');
  });

  it('skal sette initial values for generell andelinfo med arbeidsforhold', () => {
    const andelValueFromState = {
      arbeidsforhold: {
        arbeidsgiverNavn: 'Virksomheten',
        arbeidsgiverId: '3284788923',
        arbeidsforholdId: '321378huda7e2',
        eksternArbeidsforholdId: '345678',
      },
      aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER },
      andelsnr: 3,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'ARBEIDSTAKER' },
    };

    const andelsInfo = setGenerellAndelsinfo(andelValueFromState, false, getKodeverknavn);
    expect(andelsInfo.andel).to.equal('Virksomheten (3284788923)...5678');
    expect(andelsInfo.aktivitetStatus).to.equal('AT');
    expect(andelsInfo.andelsnr).to.equal(3);
    expect(andelsInfo.nyAndel).to.equal(false);
    expect(andelsInfo.lagtTilAvSaksbehandler).to.equal(false);
    expect(andelsInfo.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal sette initial values for generell andelinfo uten arbeidsforhold', () => {
    const andelValueFromState = {
      aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const andelsInfo = setGenerellAndelsinfo(andelValueFromState, false, getKodeverknavn);
    expect(andelsInfo.andel).to.equal('Selvstendig næringsdrivende');
    expect(andelsInfo.aktivitetStatus).to.equal('SN');
    expect(andelsInfo.andelsnr).to.equal(2);
    expect(andelsInfo.nyAndel).to.equal(false);
    expect(andelsInfo.lagtTilAvSaksbehandler).to.equal(true);
    expect(andelsInfo.inntektskategori).to.equal('SN');
  });

  it('skal ikkje sette arbeidsforhold initial values for andel uten arbeidsforhold', () => {
    const andelValueFromState = {
      aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const arbeidsforholdIV = setArbeidsforholdInitialValues(andelValueFromState);
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('');
  });

  const arbeidstakerAndel3 = {
    arbeidsforhold: {
      ...arbeidsgiver,
      arbeidsforholdId: '321378huda7e2',
    },
    andelsnr: 3,
    ...arbeidstakerIkkeFastsatt,
  };

  it('skal sette arbeidsforhold initial values for andel med arbeidsforhold', () => {
    const arbeidsforholdIV = setArbeidsforholdInitialValues(arbeidstakerAndel3);
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal('321378huda7e2');
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('2017-01-01');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('2018-01-01');
  });

  const andelValuesMedInntektsmelding = {
    fordelingForrigeBehandling: 25000,
    fastsattBelop: 25000,
    readOnlyBelop: 25000,
    refusjonskrav: '',
    skalKunneEndreRefusjon: false,
    belopFraInntektsmelding: 25000,
    refusjonskravFraInntektsmelding: null,
  };

  it('skal kunne overstyre rapportert inntekt om andel med refusjon som overstiger inntekt og AAP i BG', () => {
    const andelFieldValue = {
      ...andelValuesMedInntektsmelding,
      refusjonskravFraInntektsmelding: 30000,
      harPeriodeAarsakGraderingEllerRefusjon: true,
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            { aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSAVKLARINGSPENGER } },
          ],
        },
      ],
    };
    const skalValidereMotBg = skalValidereMotBeregningsgrunnlag(bg)(andelFieldValue);
    expect(skalValidereMotBg).to.equal(false);
  });

  it('skal kunne overstyre beregningsgrunnlag om andel er frilans', () => {
    const andelFieldValue = {
      fastsattBelop: 25000,
      readOnlyBelop: 25000,
      aktivitetStatus: aktivitetStatuser.FRILANSER,
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            { aktivitetStatus: { kode: aktivitetStatuser.FRILANSER } },
          ],
        },
      ],
    };
    const skalValidereMotBg = skalValidereMotBeregningsgrunnlag(bg)(andelFieldValue);
    expect(skalValidereMotBg).to.equal(false);
  });


  it('skal mappe fastsattBeløp til beløp om andel har periodeårsak', () => {
    const andel = {
      harPeriodeAarsakGraderingEllerRefusjon: true,
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(andel);
    expect(belop).to.equal(10000);
  });

  it('skal mappe readOnlyBelop til beløp om andel ikkje har periodeårsak', () => {
    const andel = {
      harPeriodeAarsakGraderingEllerRefusjon: false,
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(andel);
    expect(belop).to.equal(20000);
  });
});
