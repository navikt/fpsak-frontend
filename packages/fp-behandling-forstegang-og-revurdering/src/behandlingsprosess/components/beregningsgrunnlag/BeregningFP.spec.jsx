import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme/build';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BeregningFPImpl } from './BeregningFP';
import BeregningTable from './beregningsresultatPanel/BeregningsresultatTable';
import BeregningForm from './beregningForm/BeregningForm';
import GraderingUtenBG from './gradering/GraderingUtenBG';

const lagBeregningsgrunnlag = (ferdigstilt) => {
  const beregningsgrunnlag = {
    halvG: 30000,
    ledetekstBrutto: 'Brutto tekst',
    ledetekstAvkortet: 'Avkortet tekst',
    ledetekstRedusert: 'Redusert tekst',
    skjaeringstidspunktBeregning: '12.12.2017',
    aktivitetStatus: [{
      aktivitetStatus: {
        kode: aktivitetStatus.ARBEIDSTAKER,
        navn: 'Arbeidstaker',
        kodeverk: 'test',
      },
    }],
    beregningsgrunnlagPeriode: [
      {
        dagsats: ferdigstilt ? 1500 : undefined,
      },
    ],
  };
  return beregningsgrunnlag;
};

const beregningsgrunnlag = {
  halvG: 30000,
  ledetekstBrutto: 'Brutto tekst',
  ledetekstAvkortet: 'Avkortet tekst',
  ledetekstRedusert: 'Redusert tekst',
  skjaeringstidspunktBeregning: '12.12.2017',
  aktivitetStatus: [{
    aktivitetStatus: {
      kode: aktivitetStatus.ARBEIDSTAKER,
      navn: 'Arbeidstaker',
      kodeverk: 'test',
    },
  }],
};
const vilkar = {
  vilkarStatus: {
    kode: vilkarUtfallType.OPPFYLT,
  },
};
const vilkarAvslått = {
  vilkarStatus: {
    kode: vilkarUtfallType.IKKE_OPPFYLT,
  },
};

const gjeldendeAksjonspunkter = [{
  id: 55,
  erAktivt: true,
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    navn: 'Fastsett varig brutto beregning ATFL',
  },
  toTrinnsBehandling: false,
  status: {
    kode: 'OPPR',
    navn: 'Opprettet',
  },
  begrunnelse: 'begrunnelse arbeidstaker/frilans',
  vilkarType: null,
  kanLoses: true,
}];
const relevanteStatuser = {
  isArbeidstaker: true,
  isKombinasjonsstatus: true,
};

