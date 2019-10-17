import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme/build';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningFP from './BeregningFP';
import BeregningTable from './beregningsresultatPanel/BeregningsresultatTable';
import BeregningForm from './beregningForm/BeregningForm';
import GraderingUtenBG from './gradering/GraderingUtenBG';


const lagBeregningsgrunnlag = (ferdigstilt, beregnetPrAar, sammenligningSum, avvikPromille, gradering) => {
  const beregningsgrunnlag = {
    halvG: 30000,
    ledetekstBrutto: 'Brutto tekst',
    ledetekstAvkortet: 'Avkortet tekst',
    ledetekstRedusert: 'Redusert tekst',
    skjaeringstidspunktBeregning: '12.12.2017',
    årsinntektVisningstall: beregnetPrAar,
    andelerMedGraderingUtenBG: gradering,
    sammenligningsgrunnlag: {
      avvikPromille,
      rapportertPrAar: sammenligningSum,
    },
    aktivitetStatus: [
      {
        kode: aktivitetStatus.KOMBINERT_AT_SN,
        navn: 'Arbeidstaker',
        kodeverk: 'test',
      },
    ],
    beregningsgrunnlagPeriode: [
      {
        dagsats: ferdigstilt ? 1500 : undefined,
      },
    ],
  };
  return beregningsgrunnlag;
};

const vilkar = [{
  vilkarType: {
    kode: 'FP_VK_41',
  },
  vilkarStatus: {
    kode: vilkarUtfallType.OPPFYLT,
  },
}];
const vilkarAvslått = [{
  vilkarType: {
    kode: 'FP_VK_41',
  },
  vilkarStatus: {
    kode: vilkarUtfallType.IKKE_OPPFYLT,
  },
}];

