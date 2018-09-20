import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils/currencyUtils';
import { settFastsattBelop } from './EndringBeregningsgrunnlagPeriodePanel';


describe('<EndringBeregningsgrunnlagPeriodePanel>', () => {
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
});
