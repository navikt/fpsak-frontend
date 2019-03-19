import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import VurderOgFastsettATFL, { inntektFieldArrayName, skalViseInntektstabell } from './VurderOgFastsettATFL';
import VurderBesteberegningForm, { besteberegningField } from '../besteberegningFodendeKvinne/VurderBesteberegningForm';
import LonnsendringForm, { lonnsendringField } from './forms/LonnsendringForm';
import NyoppstartetFLForm, { erNyoppstartetFLField } from './forms/NyoppstartetFLForm';
import VurderMottarYtelseForm from './forms/VurderMottarYtelseForm';
import InntektstabellPanel from '../InntektstabellPanel';


const lagBeregningsgrunnlag = andeler => ({
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: andeler.map(andel => (
        {
          andelsnr: andel.andelsnr,
          aktivitetStatus: { kode: andel.aktivitetStatus },
          inntektskategori: { kode: andel.inntektskategori },
          erNyoppstartet: andel.erNyoppstartet,
        }
      )),
    },
  ],
});

const lagFaktaOmBeregning = (tilfeller, vurderBesteberegning, arbeidsforholdMedLønnsendringUtenIM, arbeidstakerOgFrilanserISammeOrganisasjonListe,
  vurderMottarYtelse = {}) => ({
  faktaOmBeregningTilfeller: tilfeller.map(kode => ({ kode })),
  vurderBesteberegning,
  arbeidsforholdMedLønnsendringUtenIM,
  arbeidstakerOgFrilanserISammeOrganisasjonListe,
  vurderMottarYtelse,
});

const lagAndel = (andelsnr, aktivitetStatus, inntektskategori) => (
  { andelsnr, aktivitetStatus, inntektskategori }
);

const lagAndelValues = (andelsnr, fastsattBelop, inntektskategori, aktivitetStatus, lagtTilAvSaksbehandler = false, nyAndel = false) => ({
  nyAndel, andelsnr, fastsattBelop, inntektskategori, aktivitetStatus, lagtTilAvSaksbehandler, skalRedigereInntekt: true,
});

