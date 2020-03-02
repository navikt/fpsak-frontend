import React from 'react';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import AvvikopplysningerATFLSN from './AvvikopplysningerATFLSN';

const beregnetAarsinntekt = 360000;
const sammenligningsgrunnlag = (kode) => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar: 330000,
  avvikPromille: 275,
  avvikProsent: 27.54234,
  sammenligningsgrunnlagType: {
    kode,
  },
  differanseBeregnet: 12100,
});
const visPaneler = {
  visAT: false,
  visFL: true,
  visSN: false,
};
const avvikRounded = 27.5;
const sammenligningsgrunnlagSum = 23466;
describe('<AvviksOpplysningerATFLSN>', () => {
  it('Skal teste tabellen får korrekte rader for frilanser og kombinasjonsstatus', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_FL');
    const wrapper = shallowWithIntl(<AvvikopplysningerATFLSN
      beregnetAarsinntekt={beregnetAarsinntekt}
      avvikProsentAvrundet={avvikRounded}
      differanseBeregnet={12100}
      relevanteStatuser={{ isKombinasjonsstatus: true, isFrilanser: true }}
      visPanel={visPaneler}
      sammenligningsgrunnlagSum={sammenligningsgrunnlagSum}
    />);

    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Frilans');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(beregnetAarsinntekt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Frilans');
    const rapportertAarsinntektVerdi = rows.at(1).find('Normaltekst');
    expect(rapportertAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlagSum));

    const avvikText = rows.at(3).find('FormattedMessage');
    expect(avvikText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.Frilans');
    const avvikVerdi = rows.at(3).find('Normaltekst');
    expect(avvikVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((sammenligningsgrunnlagPrStatus.differanseBeregnet)));
    const avvikProsentText = rows.at(3).find('FormattedMessage').at(1);
    const avvikProsentValue = avvikProsentText.first().prop('values');
    expect(avvikProsentText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AvvikProsent');
    expect(avvikProsentValue.avvik).to.eql(avvikRounded);
  });

  it('Skal teste tabellen får korrekte rader med innhold med status:SAMMENLIGNING_ATFL_SN', () => {
    visPaneler.visAT = true;
    visPaneler.visFL = false;
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    const wrapper = shallowWithIntl(<AvvikopplysningerATFLSN
      beregnetAarsinntekt={beregnetAarsinntekt}
      avvikProsentAvrundet={avvikRounded}
      differanseBeregnet={12100}
      relevanteStatuser={{ isKombinasjonsstatus: true, isArbeidstaker: true }}
      visPanel={visPaneler}
      sammenligningsgrunnlagSum={sammenligningsgrunnlagSum}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Arbeid');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(beregnetAarsinntekt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid');
    const rapportertAarsinntektVerdi = rows.at(1).find('Normaltekst');
    expect(rapportertAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlagSum));

    const avvikText = rows.at(3).find('FormattedMessage');
    expect(avvikText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.Arbeid');
    const avvikVerdi = rows.at(3).find('Normaltekst');
    expect(avvikVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((sammenligningsgrunnlagPrStatus.differanseBeregnet)));

    const avvikProsentText = rows.at(3).find('FormattedMessage').at(1);
    const avvikProsentValue = avvikProsentText.first().prop('values');
    expect(avvikProsentText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AvvikProsent');
    expect(avvikProsentValue.avvik).to.eql(avvikRounded);
  });
  // fra SNtester
  it('Skal teste tabellen får korrekte rader med innhold vd SN', () => {
    visPaneler.visAT = false;
    visPaneler.visFL = false;
    visPaneler.visSN = true;
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_SN');
    const wrapper = shallowWithIntl(<AvvikopplysningerATFLSN
      beregnetAarsinntekt={beregnetAarsinntekt}
      avvikProsentAvrundet={avvikRounded}
      differanseBeregnet={12100}
      relevanteStatuser={{ isKombinasjonsstatus: false }}
      visPanel={visPaneler}
      sammenligningsgrunnlagSum={sammenligningsgrunnlagSum}
    />);

    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(beregnetAarsinntekt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt');
    const rapportertAarsinntektVerdi = rows.at(1).find('Normaltekst');
    expect(rapportertAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlagSum));

    const avvikText = rows.at(3).find('FormattedMessage');
    expect(avvikText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik');
    const avvikVerdi = rows.at(3).find('Normaltekst');
    expect(avvikVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((sammenligningsgrunnlagPrStatus.differanseBeregnet)));
    const avvikProsentText = rows.at(3).find('FormattedMessage').at(1);
    const avvikProsentValue = avvikProsentText.first().prop('values');
    expect(avvikProsentText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AvvikProsent');
    expect(avvikProsentValue.avvik).to.eql(avvikRounded);
  });
});
