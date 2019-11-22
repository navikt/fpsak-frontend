import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import BeregningsresultatTable2, { createBeregningTableData } from './BeregningsresultatTable_V2';

const tableData = {
  rows: [['Brutto beregningsgrunnlag', 900], ['Avkortet beregningsgrunnlag (6G=599148)', 800], ['Redusert beregningsgrunnlag (100%)', 400]],
  dagsatser: ['Dagsats', 100],
  headers: ['Beregningsgrunnlag.AarsinntektPanel.TomString'],
  rowsAndeler: [['Beregningsgrunnlag - fastsatt årsinntekt', 130250]],
};
const vilkaarBG = {
  vilkarStatus: {
    kode: vilkarUtfallType.IKKE_VURDERT,
    kodeverk: 'VILKAR_UTFALL_TYPE',
  },
  vilkarType: {
    kode: 'FP_VK_41',
    kodeverk: 'vilkarType',
  },
};
const mockPeriode = () => ([{
  beregningsgrunnlagPeriodeFom: '2019-09-16',
  beregningsgrunnlagPeriodeTom: undefined,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  dagsats: 1385,
  beregningsgrunnlagPrStatusOgAndel: [{
    aktivitetStatus: {
      kode: 'AT',
      kodeverk: 'AKTIVITET_STATUS',
    },
    avkortetPrAar: 360001,
    bruttoPrAar: 300001,
    redusertPrAar: 360001,
  }],
  andelerLagtTilManueltIForrige: [],
  periodeAarsaker: [],

}]);
describe('<BeregningsresultatTable2>', () => {
  it('Skal teste om tabellen får korrekt antall rader ved vilkarStatus:IKKE VURDERT', () => {
    const wrapper = shallowWithIntl(<BeregningsresultatTable2.WrappedComponent
      intl={intlMock}
      isVilkarOppfylt
      tableData={tableData}
      vilkaarBG={vilkaarBG}
    />);
    const panel = wrapper.find('PanelBase');
    const rows = panel.find('Row');
    expect(rows).to.have.length(3);
    const andelRow = rows.first();
    const andelText = andelRow.find('Normaltekst').first().childAt(0).text();
    const andelVerdi = andelRow.find('FormattedMessage').props().id;
    expect(andelText).to.equal(tableData.rowsAndeler[0][0]);
    expect(andelVerdi).to.equal('Beregningsgrunnlag.BeregningTable.MåFastsettes');
    const sumRow = rows.last();
    const sumText = sumRow.find('FormattedMessage').props().id;
    const sumVerdi = sumRow.find('Normaltekst').last().childAt(0).text();
    expect(sumText).to.equal('Beregningsgrunnlag.BeregningTable.Dagsats.ikkeFastsatt');
    expect(sumVerdi).to.equal('-');
  });
  it('Skal teste om tabellen får korrekt antall rader ved vilkarStatus:OPPFYLT', () => {
    vilkaarBG.vilkarStatus.kode = vilkarUtfallType.OPPFYLT;
    vilkaarBG.vilkarStatus.kodeverk = 'VILKAR_UTFALL_TYPE';
    const wrapper = shallowWithIntl(<BeregningsresultatTable2.WrappedComponent
      intl={intlMock}
      isVilkarOppfylt
      tableData={tableData}
      vilkaarBG={vilkaarBG}
    />);
    const panel = wrapper.find('PanelBase');
    const rows = panel.find('Row');
    expect(rows).to.have.length(7);
    const andelRow = rows.first();
    const andelText = andelRow.find('Normaltekst').first().childAt(0).text();
    const andelVerdi = andelRow.find('Normaltekst').at(1).childAt(0).text();
    expect(andelText).to.equal(tableData.rowsAndeler[0][0]);
    expect(andelVerdi).to.equal(formatCurrencyNoKr(tableData.rowsAndeler[0][1]));
    const sumRow = rows.last();
    const sumText = sumRow.find('FormattedMessage').props().id;
    const sumTextTall = sumRow.find('FormattedMessage').props().values.dagSats;
    const sumVerdi = sumRow.find('Normaltekst').last().childAt(0).text();
    expect(sumText).to.equal('Beregningsgrunnlag.BeregningTable.DagsatsNy');
    expect(sumTextTall).to.equal(400);
    expect(sumVerdi).to.equal(formatCurrencyNoKr(tableData.dagsatser[1]));
  });
  it('Skal teste at create table returnerer korrekte verdier', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const ledetekstBrutto = 'ledeteksBrutto';
    const ledetekstAvkortet = 'ledetekstAvkortet';
    const ledetekstRedusert = 'ledetekstRedusert';
    const selectorData = createBeregningTableData.resultFunc(beregningsgrunnlagPerioder, ledetekstBrutto, ledetekstRedusert, ledetekstAvkortet, vilkaarBG);
    expect(selectorData.rows.length).to.equal(3);
    const { rows, rowsAndeler, dagsatser } = selectorData;
    expect(rows[0][0]).to.equal(ledetekstBrutto);
    expect(rows[0][1]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
    expect(rows[1][0]).to.equal(ledetekstAvkortet);
    expect(rows[1][1]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].redusertPrAar));
    expect(rows[2][0]).to.equal(ledetekstRedusert);
    expect(rows[1][1]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].avkortetPrAar));
    expect(rowsAndeler.length).to.equal(1);
    const andelLabel = rowsAndeler[0][0];
    expect(andelLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.AT');
    expect(dagsatser[0]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
  });
});