describe('<VurderOgFastsettATFL>', () => {
  it('skal vise tabell om alt er vurdert og det er refusjon/gradering aksjonspunkt', () => {
    const values = {};
    values.mottarYtelseField1 = false;
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const faktaOmBeregning = lagFaktaOmBeregning(tilfeller,
      {}, undefined, undefined, { arbeidstakerAndelerUtenIM: { andelsnr: 1 } });
    const skalVise = skalViseInntektstabell(tilfeller, values, faktaOmBeregning, {});
    expect(skalVise).to.equal(true);
  });

  it('skal ikkje vise tabell om det er refusjon/gradering og bestebergning er vurdert til true', () => {
    const values = {};
    values[besteberegningField] = true;
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING, faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const faktaOmBeregning = lagFaktaOmBeregning(tilfeller,
      { }, undefined, undefined);
    const skalVise = skalViseInntektstabell(tilfeller, values, faktaOmBeregning, {});
    expect(skalVise).to.equal(false);
  });

  it('skal vise tabell om det er refusjon/gradering og bestebergning er vurdert til false', () => {
    const values = {};
    values[besteberegningField] = false;
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING, faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const faktaOmBeregning = lagFaktaOmBeregning(tilfeller,
      { }, undefined, undefined);
    const skalVise = skalViseInntektstabell(tilfeller, values, faktaOmBeregning, {});
    expect(skalVise).to.equal(true);
  });

  it('skal transform values om besteberegning', () => {
    const values = {};
    values[besteberegningField] = true;
    values[inntektFieldArrayName] = [
      lagAndelValues(1, '10 000', inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
      lagAndelValues(undefined, '20 000', inntektskategorier.DAGPENGER, aktivitetStatuser.DAGPENGER, true, true),
    ];
    const andeler = [lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER)];
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler);
    const faktaOmBeregning = lagFaktaOmBeregning([faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING], {}, undefined, undefined);
    const transformed = VurderOgFastsettATFL.transformValues(faktaOmBeregning, beregningsgrunnlag)(values);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe.length).to.equal(2);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[0].andelsnr).to.equal(1);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.fastsattBeløp).to.equal(10000);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].andelsnr).to.equal(undefined);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].lagtTilAvSaksbehandler).to.equal(true);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].nyAndel).to.equal(true);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.inntektskategori).to.equal('DAGPENGER');
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].aktivitetStatus).to.equal('DP');
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.fastsattBeløp).to.equal(20000);
  });


  it('skal ikkje transform inntekt for nyoppstartetFL og lønnsendring når man har besteberegning', () => {
    const values = {};
    values[besteberegningField] = true;
    values[lonnsendringField] = true;
    values[erNyoppstartetFLField] = true;
    values[inntektFieldArrayName] = [
      lagAndelValues(1, '10 000', inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
      lagAndelValues(2, '30 000', inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(undefined, '20 000', inntektskategorier.DAGPENGER, aktivitetStatuser.DAGPENGER, true, true),
    ];
    const andelMedLonnsendring = lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER);
    const andeler = [
      andelMedLonnsendring,
      lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
    ];
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler);
    const faktaOmBeregning = lagFaktaOmBeregning([faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING], {}, [andelMedLonnsendring], undefined);
    const transformed = VurderOgFastsettATFL.transformValues(faktaOmBeregning, beregningsgrunnlag)(values);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe.length).to.equal(3);
    expect(transformed.faktaOmBeregningTilfeller.length).to.equal(4);
  });


  it('skal fastsette inntekt for nyoppstartetFL og arbeidstaker uten inntektsmelding med lønnendring', () => {
    const values = {};
    values[lonnsendringField] = true;
    values[erNyoppstartetFLField] = true;
    values[inntektFieldArrayName] = [
      lagAndelValues(1, '10 000', inntektskategorier.ARBEIDSTAKER, aktivitetStatuser.ARBEIDSTAKER),
      lagAndelValues(2, '30 000', inntektskategorier.FRILANSER, aktivitetStatuser.FRILANSER),
      lagAndelValues(undefined, '20 000', inntektskategorier.DAGPENGER, aktivitetStatuser.DAGPENGER, true, true),
    ];
    const andelMedLonnsendring = lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER);
    const andeler = [
      andelMedLonnsendring,
      {
        ...lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
        erNyoppstartet: true,
      },
    ];
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler);
    const faktaOmBeregning = lagFaktaOmBeregning([faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL], {}, [andelMedLonnsendring], undefined);
    const transformed = VurderOgFastsettATFL.transformValues(faktaOmBeregning, beregningsgrunnlag)(values);
    expect(transformed.fastsattUtenInntektsmelding.andelListe.length).to.equal(1);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.equal(1);
    expect(transformed.fastsattUtenInntektsmelding.andelListe[0].arbeidsinntekt).to.equal(10000);
    expect(transformed.fastsettMaanedsinntektFL.maanedsinntekt).to.equal(30000);
    expect(transformed.faktaOmBeregningTilfeller.length).to.equal(4);
    expect(transformed.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)).to.equal(true);
    expect(transformed.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)).to.equal(true);
    expect(transformed.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)).to.equal(true);
    expect(transformed.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)).to.equal(true);
  });


  it('skal vise komponent', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING, faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
    ];
    const wrapper = shallow(<VurderOgFastsettATFL.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfeller={tilfeller}
      skalViseTabell={false}
      skalFastsetteAT
      skalFastsetteFL={false}
      skalHaBesteberegning={false}
      manglerInntektsmelding
    />);
    const inntektstabellPanel = wrapper.find(InntektstabellPanel);
    const lonnsendringForm = inntektstabellPanel.find(LonnsendringForm);
    expect(lonnsendringForm.length).to.equal(1);

    const besteberegningForm = inntektstabellPanel.find(VurderBesteberegningForm);
    expect(besteberegningForm.length).to.equal(1);

    const nyoppstartetFLForm = inntektstabellPanel.find(NyoppstartetFLForm);
    expect(nyoppstartetFLForm.length).to.equal(1);

    const vurderMottarYtelseForm = inntektstabellPanel.find(VurderMottarYtelseForm);
    expect(vurderMottarYtelseForm.length).to.equal(1);
  });
});
