import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import KunYtelseTilkommetArbeidPanel from './KunYtelseTilkommetArbeidPanel';
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
  aktivitetStatus: { kode: aktivitetStatus.ARBEIDSTAKER },
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
  aktivitetStatus: { kode: aktivitetStatus.BRUKERS_ANDEL },
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
  aktivitetStatus: { kode: aktivitetStatus.BRUKERS_ANDEL },
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

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === aktivitetStatus.BRUKERS_ANDEL) {
    return 'Brukers andel';
  }
  if (kodeverk.kode === aktivitetStatus.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }
  return '';
};

describe('<KunYtelseTilkommetArbeidsforholdPanel>', () => {
  it('skal ikkje vise tilkommetpanel', () => {
    const wrapper = shallowWithIntl(<KunYtelseTilkommetArbeidPanel.WrappedComponent
      readOnly={false}
      skalSjekkeBesteberegning
      isAksjonspunktClosed={false}
      perioder={[]}
      skalViseTilkommetTabell={false}
      harKunBrukersAndelIForstePeriode
    />);
    const tilkommetTabell = wrapper.find(EndringBeregningsgrunnlagForm);
    expect(tilkommetTabell).to.have.length(0);
  });

  it('skal vise tilkommetpanel', () => {
    const wrapper = shallowWithIntl(<KunYtelseTilkommetArbeidPanel.WrappedComponent
      readOnly={false}
      skalSjekkeBesteberegning
      isAksjonspunktClosed={false}
      perioder={[]}
      skalViseTilkommetTabell
      harKunBrukersAndelIForstePeriode
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
    const initialValues = KunYtelseTilkommetArbeidPanel.buildInitialValues(kunYtelse, perioder, false, kunYtelseOgEndringTilfeller, getKodeverknavn);
    const brukersAndelInitialValues = initialValues[`${brukersAndelFieldArrayName}`];
    expect(brukersAndelInitialValues).to.have.length(2);
    expect(brukersAndelInitialValues[0].andelsnr).to.equal(1);
    expect(brukersAndelInitialValues[0].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[0].aktivitetStatus).to.equal('BA');
    expect(brukersAndelInitialValues[0].fastsattBelop).to.equal('10 000');
    expect(brukersAndelInitialValues[0].inntektskategori).to.equal('');
    expect(brukersAndelInitialValues[0].nyAndel).to.equal(false);
    expect(brukersAndelInitialValues[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(brukersAndelInitialValues[1].andelsnr).to.equal(2);
    expect(brukersAndelInitialValues[1].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[1].fastsattBelop).to.equal('20 000');
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
    expect(endringPeriodeInitialValues[0].arbeidsforholdId).to.equal(null);
    expect(endringPeriodeInitialValues[0].arbeidsperiodeFom).to.equal('');
    expect(endringPeriodeInitialValues[0].arbeidsperiodeTom).to.equal('');
    expect(endringPeriodeInitialValues[0].refusjonskrav).to.equal('0');
    expect(endringPeriodeInitialValues[0].refusjonskravFraInntektsmelding).to.equal(null);
    expect(endringPeriodeInitialValues[0].fordelingForrigeBehandling).to.equal(null);
    expect(endringPeriodeInitialValues[0].skalKunneEndreRefusjon).to.equal(false);
    expect(endringPeriodeInitialValues[0].harPeriodeAarsakGraderingEllerRefusjon).to.equal(true);
    expect(endringPeriodeInitialValues[0].fastsattBelop).to.equal('10 000');

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
    expect(endringPeriodeInitialValues[1].fastsattBelop).to.equal('');
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
    const initialValues = KunYtelseTilkommetArbeidPanel.buildInitialValues(kunYtelse, perioder, true, kunYtelseOgEndringTilfeller, getKodeverknavn);
    const brukersAndelInitialValues = initialValues[`${brukersAndelFieldArrayName}`];
    expect(brukersAndelInitialValues).to.have.length(2);
    expect(brukersAndelInitialValues[0].andelsnr).to.equal(1);
    expect(brukersAndelInitialValues[0].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[0].aktivitetStatus).to.equal('BA');
    expect(brukersAndelInitialValues[0].fastsattBelop).to.equal('10 000');
    expect(brukersAndelInitialValues[0].inntektskategori).to.equal('');
    expect(brukersAndelInitialValues[0].nyAndel).to.equal(false);
    expect(brukersAndelInitialValues[0].lagtTilAvSaksbehandler).to.equal(false);

    expect(brukersAndelInitialValues[1].andelsnr).to.equal(2);
    expect(brukersAndelInitialValues[1].andel).to.equal('Brukers andel');
    expect(brukersAndelInitialValues[1].fastsattBelop).to.equal('20 000');
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
    expect(endringPeriodeInitialValues[0].arbeidsforholdId).to.equal(null);
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
    const errors = KunYtelseTilkommetArbeidPanel.validate(undefined, [], null, null);
    expect(errors).to.equal(null);
  });

  const setKunYtelseFastsattBeløp = (fastsattBelop, inntektskategori) => {
    const values = {};
    values[brukersAndelFieldArrayName] = [{
      fastsattBelop,
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
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values, [], kunYtelseUtenDP, endringBGPerioder);
    expect(errors).to.equal(null);
  });


  it('skal validere kun ytelse om det ikkje er fastsatt beløp', () => {
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(setKunYtelseFastsattBeløp(null, 'ARBEIDSTAKER'),
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP, endringBGPerioder);
    const kunYtelseError = errors[brukersAndelFieldArrayName];
    expect(kunYtelseError.length).to.equal(1);
    expect(kunYtelseError[0].fastsattBelop[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal validere kun ytelse om det ikkje er fastsatt inntektskategori', () => {
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: null, harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(setKunYtelseFastsattBeløp('10 000', ''),
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
      fastsattBelop: '10 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: null, harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
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
      fastsattBelop: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBelop).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBelop[0].id).to.equal(isRequiredMessage()[0].id);
    expect(errors[getFieldNameKey(0)][0].inntektskategori).to.equal(undefined);
  });

  it('skal returnere errors når inntektskategori mangler', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBelop: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBelop).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].fastsattBelop[0].id).to.equal(isRequiredMessage()[0].id);
    expect(errors[getFieldNameKey(0)][0].inntektskategori).to.have.length(1);
    expect(errors[getFieldNameKey(0)][0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal ikkje validere på refusjon når den ikkje skal kunne endres', () => {
    const values = setKunYtelseFastsattBeløp('10 000', 'ARBEIDSTAKER');
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '',
      fastsattBelop: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: false,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
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
      fastsattBelop: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
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
      fastsattBelop: '',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
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
      fastsattBelop: '120 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: '',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
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
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(errors[getFieldNameKey(0)]._error[1].fordeling).to.equal('10 000');
  });

  it('skal ikkje returnere validering på sum om det ikkje er kun BA i første periode', () => {
    const values = {};
    values[getFieldNameKey(0)] = [{
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    values[getFieldNameKey(1)] = [{
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
    }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [{ aktivitetStatus: { kode: 'AT' } }],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    assertEmptyKunYtelseError(errors);
    expect(errors[getFieldNameKey(0)]).to.equal(null);
  });

  const getAndel = (andelsnr, andelsinfo, inntektskategori) => ({
    andelsnr,
    refusjonskrav: '10 000',
    fastsattBelop: '10 000',
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
      { andelsnr: 1, fastsattBelop: '10 000' }, { andelsnr: 2, fastsattBelop: '10 000' },
      { andelsnr: 3, fastsattBelop: '10 000' }, { andelsnr: 4, fastsattBelop: '10 000' },
    ];

    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), getAndel(4), getAndel(undefined, '1', 'SJØMANN')];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
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
      { andelsnr: 1, fastsattBelop: '10 000' }, { andelsnr: 2, fastsattBelop: '10 000' },
      { andelsnr: 3, fastsattBelop: '10 000' }, { andelsnr: 4, fastsattBelop: '10 000' },
    ];
    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), { ...getAndel(4), ...{ fastsattBelop: '5 000' } },
      { ...getAndel(undefined, '1', 'SJØMANN'), ...{ fastsattBelop: '5 000' } }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    expect(errors[getFieldNameKey(0)]).to.equal(null);
  });


  it('skal returnere errors når det finnes 2 andeler for samme virksomhet med samme inntektskategori', () => {
    const values = {};
    values[brukersAndelFieldArrayName] = [
      { andelsnr: 1, fastsattBelop: '10 000' }, { andelsnr: 2, fastsattBelop: '10 000' },
      { andelsnr: 3, fastsattBelop: '10 000' }, { andelsnr: 4, fastsattBelop: '10 000' },
    ];
    values[getFieldNameKey(0)] = [getAndel(1), getAndel(2), getAndel(3), { ...getAndel(4), ...{ fastsattBelop: '5 000' } },
      { ...getAndel(undefined, '1', undefined), ...{ fastsattBelop: '5 000' } }];
    const endringBGPerioder = [{
 fom: '2018-08-01', tom: '2018-10-01', harPeriodeAarsakGraderingEllerRefusjon: false, endringBeregningsgrunnlagAndeler: [],
},
      {
 fom: '2018-10-02', tom: 'null', harPeriodeAarsakGraderingEllerRefusjon: true, endringBeregningsgrunnlagAndeler: [],
}];
    const errors = KunYtelseTilkommetArbeidPanel.validate(values,
      kunYtelseOgEndringTilfeller,
      kunYtelseUtenDP,
      endringBGPerioder);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors[getFieldNameKey(0)]._error[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });
});
