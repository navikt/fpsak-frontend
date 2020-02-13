import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
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
  it('Skal teste tabellen får korrekte rader med innhold når kombinasjonsstatus=KOMBINERT_AT_SN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: true, isArbeidstaker: true, isSelvstendigNaeringsdrivende: true }}
    />);
    const rows = wrapper.find('FlexRow');
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
    const rows = wrapper.find('FlexRow');
    expect(rows).to.have.length(1);
    const infoText = rows.first().find('FormattedMessage');
    expect(infoText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATFLSN');
  });
  it('Skal teste at avvikoplysningerATFL rendres', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_AT');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: false }}
    />);
    const panel = wrapper.find('AvvikopplysningerATFL');
    expect(panel.length).to.be.equal(1);
    const expectedProps = {
      beregnetAarsinntekt,
      avvikProsentAvrundet: 27.5,
      differanseBeregnet: 12100,
      relevanteStatuser: { isKombinasjonsstatus: false },
      visPanel: { visAT: true, visFL: false, visSN: false },
      sammenligningsgrunnlagSum: 330000,
    };
    expect(panel.props()).to.deep.equal(expectedProps);
  });

  it('Skal teste tabellen rendres med feil status:SAMMENLIGNING_FL', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_FL');
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: false, isFrilanser: true }}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows.length).to.be.equal(0);
  });
});
