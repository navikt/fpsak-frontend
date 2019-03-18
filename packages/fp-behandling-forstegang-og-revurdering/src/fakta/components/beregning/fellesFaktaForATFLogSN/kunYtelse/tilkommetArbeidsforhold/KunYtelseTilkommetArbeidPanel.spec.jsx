import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import Panel from './KunYtelseTilkommetArbeidPanel';
import { skalVereLikFordelingMessage, ulikeAndelerErrorMessage } from '../../ValidateAndelerUtils';
import { brukersAndelFieldArrayName } from '../KunYtelsePanel';
import EndringBeregningsgrunnlagForm, { getFieldNameKey }
  from '../../endringBeregningsgrunnlag/EndringBeregningsgrunnlagForm';

const lagArbeidstakerAndel = (andelsnr, lagtTilAvSaksbehandler, fordelingForrigeBehandling,
  beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler, refusjonskrav, belopFraInntektsmelding,
  refusjonskravFraInntektsmelding, andelIArbeid) => ({
  arbeidsforhold: {
    arbeidsgiverNavn: 'Virksomheten',
    arbeidsgiverId: '3284788923',
    arbeidsforholdId: '321378huda7e2',
    startdato: '2017-01-01',
    opphoersdato: '2018-01-01',
  },
  aktivitetStatus: { kode: aktivitetStatus.ARBEIDSTAKER, navn: 'Arbeidstaker' },
  inntektskategori: { kode: inntektskategorier.ARBEIDSTAKER },
  andelIArbeid,
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandling,
  beregnetPrMnd,
  fastsattForrige,
  fastsattAvSaksbehandler,
  refusjonskrav,
  belopFraInntektsmelding,
  refusjonskravFraInntektsmelding,
});

const lagEndringBrukersAndel = (andelsnr,
  lagtTilAvSaksbehandler, fordelingForrigeBehandling,
  beregnetPrMnd, fastsattForrige, fastsattAvSaksbehandler) => ({
  arbeidsforhold: null,
  aktivitetStatus: { kode: aktivitetStatus.BRUKERS_ANDEL, navn: 'Brukers andel' },
  inntektskategori: { kode: inntektskategorier.UDEFINERT },
  andelIArbeid: [0],
  andelsnr,
  lagtTilAvSaksbehandler,
  fordelingForrigeBehandling,
  beregnetPrMnd,
  fastsattForrige,
  fastsattAvSaksbehandler,
  refusjonskrav: null,
  belopFraInntektsmelding: null,
  refusjonskravFraInntektsmelding: null,
});

const lagBrukersAndel = (andelsnr, fastsattBelopPrMnd, lagtTilAvSaksbehandler, inntektskategori) => ({
  andelsnr,
  fastsattBelopPrMnd,
  lagtTilAvSaksbehandler,
  inntektskategori,
  aktivitetStatus: { kode: aktivitetStatus.BRUKERS_ANDEL, navn: 'Brukers andel' },
});


const lagPeriode = (harPeriodeAarsakGraderingEllerRefusjon,
  skalKunneEndreRefusjon, endringBeregningsgrunnlagAndeler) => ({
  harPeriodeAarsakGraderingEllerRefusjon,
  skalKunneEndreRefusjon,
  endringBeregningsgrunnlagAndeler,
});

const inntektskategoriArbeidstaker = { kode: inntektskategorier.ARBEIDSTAKER };
const inntektskategoriUdefinert = { kode: inntektskategorier.UDEFINERT };
const kunYtelseOgEndringTilfeller = [faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE, faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];


