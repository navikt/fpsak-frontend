import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import organisasjonstyper from '@fpsak-frontend/kodeverk/src/organisasjonstype';
import { lonnsendringField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  setArbeidsforholdInitialValues,
  setGenerellAndelsinfo,
  settAndelIArbeid,
  settFastsattBelop,
  skalRedigereInntektForAndel,
  settReadOnlyBelop,
  mapToBelop,
  mapAndelToField,
  skalFastsettInntektForStatus,
  skalRedigereInntektskategoriForAndel,
  skalKunneOverstigeRapportertInntekt,
} from './BgFordelingUtils';
import { utledArbeidsforholdFieldName, finnFrilansFieldName }
  from './vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';
import { besteberegningField } from './besteberegningFodendeKvinne/VurderBesteberegningForm';

const lagAndelValues = (andelsnr, fastsattBelop, inntektskategori, aktivitetStatus, lagtTilAvSaksbehandler = false, nyAndel = false) => ({
  nyAndel, andelsnr, fastsattBelop, inntektskategori, aktivitetStatus, lagtTilAvSaksbehandler, skalRedigereInntekt: true,
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
  aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  inntektskategori: { kode: 'ARBEIDSTAKER' },
};

const arbeidstakerAndel1 = {
  arbeidsforhold: {
    ...arbeidsgiver,
    arbeidsforholdId: '6765756g5',
  },
  andelsnr: 1,
  ...arbeidstakerIkkeFastsatt,
};

describe('<BgFordelingUtils>', () => {
  it('skal returnere true for fastsetting av FL-inntekt når FL-inntekt skal fastsettes', () => {
    const fieldArrayName = 'test';
    const values = {};
    values[fieldArrayName] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => (andel.aktivitetStatus === aktivitetStatuser.FRILANSER);
    const skalFastsetteFL = skalFastsettInntektForStatus(fieldArrayName, aktivitetStatuser.FRILANSER).resultFunc(values, skalFastsetteInntektMock);
    expect(skalFastsetteFL).to.equal(true);
  });

  it('skal returnere false for fastsetting av FL-inntekt når FL-inntekt ikkje skal fastsettes', () => {
    const fieldArrayName = 'test';
    const values = {};
    values[fieldArrayName] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => (andel.aktivitetStatus !== aktivitetStatuser.FRILANSER);
    const skalFastsetteFL = skalFastsettInntektForStatus(fieldArrayName, aktivitetStatuser.FRILANSER).resultFunc(values, skalFastsetteInntektMock);
    expect(skalFastsetteFL).to.equal(false);
  });

  it('skal returnere true for fastsetting av AT-inntekt når AT-inntekt skal fastsettes', () => {
    const fieldArrayName = 'test';
    const values = {};
    values[fieldArrayName] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => (andel.aktivitetStatus === aktivitetStatuser.ARBEIDSTAKER);
    const skalFastsetteFL = skalFastsettInntektForStatus(fieldArrayName, aktivitetStatuser.ARBEIDSTAKER).resultFunc(values, skalFastsetteInntektMock);
    expect(skalFastsetteFL).to.equal(true);
  });

  it('skal returnere false for fastsetting av FL-inntekt når FL-inntekt ikkje skal fastsettes', () => {
    const fieldArrayName = 'test';
    const values = {};
    values[fieldArrayName] = [
      lagAndelValues(1, 10000, inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(2, 20000, inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
    ];
    const skalFastsetteInntektMock = andel => (andel.aktivitetStatus !== aktivitetStatuser.ARBEIDSTAKER);
    const skalFastsetteFL = skalFastsettInntektForStatus(fieldArrayName, aktivitetStatuser.ARBEIDSTAKER).resultFunc(values, skalFastsetteInntektMock);
    expect(skalFastsetteFL).to.equal(false);
  });

  const dagpengerAndel = {
    aktivitetStatus: { kode: aktivitetStatuser.DAGPENGER, navn: 'Dagpenger' },
    andelsnr: 1,
    lagtTilAvSaksbehandler: true,
    inntektskategori: { kode: 'DAGPENGER' },
    fastsattAvSaksbehandler: true,
    beregnetPrAar: 240000,
  };

  const dagpengeField = mapAndelToField(dagpengerAndel);


  it('skal mappe dagpengerandel til feltverdier', () => {
    expect(dagpengeField.aktivitetStatus).to.equal('DP');
    expect(dagpengeField.andelsnr).to.equal(1);
    expect(dagpengeField.nyAndel).to.equal(false);
    expect(dagpengeField.lagtTilAvSaksbehandler).to.equal(true);
    expect(dagpengeField.skalKunneEndreAktivitet).to.equal(false);
    expect(dagpengeField.inntektskategori).to.equal('DAGPENGER');
    expect(dagpengeField.fastsattBelop).to.equal('20 000');
    expect(dagpengeField.belopReadOnly).to.equal('');
    expect(dagpengeField.refusjonskrav).to.equal('');
  });

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
      aktivitetStatus: { kode: aktivitetStatuser.ARBEIDSTAKER, navn: 'Arbeidstaker' },
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
      aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, navn: 'Selvstendig næringsdrivende' },
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
      aktivitetStatus: { kode: aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, navn: 'Selvstendig næringsdrivende' },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const arbeidsforholdIV = setArbeidsforholdInitialValues(andelValueFromState);
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('');
  });

  const andelsnrKunstigArbeid = 241;

  const kunstigArbeidsgiver = {
    arbeidsgiverNavn: 'Kunstig virksomhet',
    arbeidsgiverId: '42672364432',
    startdato: '2017-01-01',
    opphoersdato: '2018-01-01',
    organisasjonstype: { kode: organisasjonstyper.KUNSTIG },
  };

  const kunstigArbeidstakerAndel = {
    arbeidsforhold: {
      ...kunstigArbeidsgiver,
      arbeidsforholdId: null,
    },
    andelsnr: andelsnrKunstigArbeid,
    ...arbeidstakerIkkeFastsatt,
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


  const arbeidstakerAndel4 = {
    arbeidsforhold: {
      ...arbeidsgiver,
      arbeidsforholdId: '546546g54',
    },
    andelsnr: 4,
    ...arbeidstakerIkkeFastsatt,
  };

  const frilansAndel = {
    aktivitetStatus: { kode: aktivitetStatuser.FRILANSER, navn: 'Frilans' },
    andelsnr: 2,
  };

  const beregningsgrunnlag = {
    beregningsgrunnlagPeriode: [{
      beregningsgrunnlagPrStatusOgAndel: [arbeidstakerAndel1, arbeidstakerAndel3, frilansAndel, arbeidstakerAndel4, kunstigArbeidstakerAndel],
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
    fastsattBelop: '',
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
    fastsattBelop: 25000,
    readOnlyBelop: 25000,
    skalRedigereInntekt: false,
    snittIBeregningsperiodenPrMnd: null,
    refusjonskrav: '',
    skalKunneEndreRefusjon: false,
    belopFraInntektsmelding: 25000,
    refusjonskravFraInntektsmelding: null,
  };

  it('skal kunne overstyre rapportert inntekt om dagpenger med periodeårsak', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: true,
      ...dagpengeField,
    };
    const skalKunneOverstyreRapportertInntekt = skalKunneOverstigeRapportertInntekt(null, null, null)(andelFieldValue);
    expect(skalKunneOverstyreRapportertInntekt).to.equal(true);
  });


  it('skal ikkje kunne overstyre rapportert inntekt om dagpenger uten periodeårsak', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...dagpengeField,
    };
    const skalKunneOverstyreRapportertInntekt = skalKunneOverstigeRapportertInntekt({}, {}, beregningsgrunnlag)(andelFieldValue);
    expect(skalKunneOverstyreRapportertInntekt).to.equal(false);
  });

  it('skal redigere inntektskategori for arbeidstakerandel som skalhaBesteberegning', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(arbeidstakerAndel3),
    };
    const vals = {
      [besteberegningField]: true,
    };
    const skalRedigereInntektskategori = skalRedigereInntektskategoriForAndel(vals, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntektskategori).to.equal(true);
  });


  it('skal redigere inntektskategori for kunstig arbeid', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setArbeidsforholdInitialValues(kunstigArbeidstakerAndel),
      ...setGenerellAndelsinfo(kunstigArbeidstakerAndel),
    };
    const vals = {};
    const skalRedigereInntektskategori = skalRedigereInntektskategoriForAndel(vals, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntektskategori).to.equal(true);
  });

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
    faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM = [arbeidstakerAndel1];
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

  it('skal ikkje redigere inntekt for arbeidstakerandel med inntektsmelding i samme org som frilans', () => {
    const andelFieldValue = {
      ...andelValuesUtenInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(arbeidstakerAndel4),
    };
    const faktaOmBeregningCopy = { ...faktaOmBeregning };
    arbeidstakerAndel4.inntektPrMnd = 30000;
    faktaOmBeregningCopy.arbeidstakerOgFrilanserISammeOrganisasjonListe = [arbeidstakerAndel4];
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregningCopy, beregningsgrunnlag)(andelFieldValue);
    expect(skalRedigereInntekt).to.equal(false);
  });

  it('skal redigere inntekt for arbeidstakerandel uten inntektsmelding i samme org som frilans', () => {
    const andelFieldValue = {
      ...andelValuesMedInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: false,
      ...setGenerellAndelsinfo(arbeidstakerAndel4),
    };
    const faktaOmBeregningCopy = { ...faktaOmBeregning };
    arbeidstakerAndel4.inntektPrMnd = null;
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
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(undefined)(andel);
    expect(belop).to.equal(10000);
  });

  it('skal mappe fastsattBeløp til beløp om skalRedigereInntekt returnerer true', () => {
    const andel = {
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(() => true)(andel);
    expect(belop).to.equal(10000);
  });

  it('skal mappe readOnlyBelop til beløp om skalRedigereInntekt returnerer false', () => {
    const andel = {
      fastsattBelop: '10 000',
      readOnlyBelop: '20 000',
    };
    const belop = mapToBelop(() => false)(andel);
    expect(belop).to.equal(20000);
  });
});