const graderingAP = [{
  id: 55,
  erAktivt: true,
  definisjon: {
    kode: aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
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

const behandling = {
  id: 1,
  versjon: 1,
  venteArsakKode: '-',
  sprakkode: {
    kode: 'NB',
    kodeverk: 'Språkode',
  },
};

const alleKodeverk = {
  test: 'test',
};

describe('<BeregningFP>', () => {
  it('skal teste at BeregningTable og BeregningForm får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      beregningsgrunnlag={lagBeregningsgrunnlag(true, 100000, 100000, 50, null)}
      vilkar={vilkar}
      behandling={behandling}
      alleKodeverk={alleKodeverk}
      aksjonspunkter={gjeldendeAksjonspunkter}
      readOnlySubmitButton
    />);
    const beregningTable = wrapper.find(BeregningTable);
    expect(beregningTable.props().halvGVerdi).to.have.equal(30000);
    expect(beregningTable.props().ledetekstBrutto).to.have.equal('Brutto tekst');
    expect(beregningTable.props().ledetekstAvkortet).to.have.equal('Avkortet tekst');
    expect(beregningTable.props().ledetekstRedusert).to.have.equal('Redusert tekst');
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm.props().readOnly).to.have.equal(false);
    expect(beregningForm.props().gjeldendeAksjonspunkter).to.eql(gjeldendeAksjonspunkter);
    expect(beregningForm.props().relevanteStatuser.isArbeidstaker).to.eql(true);
    expect(beregningForm.props().relevanteStatuser.isSelvstendigNaeringsdrivende).to.eql(true);
    expect(beregningForm.props().relevanteStatuser.isKombinasjonsstatus).to.eql(true);
    expect(beregningForm.props().relevanteStatuser.skalViseBeregningsgrunnlag).to.eql(true);
    expect(beregningForm.props().submitCallback).to.have.equal(sinon.spy);
  });
  it('skal teste at BeregningTable ikke vises dersom det ikke er dagsats på periodene', () => {
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      beregningsgrunnlag={lagBeregningsgrunnlag(false, 100000, 100000, 50, null)}
      vilkar={vilkar}
      behandling={behandling}
      alleKodeverk={alleKodeverk}
      aksjonspunkter={gjeldendeAksjonspunkter}
      readOnlySubmitButton
    />);
    const beregningTable = wrapper.find(BeregningTable);
    expect(beregningTable).to.be.lengthOf(0);
  });
  it('skal teste at BeregningTable vises dersom det ikke er dagsats på periodene men vilkåret er avslått', () => {
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      beregningsgrunnlag={lagBeregningsgrunnlag(true, 100000, 100000, 50, null)}
      behandling={behandling}
      alleKodeverk={alleKodeverk}
      aksjonspunkter={gjeldendeAksjonspunkter}
      vilkar={vilkarAvslått}
      readOnlySubmitButton
    />);
    const beregningTable = wrapper.find(BeregningTable);
    expect(beregningTable).to.be.lengthOf(1);
  });
  it('skal teste at BeregningForm får korrekte props fra BeregningFP med beregnetAvvikPromille lik NULL', () => {
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      beregningsgrunnlag={lagBeregningsgrunnlag(true, 100000, 100000, null, null)}
      vilkar={vilkar}
      behandling={behandling}
      alleKodeverk={alleKodeverk}
      aksjonspunkter={gjeldendeAksjonspunkter}
      readOnlySubmitButton
      sokerHarGraderingPaaAndelUtenBG={false}
    />);
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm.props().readOnly).to.have.equal(false);
    expect(beregningForm.props().gjeldendeAksjonspunkter).to.eql(gjeldendeAksjonspunkter);
    expect(beregningForm.props().relevanteStatuser.isArbeidstaker).to.eql(true);
    expect(beregningForm.props().relevanteStatuser.isSelvstendigNaeringsdrivende).to.eql(true);
    expect(beregningForm.props().relevanteStatuser.isKombinasjonsstatus).to.eql(true);
    expect(beregningForm.props().relevanteStatuser.skalViseBeregningsgrunnlag).to.eql(true);
    expect(beregningForm.props().submitCallback).to.have.equal(sinon.spy);
  });
  it('skal teste visning av komponenter når beregningsgrunnlag er lik null', () => {
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      beregningsgrunnlag={null}
      vilkar={vilkar}
      behandling={behandling}
      alleKodeverk={alleKodeverk}
      aksjonspunkter={gjeldendeAksjonspunkter}
      readOnlySubmitButton
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
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      alleKodeverk={alleKodeverk}
      beregningsgrunnlag={lagBeregningsgrunnlag(true, 250000, 250000, undefined, null)}
      vilkar={vilkar}
      aksjonspunkter={gjeldendeAksjonspunkter}
      behandling={behandling}
      readOnlySubmitButton
    />);
    const beregningForm = wrapper.find(BeregningForm);
    expect(beregningForm).to.be.lengthOf(1);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.be.lengthOf(0);
  });
  it('skal teste at GraderingUtenBG vises når sokerHarGraderingPaaAndelUtenBG er true', () => {
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      beregningsgrunnlag={lagBeregningsgrunnlag(true, 250000, 250000, undefined, [{ test: 'test' }])}
      vilkar={vilkar}
      aksjonspunkter={graderingAP}
      behandling={behandling}
      alleKodeverk={alleKodeverk}
      readOnlySubmitButton
    />);
    const graderingUtenBG = wrapper.find(GraderingUtenBG);
    expect(graderingUtenBG).to.be.lengthOf(1);
  });
  it('skal teste at GraderingUtenBG ikke vises når sokerHarGraderingPaaAndelUtenBG er false', () => {
    const wrapper = shallow(<BeregningFP
      readOnly={false}
      submitCallback={sinon.spy}
      beregningsgrunnlag={lagBeregningsgrunnlag(true, 250000, 250000, undefined, null)}
      vilkar={vilkar}
      aksjonspunkter={gjeldendeAksjonspunkter}
      behandling={behandling}
      alleKodeverk={alleKodeverk}
      readOnlySubmitButton
    />);
    const graderingUtenBG = wrapper.find(GraderingUtenBG);
    expect(graderingUtenBG).to.be.lengthOf(0);
  });
});
