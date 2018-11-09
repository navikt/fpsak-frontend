import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils/currencyUtils';
import {
  setArbeidsforholdInitialValues,
  setGenerellAndelsinfo,
  settAndelIArbeid,
  settFastsattBelop,
} from './BgFordelingUtils';


describe('<BgFordelingUtils>', () => {
  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon og fastsatt beregnetPrÅr', () => {
    const beregnetPrMnd = 10000;
    const fastsattAvSaksbehandler = true;
    const fastsattForrige = 50000;
    const harPeriodeAarsak = true;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(harPeriodeAarsak, beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    expect(fastsattBelop).to.equal(formatCurrencyNoKr(beregnetPrMnd));
  });

  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon og fastsatt forrige', () => {
    const beregnetPrMnd = null;
    const fastsattAvSaksbehandler = false;
    const fastsattForrige = 50000;
    const harPeriodeAarsak = true;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(harPeriodeAarsak, beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    expect(fastsattBelop).to.equal(formatCurrencyNoKr(fastsattForrige));
  });

  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon og fastsatt forrige', () => {
    const beregnetPrMnd = null;
    const fastsattAvSaksbehandler = false;
    const fastsattForrige = 50000;
    const harPeriodeAarsak = true;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(harPeriodeAarsak, beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    expect(fastsattBelop).to.equal(formatCurrencyNoKr(fastsattForrige));
  });

  it('skal sette riktig fastsatt beløp for andel i periode med gradering eller refusjon for første gangs behandling', () => {
    const beregnetPrMnd = null;
    const fastsattAvSaksbehandler = false;
    const fastsattForrige = null;
    const harPeriodeAarsak = true;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(harPeriodeAarsak, beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    expect(fastsattBelop).to.equal('');
  });

  it('skal sette riktig fastsatt beløp for andel i periode uten gradering eller refusjon', () => {
    const beregnetPrMnd = null;
    const fastsattAvSaksbehandler = false;
    const fastsattForrige = null;
    const harPeriodeAarsak = false;
    const fordelingForrigeBehandling = 75000;
    const fastsattBelop = settFastsattBelop(harPeriodeAarsak, beregnetPrMnd, fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler);
    expect(fastsattBelop).to.equal(formatCurrencyNoKr(fordelingForrigeBehandling));
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
      aktivitetStatus: { kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' },
      andelsnr: 3,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'ARBEIDSTAKER' },
    };
    const andelsInfo = setGenerellAndelsinfo(andelValueFromState);
    expect(andelsInfo.andel).to.equal('Virksomheten (3284788923) ...a7e2');
    expect(andelsInfo.aktivitetStatus).to.equal('ARBEIDSTAKER');
    expect(andelsInfo.andelsnr).to.equal(3);
    expect(andelsInfo.nyAndel).to.equal(false);
    expect(andelsInfo.lagtTilAvSaksbehandler).to.equal(false);
    expect(andelsInfo.inntektskategori).to.equal('ARBEIDSTAKER');
  });

  it('skal sette initial values for generell andelinfo uten arbeidsforhold', () => {
    const andelValueFromState = {
      aktivitetStatus: { kode: 'SN', navn: 'Selvstendig næringsdrivende' },
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
      aktivitetStatus: { kode: 'SN', navn: 'Selvstendig næringsdrivende' },
      andelsnr: 2,
      lagtTilAvSaksbehandler: true,
      inntektskategori: { kode: 'SN' },
    };
    const arbeidsforholdIV = setArbeidsforholdInitialValues(andelValueFromState);
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('');
  });

  it('skal sette arbeidsforhold initial values for andel med arbeidsforhold', () => {
    const andelValueFromState = {
      arbeidsforhold: {
        arbeidsgiverNavn: 'Virksomheten',
        arbeidsgiverId: '3284788923',
        arbeidsforholdId: '321378huda7e2',
        startdato: '2017-01-01',
        opphoersdato: '2018-01-01',
      },
      aktivitetStatus: { kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' },
      andelsnr: 3,
      lagtTilAvSaksbehandler: false,
      inntektskategori: { kode: 'ARBEIDSTAKER' },
    };
    const arbeidsforholdIV = setArbeidsforholdInitialValues(andelValueFromState);
    expect(arbeidsforholdIV.arbeidsforholdId).to.equal('321378huda7e2');
    expect(arbeidsforholdIV.arbeidsperiodeFom).to.equal('2017-01-01');
    expect(arbeidsforholdIV.arbeidsperiodeTom).to.equal('2018-01-01');
  });
});
