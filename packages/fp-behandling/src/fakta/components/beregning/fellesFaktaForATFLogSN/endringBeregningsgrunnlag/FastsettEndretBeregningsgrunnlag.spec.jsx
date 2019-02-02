import { expect } from 'chai';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { buildValues, validateValues } from './FastsettEndretBeregningsgrunnlag';

describe('<FastsettEndretBeregningsgrunnlag>', () => {
  /**
   * Build initial values
   */
  // ///////////////////////////////////////////////////
  it('skal ikkje sette initial values om FASTSETT_BG_KUN_YTELSE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE];
    const build = sinon.spy();
    const initialValues = buildValues(tilfeller, build);
    expect(initialValues).to.be.empty;
    expect(build).to.have.property('callCount', 0);
  });

  it('skal ikkje sette initial values om VURDER_ETTERLONN_SLUTTPAKKE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE];
    const build = sinon.spy();
    const initialValues = buildValues(tilfeller, build);
    expect(initialValues).to.be.empty;
    expect(build).to.have.property('callCount', 0);
  });

  it('skal ikkje sette initial values om FASTSETT_BESTEBEREGNING_FODENDE_KVINNE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    const build = sinon.spy();
    const initialValues = buildValues(tilfeller, build);
    expect(initialValues).to.be.empty;
    expect(build).to.have.property('callCount', 0);
  });

  it('skal ikkje sette initial values om FASTSETT_ETTERLONN_SLUTTPAKKE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_ETTERLONN_SLUTTPAKKE];
    const build = sinon.spy();
    const initialValues = buildValues(tilfeller, build);
    expect(initialValues).to.be.empty;
    expect(build).to.have.property('callCount', 0);
  });

  it('skal kalle build om VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om VURDER_SN_NY_I_ARBEIDSLIVET', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om VURDER_NYOPPSTARTET_FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om FASTSETT_MAANEDSINNTEKT_FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om FASTSETT_ENDRET_BEREGNINGSGRUNNLAG', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om VURDER_LONNSENDRING', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om VURDER_AT_OG_FL_I_SAMME_ORGANISASJON', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  it('skal kalle build om VURDER_MOTTAR_YTELSE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const build = sinon.spy();
    buildValues(tilfeller, build);
    expect(build).to.have.property('callCount', 1);
  });

  /**
   * Validation
   */
  // ///////////////////////////////////////////////////
  it('skal ikkje validere om FASTSETT_BG_KUN_YTELSE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE];
    const validate = sinon.spy();
    const initialValues = validateValues(tilfeller, validate);
    expect(initialValues).to.be.empty;
    expect(validate).to.have.property('callCount', 0);
  });

  it('skal ikkje validere om VURDER_ETTERLONN_SLUTTPAKKE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE];
    const validate = sinon.spy();
    const initialValues = validateValues(tilfeller, validate);
    expect(initialValues).to.be.empty;
    expect(validate).to.have.property('callCount', 0);
  });

  it('skal ikkje validere om FASTSETT_BESTEBEREGNING_FODENDE_KVINNE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    const validate = sinon.spy();
    const initialValues = validateValues(tilfeller, validate);
    expect(initialValues).to.be.empty;
    expect(validate).to.have.property('callCount', 0);
  });

  it('skal ikkje validere om FASTSETT_ETTERLONN_SLUTTPAKKE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_ETTERLONN_SLUTTPAKKE];
    const validate = sinon.spy();
    const initialValues = validateValues(tilfeller, validate);
    expect(initialValues).to.be.empty;
    expect(validate).to.have.property('callCount', 0);
  });

  it('skal kalle validate om VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om VURDER_SN_NY_I_ARBEIDSLIVET', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om VURDER_NYOPPSTARTET_FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om FASTSETT_MAANEDSINNTEKT_FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om FASTSETT_ENDRET_BEREGNINGSGRUNNLAG', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om VURDER_LONNSENDRING', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING', () => {
    const tilfeller = [faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om VURDER_AT_OG_FL_I_SAMME_ORGANISASJON', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });

  it('skal kalle validate om VURDER_MOTTAR_YTELSE', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const validate = sinon.spy();
    validateValues(tilfeller, validate);
    expect(validate).to.have.property('callCount', 1);
  });
});
