import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';
import AvviksopplysningerPanel from './AvvikopplysningerPanel';

const sammenligningsgrunnlag = (kode) => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar: 330000,
  avvikPromille: 275,
  avvikProsent: 27.5,
  sammenligningsgrunnlagType: {
    kode,
  },
  differanseBeregnet: 12100,
});
const relevanteStatuser = {
  isArbeidstaker: true,
  isSelvstendigNaeringsdrivende: false,
  isKombinasjonsstatus: true,
};
const allePerioder = [
  {
    beregningsgrunnlagPrStatusOgAndel: [
      {
        beregnetPrAar: 360000,
        aktivitetStatus: {
          kode: 'AT',
          kodeverk: 'AKTIVITET_STATUS',
        },
      }],
  }];
describe('<Avviksopplysninger>', () => {
  it('Skal teste at riktig componenter blir renderet når ATFLSN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag(sammenligningType.ATFLSN);
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      relevanteStatuser={relevanteStatuser}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      allePerioder={allePerioder}
      aktivitetStatusKode=""
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const avvikPanelAT = wrapper.find('AvviksopplysningerAT');
    expect(avvikPanelAT.props().sammenligningsgrunnlagPrStatus[0]).to.equal(sammenligningsgrunnlagPrStatus);
    expect(wrapper.find('AvviksopplysningerFL')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerSN')).to.have.length(0);
  });
  it('Skal teste at riktig componenter blir renderet når AT', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag(sammenligningType.AT);
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      relevanteStatuser={relevanteStatuser}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      allePerioder={allePerioder}
      aktivitetStatusKode=""
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const avvikPanelAT = wrapper.find('AvviksopplysningerAT');
    expect(avvikPanelAT.props().sammenligningsgrunnlagPrStatus[0]).to.equal(sammenligningsgrunnlagPrStatus);
    expect(wrapper.find('AvviksopplysningerFL')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerSN')).to.have.length(0);
  });
  it('Skal teste at riktig componenter blir renderet når SN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag(sammenligningType.SN);
    relevanteStatuser.isArbeidstaker = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = true;
    const snPeriode = {
      aktivitetStatus:
        {
          kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
        },
      næringer: [
        {
          erVarigEndret: false,
          erNyoppstartet: false,
        },
      ],
      erNyIArbeidslivet: true,
    };
    const perioderMedSNAndel = allePerioder;
    perioderMedSNAndel[0].beregningsgrunnlagPrStatusOgAndel[0] = snPeriode;
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={relevanteStatuser}
      allePerioder={perioderMedSNAndel}
      aktivitetStatusKode=""
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const avvikPanelSN = wrapper.find('AvviksopplysningerSN');
    expect(avvikPanelSN.props().sammenligningsgrunnlagPrStatus[0]).to.equal(sammenligningsgrunnlagPrStatus);
    expect(wrapper.find('AvviksopplysningerAT')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerFL')).to.have.length(0);
  });
  it('Skal teste at riktig componenter blir renderet når FL', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag(sammenligningType.FL);
    relevanteStatuser.isArbeidstaker = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = false;
    relevanteStatuser.isFrilanser = true;
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      relevanteStatuser={relevanteStatuser}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      allePerioder={allePerioder}
      aktivitetStatusKode=""
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const avvikPanelFL = wrapper.find('AvviksopplysningerFL');
    expect(avvikPanelFL.props().sammenligningsgrunnlagPrStatus[0]).to.equal(sammenligningsgrunnlagPrStatus);
    expect(wrapper.find('AvviksopplysningerAT')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerSN')).to.have.length(0);
  });
  it('Skal teste at riktig componenter blir renderet når isAAP', () => {
    relevanteStatuser.isArbeidstaker = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = false;
    relevanteStatuser.isFrilanser = false;
    relevanteStatuser.isAAP = true;
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      relevanteStatuser={relevanteStatuser}
      sammenligningsgrunnlagPrStatus={[{}]}
      allePerioder={allePerioder}
      aktivitetStatusKode=""
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const formatedText = rows.first().find('FormattedMessage');
    expect(formatedText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AAP');
    expect(wrapper.find('AvviksopplysningerAT')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerSN')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerFL')).to.have.length(0);
  });
  it('Skal teste at riktig componenter blir renderet når isDagpenger', () => {
    relevanteStatuser.isArbeidstaker = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = false;
    relevanteStatuser.isFrilanser = false;
    relevanteStatuser.isAAP = false;
    relevanteStatuser.isDagpenger = true;
    const wrapper = shallowWithIntl(<AvviksopplysningerPanel
      relevanteStatuser={relevanteStatuser}
      sammenligningsgrunnlagPrStatus={[{}]}
      allePerioder={allePerioder}
      aktivitetStatusKode=""
    />);
    const panel = wrapper.find('PanelBase');
    const headerTitle = panel.find('FormattedMessage').first();
    expect(headerTitle.props().id).to.equal('Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation');
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const formatedText = rows.first().find('FormattedMessage');
    expect(formatedText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.Dagpenger');
    expect(wrapper.find('AvviksopplysningerAT')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerSN')).to.have.length(0);
    expect(wrapper.find('AvviksopplysningerFL')).to.have.length(0);
  });
});
