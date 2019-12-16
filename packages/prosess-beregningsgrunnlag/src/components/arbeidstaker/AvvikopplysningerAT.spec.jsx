import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AvviksopplysningerAT from './AvvikopplysningerAT';

const beregnetAarsinntekt = 360000;
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

describe('<AvviksopplysningerAT>', () => {
  it('Skal teste tabellen får korrekte rader med innhold med status:SAMMENLIGNING_ATFL_SN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      relevanteStatuser={{ isKombinasjonsstatus: true, isArbeidstaker: true }}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      beregnetAarsinntekt={beregnetAarsinntekt}
      aktivitetStatusKode={aktivitetStatus.ARBEIDSTAKER}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Arbeid');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(beregnetAarsinntekt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid');
    const rapportertAarsinntektVerdi = rows.at(1).find('Normaltekst');
    expect(rapportertAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlagPrStatus.rapportertPrAar));

    const avvikText = rows.at(3).find('FormattedMessage');
    expect(avvikText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.AT');
    const avvikVerdi = rows.at(3).find('Normaltekst');
    expect(avvikVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((sammenligningsgrunnlagPrStatus.differanseBeregnet)));

    const avvikProsentText = rows.at(3).find('FormattedMessage').at(1);
    const avvikProsentValue = avvikProsentText.first().prop('values');
    expect(avvikProsentText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AvvikProsent');
    expect(avvikProsentValue.avvik).to.eql(sammenligningsgrunnlagPrStatus.avvikProsent);
  });

  it('Skal teste tabellen får korrekte rader med innhold når kombinasjonsstatus=KOMBINERT_AT_SN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: true, isArbeidstaker: true, isSelvstendigNaeringsdrivende: true }}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const infoText = rows.first().find('FormattedMessage');
    expect(infoText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATSN');
  });
  it('Skal teste tabellen får korrekte rader med innhold når kombinasjonsstatus=KOMBINERT_AT_FL_SN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{
        isKombinasjonsstatus: true, isArbeidstaker: true, isSelvstendigNaeringsdrivende: true, isFrilanser: true,
      }}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const infoText = rows.first().find('FormattedMessage');
    expect(infoText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATFLSN');
  });
  it('Skal teste tabellen får korrekte rader med innhold med status:SAMMENLIGNING_AT', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_AT');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      relevanteStatuser={{ isKombinasjonsstatus: true, isArbeidstaker: true }}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      beregnetAarsinntekt={beregnetAarsinntekt}
    />);
    const rows = wrapper.find('Row');

    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Arbeid');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(beregnetAarsinntekt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid');
    const rapportertAarsinntektVerdi = rows.at(1).find('Normaltekst');
    expect(rapportertAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlagPrStatus.rapportertPrAar));

    const avvikText = rows.at(3).find('FormattedMessage');
    expect(avvikText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.AT');
    const avvikVerdi = rows.at(3).find('Normaltekst');
    expect(avvikVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((sammenligningsgrunnlagPrStatus.differanseBeregnet)));

    const avvikProsentText = rows.at(3).find('FormattedMessage').at(1);
    const avvikProsentValue = avvikProsentText.first().prop('values');
    expect(avvikProsentText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AvvikProsent');
    expect(avvikProsentValue.avvik).to.eql(sammenligningsgrunnlagPrStatus.avvikProsent);
  });
  it('Skal teste tabellen rendres med feil status:SAMMENLIGNING_FL', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_FL');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: false, isFrilanser: true }}
    />);
    const rows = wrapper.find('Row');
    expect(rows.length).to.be.equal(0);
  });
});
