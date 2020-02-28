import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
// import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import AvviksopplysningerFL from './AvvikopplysningerFL';

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

describe('<AvviksopplysningerFL>', () => {
  it('Skal teste kombinasjonsStatus:FNSN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerFL
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={
        {
          isKombinasjonsstatus: true,
          isFrilanser: true,
          isArbeidstaker: false,
          isSelvstendigNaeringsdrivende: true,
        }
      }
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows.length).to.be.equal(1);
    const text = rows.first().find('FormattedMessage');
    expect(text.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.FL.KobinasjonsStatusFLSN');
  });

  it('Skal teste at avvikoplysningerATFL rendres', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_FL');
    const wrapper = shallowWithIntl(<AvviksopplysningerFL
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: false }}
    />);
    const panel = wrapper.find('AvvikopplysningerATFLSN');
    expect(panel.length).to.be.equal(1);
    const expectedProps = {
      beregnetAarsinntekt,
      avvikProsentAvrundet: 27.5,
      differanseBeregnet: 12100,
      relevanteStatuser: { isKombinasjonsstatus: false },
      visPanel: { visAT: false, visFL: true, visSN: false },
      sammenligningsgrunnlagSum: 330000,
    };
    expect(panel.props()).to.deep.equal(expectedProps);
  });

  it('Skal teste tabellen IKKE renderes status:SAMMENLIGNING_ATFL_SN', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    const wrapper = shallowWithIntl(<AvviksopplysningerFL
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: false }}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows.length).to.be.equal(0);
  });
  it('Skal teste tabellen IKKE rendres med feil status:SAMMENLIGNING_AT', () => {
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_AT');
    const wrapper = shallowWithIntl(<AvviksopplysningerFL
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlagPrStatus={[sammenligningsgrunnlagPrStatus]}
      relevanteStatuser={{ isKombinasjonsstatus: false }}
    />);
    const rows = wrapper.find('FlexRow');
    expect(rows.length).to.be.equal(0);
  });
});