describe('<KunYtelseTilkommetArbeidsforholdPanel>', () => {
  it('skal ikkje vise tilkommetpanel', () => {
    const wrapper = shallowWithIntl(<Panel.WrappedComponent
      readOnly={false}
      skalSjekkeBesteberegning
      isAksjonspunktClosed={false}
      perioder={[]}
      skalViseTilkommetTabell={false}
    />);
    const tilkommetTabell = wrapper.find(EndringBeregningsgrunnlagForm);
    expect(tilkommetTabell).to.have.length(0);
  });

  it('skal vise tilkommetpanel', () => {
    const wrapper = shallowWithIntl(<Panel.WrappedComponent
      readOnly={false}
      skalSjekkeBesteberegning
      isAksjonspunktClosed={false}
      perioder={[]}
      skalViseTilkommetTabell
    />);
    const tilkommetTabell = wrapper.find(EndringBeregningsgrunnlagForm);
    expect(tilkommetTabell).to.have.length(1);
  });

  it('skal bygge initial values', () => {
    const kunYtelse = {
      andeler: [lagBrukersAndel(1, 10000, false, inntektskategoriUdefinert),
        lagBrukersAndel(2, 20000, true, inntektskategoriArbeidstaker)],
    };
    const endringandeler1 = [
      lagEndringBrukersAndel(1, false, 10000, null, 10000, true),
      lagArbeidstakerAndel(2, false, 10000, null,
        null, false, 10000, 10000, 10000, [0, 20])];
    const endringAndeler2 = [lagEndringBrukersAndel(1, false, null, null, 10000, true),
      lagEndringBrukersAndel(2, true, null, null, 20000, true)];
    const perioder = [
      lagPeriode(false, false, endringAndeler2),
      lagPeriode(true, true, endringandeler1)];
    const initialValues = Panel.buildInitialValues(kunYtelse, perioder, false, kunYtelseOgEndringTilfeller);
    const brukersAndelInitialValues = initialValues[`${brukersAndelFieldArrayName}`];
    expect(brukersAndelInitialValues).to.have.length(2);
    expect(brukersAndelInitialValues[0].andelsnr).to.equal(1);
    expect(brukersAndelInitialValues[0].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[0].aktivitetStatus).to.equal('BA');
    expect(brukersAndelInitialValues[0].fastsattBeløp).to.equal('10 000');
    expect(brukersAndelInitialValues[0].inntektskategori).to.equal('');
    expect(brukersAndelInitialValues[0].nyAndel).to.equal(false);
    expect(brukersAndelInitialValues[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(brukersAndelInitialValues[1].andelsnr).to.equal(2);
    expect(brukersAndelInitialValues[1].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[1].fastsattBeløp).to.equal('20 000');
    expect(brukersAndelInitialValues[1].aktivitetStatus).to.equal('BA');
    expect(brukersAndelInitialValues[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(brukersAndelInitialValues[1].nyAndel).to.equal(false);
    expect(brukersAndelInitialValues[1].lagtTilAvSaksbehandler).to.equal(true);

    const endringPeriodeInitialValues = initialValues[getFieldNameKey(0)];
    expect(endringPeriodeInitialValues).to.have.length(2);
    expect(endringPeriodeInitialValues[0].andel).to.equal('Ytelse');
    expect(endringPeriodeInitialValues[0].andelsnr).to.equal(1);
    expect(endringPeriodeInitialValues[0].aktivitetStatus).to.equal('BA');
    expect(endringPeriodeInitialValues[0].nyAndel).to.equal(false);
    expect(endringPeriodeInitialValues[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(endringPeriodeInitialValues[0].inntektskategori).to.equal('');
    expect(endringPeriodeInitialValues[0].arbeidsforholdId).to.equal('');
    expect(endringPeriodeInitialValues[0].arbeidsperiodeFom).to.equal('');
    expect(endringPeriodeInitialValues[0].arbeidsperiodeTom).to.equal('');
    expect(endringPeriodeInitialValues[0].refusjonskrav).to.equal('0');
    expect(endringPeriodeInitialValues[0].refusjonskravFraInntektsmelding).to.equal(null);
    expect(endringPeriodeInitialValues[0].fordelingForrigeBehandling).to.equal(null);
    expect(endringPeriodeInitialValues[0].skalKunneEndreRefusjon).to.equal(false);
    expect(endringPeriodeInitialValues[0].harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);

    expect(endringPeriodeInitialValues[1].andel).to.equal('Virksomheten (3284788923) ...a7e2');
    expect(endringPeriodeInitialValues[1].andelsnr).to.equal(2);
    expect(endringPeriodeInitialValues[1].aktivitetStatus).to.equal('AT');
    expect(endringPeriodeInitialValues[1].nyAndel).to.equal(false);
    expect(endringPeriodeInitialValues[1].lagtTilAvSaksbehandler).to.equal(false);
    expect(endringPeriodeInitialValues[1].inntektskategori).to.equal('ARBEIDSTAKER');
    expect(endringPeriodeInitialValues[1].arbeidsforholdId).to.equal('321378huda7e2');
    expect(endringPeriodeInitialValues[1].arbeidsperiodeFom).to.equal('2017-01-01');
    expect(endringPeriodeInitialValues[1].arbeidsperiodeTom).to.equal('2018-01-01');
    expect(endringPeriodeInitialValues[1].refusjonskrav).to.equal('10 000');
    expect(endringPeriodeInitialValues[1].skalKunneEndreRefusjon).to.equal(true);
    expect(endringPeriodeInitialValues[1].harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);
  });


  it('skal bygge initial values for revurdering', () => {
    const kunYtelse = {
      andeler: [lagBrukersAndel(1, 10000, false, inntektskategoriUdefinert),
        lagBrukersAndel(2, 20000, true, inntektskategoriArbeidstaker)],
    };
    const endringandeler1 = [
      lagEndringBrukersAndel(1, false, 10000, null, 10000, true),
      lagArbeidstakerAndel(2, false, 10000, null,
        null, false, 10000, 10000, 10000, [0, 20])];
    const endringAndeler2 = [lagEndringBrukersAndel(1, false, 10000, null, 10000, true),
      lagEndringBrukersAndel(2, true, 10000, null, 20000, true)];
    const perioder = [
      lagPeriode(false, false, endringAndeler2),
      lagPeriode(true, true, endringandeler1)];
    const initialValues = Panel.buildInitialValues(kunYtelse, perioder, true, kunYtelseOgEndringTilfeller);
    const brukersAndelInitialValues = initialValues[`${brukersAndelFieldArrayName}`];
    expect(brukersAndelInitialValues).to.have.length(2);
    expect(brukersAndelInitialValues[0].andelsnr).to.equal(1);
    expect(brukersAndelInitialValues[0].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[0].aktivitetStatus).to.equal('BA');
    expect(brukersAndelInitialValues[0].fastsattBeløp).to.equal('10 000');
    expect(brukersAndelInitialValues[0].inntektskategori).to.equal('');
    expect(brukersAndelInitialValues[0].nyAndel).to.equal(false);
    expect(brukersAndelInitialValues[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(brukersAndelInitialValues[1].andelsnr).to.equal(2);
    expect(brukersAndelInitialValues[1].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[1].fastsattBeløp).to.equal('20 000');
    expect(brukersAndelInitialValues[1].aktivitetStatus).to.equal('BA');
    expect(brukersAndelInitialValues[1].inntektskategori).to.equal(inntektskategorier.ARBEIDSTAKER);
    expect(brukersAndelInitialValues[1].nyAndel).to.equal(false);
    expect(brukersAndelInitialValues[1].lagtTilAvSaksbehandler).to.equal(true);

    const endringPeriodeInitialValues = initialValues[getFieldNameKey(0)];
    expect(endringPeriodeInitialValues).to.have.length(2);
    expect(endringPeriodeInitialValues[0].andel).to.equal('Ytelse');
    expect(endringPeriodeInitialValues[0].andelsnr).to.equal(1);
    expect(endringPeriodeInitialValues[0].aktivitetStatus).to.equal('BA');
    expect(endringPeriodeInitialValues[0].nyAndel).to.equal(false);
    expect(endringPeriodeInitialValues[0].lagtTilAvSaksbehandler).to.equal(false);
    expect(endringPeriodeInitialValues[0].inntektskategori).to.equal('');
    expect(endringPeriodeInitialValues[0].arbeidsforholdId).to.equal('');
    expect(endringPeriodeInitialValues[0].arbeidsperiodeFom).to.equal('');
    expect(endringPeriodeInitialValues[0].arbeidsperiodeTom).to.equal('');
    expect(endringPeriodeInitialValues[0].refusjonskrav).to.equal('0');
    expect(endringPeriodeInitialValues[0].refusjonskravFraInntektsmelding).to.equal(null);
    expect(endringPeriodeInitialValues[0].fordelingForrigeBehandling).to.equal('10 000');
    expect(endringPeriodeInitialValues[0].skalKunneEndreRefusjon).to.equal(false);
    expect(endringPeriodeInitialValues[0].harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);

    expect(endringPeriodeInitialValues[1].andel).to.equal('Virksomheten (3284788923) ...a7e2');
    expect(endringPeriodeInitialValues[1].andelsnr).to.equal(2);
    expect(endringPeriodeInitialValues[1].aktivitetStatus).to.equal('AT');
    expect(endringPeriodeInitialValues[1].nyAndel).to.equal(false);
    expect(endringPeriodeInitialValues[1].lagtTilAvSaksbehandler).to.equal(false);
    expect(endringPeriodeInitialValues[1].inntektskategori).to.equal('ARBEIDSTAKER');
    expect(endringPeriodeInitialValues[1].arbeidsforholdId).to.equal('321378huda7e2');
    expect(endringPeriodeInitialValues[1].arbeidsperiodeFom).to.equal('2017-01-01');
    expect(endringPeriodeInitialValues[1].arbeidsperiodeTom).to.equal('2018-01-01');
    expect(endringPeriodeInitialValues[1].refusjonskrav).to.equal('10 000');
    expect(endringPeriodeInitialValues[1].fordelingForrigeBehandling).to.equal('10 000');
    expect(endringPeriodeInitialValues[1].skalKunneEndreRefusjon).to.equal(true);
    expect(endringPeriodeInitialValues[1].harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);
  });


  it('skal ikkje validere om values er udefinert', () => {
    const errors = Panel.validate(undefined, [], null, null);
    expect(errors).to.equal(null);
  });

  const setKunYtelseFastsattBeløp = (fastsattBeløp, inntektskategori) => {
    const values = {};
    values[brukersAndelFieldArrayName] = [{
      fastsattBeløp,
      inntektskategori,
    }];
    return values;
  };

  const kunYtelseUtenDP = {
    fodendeKvinneMedDP: false,
  };

  const assertEmptyKunYtelseError = (errors) => {
    const kunYtelseError = errors[brukersAndelFieldArrayName];
    expect(kunYtelseError).to.equal(null);
  };

  it('skal ikkje validere om det ikkje er kun ytelse og endret beregningsgrunnlag', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    const endringBGPerioder = [{ fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false }];
    const errors = Panel.validate(values, [], kunYtelseUtenDP, endringBGPerioder);
    expect(errors).to.equal(null);
  });


  it('skal validere kun ytelse om det ikkje er fastsatt beløp', () => {
    const endringBGPerioder = [{ fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false }];
    const errors = Panel.validate(setKunYtelseFastsattBeløp(null, 'ARBEIDSTAKER'),
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP, endringBGPerioder);
    const kunYtelseError = errors[brukersAndelFieldArrayName];
    expect(kunYtelseError.length).to.equal(1);
    expect(kunYtelseError[0].fastsattBeløp[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal validere kun ytelse om det ikkje er fastsatt inntektskategori', () => {
    const endringBGPerioder = [{ fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false }];
    const errors = Panel.validate(setKunYtelseFastsattBeløp('10 000', ''),
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP, endringBGPerioder);
    const kunYtelseError = errors[brukersAndelFieldArrayName];
    expect(kunYtelseError.length).to.equal(1);
    expect(kunYtelseError[0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });


  it('skal ikkje returnere errors når ingen feil', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '10 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    const endringError = errors[getFieldNameKey(0)];
    expect(endringError).to.equal(null);
  });

  it('skal returnere errors når fastsattBeløp mangler', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp[0].id).to.equal(isRequiredMessage()[0].id);
    expect(errors[getFieldNameKey(0)][0].inntektskategori).to.equal(undefined);
  });

  it('skal returnere errors når inntektskategori mangler', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBeløp[0].id).to.equal(isRequiredMessage()[0].id);
    expect(errors[getFieldNameKey(0)][0].inntektskategori).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal ikkje validere på refusjon når den ikkje skal kunne endres', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].refusjonskrav).to.equal(undefined);
  });

  it('skal returnere errors når refusjon mangler', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].refusjonskrav).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].refusjonskrav[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnere errors når andel mangler', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnere felt-errors før validering på sum', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBeløp: '120 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].andel[0].id).to.equal(isRequiredMessage()[0].id);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error).to.equal(undefined);
  });


  it('skal returnere validering på sum', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(errors[getFieldNameKey(0)]._error[1].fordeling).to.equal('10 000');
  });

  const getAndel = (andelsnr, andelsinfo, inntektskategori) => ({
    andelsnr,
    refusjonskrav: '10 000',
    fastsattBeløp: '10 000',
    belopFraInntektsmelding: 15000,
    skalKunneEndreRefusjon: true,
    aktivitetstatus: 'ARBEIDSTAKER',
    andel: andelsinfo || `Visningsnavn ${andelsnr}`,
    harPeriodeAarsakGraderingEllerRefusjon: true,
    inntektskategori: inntektskategori || 'ARBEIDSTAKER',
    refusjonskravFraInntektsmelding: 10000,
    nyAndel: !!andelsinfo,
    lagtTilAvSaksbehandler: !!andelsinfo,
  });

  it('skal returnere validering på sum for fleire andeler', () => {
    const values = {};
    values[brukersAndelFieldArrayName] = [
      { andelsnr: 1, fastsattBeløp: '10 000' }, { andelsnr: 2, fastsattBeløp: '10 000' },
      { andelsnr: 3, fastsattBeløp: '10 000' }, { andelsnr: 4, fastsattBeløp: '10 000' },
    ];

    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), getAndel(4), getAndel(undefined, '1', 'SJØMANN')];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(errors[getFieldNameKey(0)]._error[1].fordeling).to.equal('40 000');
  });

  it('skal ikkje returnere errors når sum er lik sum i første periode for fleire andeler', () => {
    const values = {};
    values[brukersAndelFieldArrayName] = [
      { andelsnr: 1, fastsattBeløp: '10 000' }, { andelsnr: 2, fastsattBeløp: '10 000' },
      { andelsnr: 3, fastsattBeløp: '10 000' }, { andelsnr: 4, fastsattBeløp: '10 000' },
    ];
    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), { ...getAndel(4), ...{ fastsattBeløp: '5 000' } },
      { ...getAndel(undefined, '1', 'SJØMANN'), ...{ fastsattBeløp: '5 000' } }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.equal(null);
  });


  it('skal returnere errors når det finnes 2 andeler for samme virksomhet med samme inntektskategori', () => {
    const values = {};
    values[brukersAndelFieldArrayName] = [
      { andelsnr: 1, fastsattBeløp: '10 000' }, { andelsnr: 2, fastsattBeløp: '10 000' },
      { andelsnr: 3, fastsattBeløp: '10 000' }, { andelsnr: 4, fastsattBeløp: '10 000' },
    ];
    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), { ...getAndel(4), ...{ fastsattBeløp: '5 000' } },
      { ...getAndel(undefined, '1', undefined), ...{ fastsattBeløp: '5 000' } }];
    const endringBGPerioder = [{ fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false },
      { fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true }];
    const errors = Panel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });
});
