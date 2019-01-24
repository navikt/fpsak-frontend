import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { lonnsendringField }
  from 'behandlingFpsak/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField }
  from 'behandlingFpsak/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  setArbeidsforholdInitialValues,
  setGenerellAndelsinfo,
  settAndelIArbeid,
  settFastsattBelop,
  skalRedigereInntektForAndel,
  settReadOnlyBelop,
  mapToBelop,
} from './BgFordelingUtils';
import { utledArbeidsforholdFieldName, finnFrilansFieldName }
  from './vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';


describe('<BgFordelingUtils>', () => {
  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon og fastsatt beregnetPrÅr', () => {
    const beregnetPrMnd = 10000;
    const fastsattAvSaksbehandler = true;
    const fastsattForrige = 50000;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    expect(fastsattBelop).to.equal(formatCurrencyNoKr(beregnetPrMnd));
  });

  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon og fastsatt forrige', () => {
    const beregnetPrMnd = null;
    const fastsattAvSaksbehandler = false;
    const fastsattForrige = 50000;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    const readOnlyFastsattBelop = settReadOnlyBelop(true, fordelingForrigeBehandling, beregnetPrMnd, undefined);
    expect(fastsattBelop).to.equal(formatCurrencyNoKr(fastsattForrige));
    expect(readOnlyFastsattBelop).to.equal(formatCurrencyNoKr(fordelingForrigeBehandling));
  });

  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon for første gangs behandling', () => {
    const beregnetPrMnd = null;
    const fastsattAvSaksbehandler = false;
    const fastsattForrige = null;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    const readOnlyFastsattBelop = settReadOnlyBelop(true, fordelingForrigeBehandling, beregnetPrMnd, undefined);
    expect(fastsattBelop).to.equal('');
    expect(readOnlyFastsattBelop).to.equal(formatCurrencyNoKr(fordelingForrigeBehandling));
  });

  it('skal sette riktig fastsatt beløp for andel i periode uten gradering eller refusjon', () => {
    const beregnetPrMnd = null;
    const fastsattAvSaksbehandler = false;
    const fastsattForrige = null;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler);
    const readOnlyFastsattBelop = settReadOnlyBelop(false, fordelingForrigeBehandling, beregnetPrMnd, undefined);
    expect(fastsattBelop).to.equal('');
    expect(readOnlyFastsattBelop).to.equal(formatCurrencyNoKr(fordelingForrigeBehandling));
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
      },
      aktivitetStatus: { kode: aktivitetStatus.ARBEIDSTAKER, navn: 'Arbeidstaker' },
      andelsnr: 3,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'ARBEIDSTAKER' },
    };
    const andelsInfo = setGenerellAndelsinfo(andelValueFromState);
    expect(andelsInfo.andel).to.equal('Virksomheten (3284788923) ...a7e2');
    expect(andelsInfo.aktivitetStatus).to.equal('AT');
    expect(andelsInfo.andelsnr).to.equal(3);
    expect(andelsInfo.nyAndel).to.equal(false);
    expect(andelsInfo.lagtTilAvSaksbehandler).to.equal(false);
    expect(andelsInfo.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal sette initial values for generell andelinfo uten arbeidsforhold', () => {
    const andelValueFromState = {
      aktivitetStatus: { kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, navn: 'Selvstendig næringsdrivende' },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const andelsInfo = setGenerellAndelsinfo(andelValueFromState);
    expect(andelsInfo.andel).to.equal('Selvstendig næringsdrivende');
    expect(andelsInfo.aktivitetStatus).to.equal('SN');
    expect(andelsInfo.andelsnr).to.equal(2);
    expect(andelsInfo.nyAndel).to.equal(false);
    expect(andelsInfo.lagtTilAvSaksbehandler).to.equal(true);
    expect(andelsInfo.inntektskategori).to.equal('SN');
  });

  it('skal ikkje sette arbeidsforhold initial values for andel uten arbeidsforhold', () => {
    const andelValueFromState = {
      aktivitetStatus: { kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, navn: 'Selvstendig næringsdrivende' },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const arbeidsforholdIV = setArbeidsforholdInitialValues(andelValueFromState);
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('');
  });

  const arbeidsgiver = {
    arbeidsgiverNavn: 'Virksomheten',
    arbeidsgiverId: '3284788923',
    startdato: '2017-01-01',
    opphoersdato: '2018-01-01',
  };

  const arbeidstakerIkkeFastsatt = {
    lagtTilAvSaksbehandler: false,
    fastsattAvSaksbehandler: false,
    aktivitetStatus: { kode: aktivitetStatus.ARBEIDSTAKER, navn: 'Arbeidstaker' },
    inntektskategori: { kode: 'ARBEIDSTAKER' },
  };

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

  const arbeidstakerAndel1 = {
    arbeidsforhold: {
      ...arbeidsgiver,
      arbeidsforholdId: '6765756g5',
    },
    andelsnr: 1,
    ...arbeidstakerIkkeFastsatt,
  };


  const arbeidstakerAndel4 = {
    arbeidsforhold: {
      ...arbeidsgiver,
      arbeidsforholdId: '546546g54',
    },
    andelsnr: 4,
    ...arbeidstakerIkkeFastsatt,
  };

  const frilansAndel = {
    aktivitetStatus: { kode: aktivitetStatus.FRILANSER, navn: 'Frilans' },
    andelsnr: 2,
  };

  const beregningsgrunnlag = {
    beregningsgrunnlagPeriode: [{
      beregningsgrunnlagPrStatusOgAndel: [arbeidstakerAndel1, arbeidstakerAndel3, frilansAndel, arbeidstakerAndel4],
    },
    ],
  };

  const faktaOmBeregning = {
    vurderMottarYtelse: {
      erFrilans: true,
      frilansMottarYtelse: null,
      frilansInntektPrMnd: 20000,
      arbeidstakerAndelerUtenIM: [arbeidstakerAndel3, arbeidstakerAndel1],
    },
  };

  const values = {};
  values[utledArbeidsforholdFieldName(arbeidstakerAndel3)] = true;
  values[finnFrilansFieldName()] = true;
  values[lonnsendringField] = true;

  const andelValuesUtenInntektsmelding = {
    fordelingForrigeBehandling: '',
    fastsattBeløp: '',
    readOnlyBelop: 25000,
    skalRedigereInntekt: false,
    snittIBeregningsperiodenPrMnd: 25000,
    refusjonskrav: '',
    skalKunneEndreRefusjon: false,
    belopFraInntektsmelding: null,
    refusjonskravFraInntektsmelding: null,
  };

  const andelValuesMedInntektsmelding = {
    fordelingForrigeBehandling: 25000,
    fastsattBeløp: 25000,
    readOnlyBelop: 25000,
    skalRedigereInntekt: false,
    snittIBeregningsperiodenPrMnd: null,
    refusjonskrav: '',
    skalKunneEndreRefusjon: false,
    belopFraInntektsmelding: 25000,
    refusjonskravFraInntektsmelding: null,
  };

  it('skal redigere inntekt for arbeidstakerandel som mottar ytelse', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(arbeidstakerAndel3),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for arbeidstakerandel som ikke mottar ytelse, men har lonnsendring', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(arbeidstakerAndel1),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for arbeidstakerandel med inntektsmelding med periodeÅrsak', () => {
    const andelFieldValue = {
      ...andelValuesMedInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      ...setGenerellAndelsinfo(arbeidstakerAndel4),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal ikke redigere inntekt for arbeidstakerandel med inntektsmelding uten periodeÅrsak', () => {
    const andelFieldValue = {
      ...andelValuesMedInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(arbeidstakerAndel4),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(false);
  });

  it('skal redigere inntekt for arbeidstakerandel med inntektsmelding i samme org som frilans', () => {
    const andelFieldValue = {
      ...andelValuesMedInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(arbeidstakerAndel4),
    };
    const faktaOmBeregningCopy = { ...faktaOmBeregning };
    faktaOmBeregningCopy.arbeidstakerOgFrilanserISammeOrganisasjonListe = [arbeidstakerAndel4];
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregningCopy, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for frilansandel som mottar ytelse', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(frilansAndel),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for frilansandel som ikke mottar ytelse, men er nyoppstartet', () => {
    const valuesLocalCopy = { ...values };
    valuesLocalCopy[finnFrilansFieldName()] = false;
    valuesLocalCopy[erNyoppstartetFLField] = true;
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(frilansAndel),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(valuesLocalCopy, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal ikke redigere inntekt for frilansandel som ikke mottar ytelse, ikke er nyoppstartet og ikke har periodeAarsak', () => {
    const valuesLocalCopy = { ...values };
    valuesLocalCopy[finnFrilansFieldName()] = false;
    valuesLocalCopy[erNyoppstartetFLField] = false;
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(frilansAndel),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(valuesLocalCopy, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(false);
  });

  it('skal redigere inntekt for frilansandel som ikke mottar ytelse, ikke er nyoppstartet men har periodeAarsak', () => {
    const valuesLocalCopy = { ...values };
    valuesLocalCopy[finnFrilansFieldName()] = false;
    valuesLocalCopy[erNyoppstartetFLField] = false;
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      ...setGenerellAndelsinfo(frilansAndel),
    };
    const skalRedigereInntekt = skalRedigereInntektForAndel(valuesLocalCopy, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal redigere inntekt for frilansandel i samme org som arbeidstaker', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(frilansAndel),
    };
    faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe = [arbeidstakerAndel4];
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(true);
  });

  it('skal mappe fastsattBeløp til beløp om skalRedigereInntekt er udefinert', () => {
    const andel = {
      fastsattBeløp: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(undefined)(andel);
    expect(belop).to.equal(10000);
  });

  it('skal mappe fastsattBeløp til beløp om skalRedigereInntekt returnerer true', () => {
    const andel = {
      fastsattBeløp: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(() => true)(andel);
    expect(belop).to.equal(10000);
  });

  it('skal mappe readOnlyBelop til beløp om skalRedigereInntekt returnerer false', () => {
    const andel = {
      fastsattBeløp: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(() => false)(andel);
    expect(belop).to.equal(20000);
  });
});