describe('<BeregningFP>', () => {
  it('skal teste at BeregningTable og BeregningForm får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={lagBeregningsgrunnlag(true)}
      beregnetAarsinntekt={100000}
      sammenligningsgrunnlag={100000}
      beregnetAvvikPromille={50}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningTable = wrapper.find(BeregningTable);
    expect(beregningTable.props().halvGVerdi).to.have.equal(30000);
    expect(beregningTable.props().ledetekstBrutto).to.have.equal('Brutto tekst');
    expect(beregningTable.props().ledetekstAvkortet).to.have.equal('Avkortet tekst');
    expect(beregningTable.props().ledetekstRedusert).to.have.equal('Redusert tekst');
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm.props().readOnly).to.have.equal(false);
    expect(beregningForm.props().beregnetAarsinntekt).to.have.equal(100000);
    expect(beregningForm.props().sammenligningsgrunnlag).to.have.equal(100000);
    expect(beregningForm.props().gjeldendeAksjonspunkter).to.have.equal(gjeldendeAksjonspunkter);
    expect(beregningForm.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    expect(beregningForm.props().submitCallback).to.have.equal(sinon.spy);
    expect(beregningForm.props().avvikProsent).to.equal(5);
  });
  it('skal teste at BeregningTable ikke vises dersom det ikke er dagsats på periodene', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={lagBeregningsgrunnlag(false)}
      beregnetAarsinntekt={100000}
      sammenligningsgrunnlag={100000}
      beregnetAvvikPromille={50}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningTable = wrapper.find(BeregningTable);
    expect(beregningTable).to.be.lengthOf(0);
  });
  it('skal teste at BeregningTable vises dersom det ikke er dagsats på periodene men vilkåret er avslått', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={lagBeregningsgrunnlag(false)}
      beregnetAarsinntekt={100000}
      sammenligningsgrunnlag={100000}
      beregnetAvvikPromille={50}
      gjeldendeVilkar={vilkarAvslått}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningTable = wrapper.find(BeregningTable);
    expect(beregningTable).to.be.lengthOf(1);
  });


  it('skal teste at BeregningForm får korrekte props fra BeregningFP med beregnetAvvikPromille lik NULL', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={beregningsgrunnlag}
      beregnetAarsinntekt={100000}
      sammenligningsgrunnlag={100000}
      beregnetAvvikPromille={null}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm.props().readOnly).to.have.equal(false);
    expect(beregningForm.props().beregnetAarsinntekt).to.have.equal(100000);
    expect(beregningForm.props().sammenligningsgrunnlag).to.have.equal(100000);
    expect(beregningForm.props().gjeldendeAksjonspunkter).to.have.equal(gjeldendeAksjonspunkter);
    expect(beregningForm.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    expect(beregningForm.props().submitCallback).to.have.equal(sinon.spy);
    expect(beregningForm.props().avvikProsent).to.equal(undefined);
  });
  it('skal teste at BeregningForm får korrekte props fra BeregningFP med beregnetAvvikPromille lik undefined', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={beregningsgrunnlag}
      beregnetAarsinntekt={250000}
      sammenligningsgrunnlag={250000}
      beregnetAvvikPromille={undefined}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm.props().readOnly).to.have.equal(false);
    expect(beregningForm.props().beregnetAarsinntekt).to.have.equal(250000);
    expect(beregningForm.props().sammenligningsgrunnlag).to.have.equal(250000);
    expect(beregningForm.props().gjeldendeAksjonspunkter).to.have.equal(gjeldendeAksjonspunkter);
    expect(beregningForm.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    expect(beregningForm.props().submitCallback).to.have.equal(sinon.spy);
    expect(beregningForm.props().avvikProsent).to.equal(undefined);
  });
  it('skal teste visning av komponenter når beregningsgrunnlag er lik null', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={undefined}
      beregnetAarsinntekt={250000}
      sammenligningsgrunnlag={250000}
      beregnetAvvikPromille={undefined}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm).to.be.lengthOf(0);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.be.lengthOf(3);
    expect(messages.get(0).props.id).to.equal('Beregningsgrunnlag.Title');
    expect(messages.get(1).props.id).to.equal('Beregningsgrunnlag.HarIkkeBeregningsregler');
    expect(messages.get(2).props.id).to.equal('Beregningsgrunnlag.SakTilInfo');
  });
  it('skal teste visning av komponenter når beregningsgrunnlag ikke er null', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={beregningsgrunnlag}
      beregnetAarsinntekt={250000}
      sammenligningsgrunnlag={250000}
      beregnetAvvikPromille={undefined}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm).to.be.lengthOf(1);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.be.lengthOf(0);
  });
  it('skal teste at GraderingUtenBG vises når sokerHarGraderingPaaAndelUtenBG er true', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={beregningsgrunnlag}
      beregnetAarsinntekt={250000}
      sammenligningsgrunnlag={250000}
      beregnetAvvikPromille={undefined}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG
    />);
    const graderingUtenBG = wrapper.find(GraderingUtenBG);
    expect(graderingUtenBG).to.be.lengthOf(1);
  });
  it('skal teste at GraderingUtenBG vises når sokerHarGraderingPaaAndelUtenBG er false', () => {
    const wrapper = shallow(<BeregningFPImpl
      readOnly={false}
      submitCallback={sinon.spy}
      berGr={beregningsgrunnlag}
      beregnetAarsinntekt={250000}
      sammenligningsgrunnlag={250000}
      beregnetAvvikPromille={undefined}
      gjeldendeVilkar={vilkar}
      gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
      relevanteStatuser={relevanteStatuser}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const graderingUtenBG = wrapper.find(GraderingUtenBG);
    expect(graderingUtenBG).to.be.lengthOf(0);
  });
});
