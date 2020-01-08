import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import BeregningsresultatTable2, { createBeregningTableData } from './BeregningsresultatTable_V2';

const tableData = {
  rows: [
    { ledetekst: 'Brutto beregningsgrunnlag', verdi: '900' },
    { ledetekst: 'Avkortet beregningsgrunnlag (6G=599148)', verdi: '800' },
    { ledetekst: 'Redusert beregningsgrunnlag (100%)', verdi: '400' },
  ],
  dagsatser: ['100'],
  headers: ['Beregningsgrunnlag.AarsinntektPanel.TomString'],
  rowsAndeler: [{ ledetekst: 'Beregningsgrunnlag - fastsatt årsinntekt', verdi: 130250, skalFastsetteGrunnlag: false }],
  rowsForklaringer: [],
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
    tableData.rowsAndeler[0].skalFastsetteGrunnlag = true;
    const wrapper = shallowWithIntl(<BeregningsresultatTable2.WrappedComponent
      intl={intlMock}
      periodeResultatTabeller={[tableData]}
      vilkaarBG={vilkaarBG}
    />);
    const panel = wrapper.find('PanelBase');
    const rows = panel.find('Row');
    expect(rows).to.have.length(3);
    const andelRow = rows.first();
    const andelText = andelRow.find('Normaltekst').first().childAt(0).text();
    const andelVerdi = andelRow.find('FormattedMessage').props().id;
    expect(andelText).to.equal(tableData.rowsAndeler[0].ledetekst);
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
      periodeResultatTabeller={[tableData]}
      vilkaarBG={vilkaarBG}
    />);
    const panel = wrapper.find('PanelBase');
    const rows = panel.find('Row');
    expect(rows).to.have.length(6);
    const andelRow = rows.first();
    const andelText = andelRow.find('Normaltekst').first().childAt(0).text();
    const andelVerdi = andelRow.find('Normaltekst').at(1).childAt(0).text();
    expect(andelText).to.equal(tableData.rowsAndeler[0].ledetekst);
    expect(formatCurrencyNoKr(andelVerdi)).to.equal(formatCurrencyNoKr(tableData.rowsAndeler[0].verdi));
    const sumRow = rows.last();
    const sumText = sumRow.find('FormattedMessage').props().id;
    const sumTextTall = sumRow.find('FormattedMessage').props().values.dagSats;
    const sumVerdi = sumRow.find('Normaltekst').last().childAt(0).text();
    expect(sumText).to.equal('Beregningsgrunnlag.BeregningTable.DagsatsNy');
    expect(sumTextTall).to.equal(formatCurrencyNoKr(400));
    expect(sumVerdi).to.equal(formatCurrencyNoKr(tableData.dagsatser[0]));
  });
  it('Skal teste at create table returnerer en at rad ved KUN AT', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const grunnbelop = 99123;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }];
    const selectorData = createBeregningTableData.resultFunc(beregningsgrunnlagPerioder, aktivitetStatusList, dekningsgrad, grunnbelop, vilkaarBG);
    selectorData.forEach((periode) => {
      expect(periode.rows.length).to.equal(1);
      const { rows, rowsAndeler, dagsatser } = periode;
      expect(rows[0].ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(rows[0].ledetekst.props.values.redusert).to.equal(dekningsgrad);
      const andelLabel = rowsAndeler[0].ledetekst;
      expect(andelLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.AT');
      expect(dagsatser[0]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer en at rad ved KUN Ytelse', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const grunnbelop = 99123;
    const aktivitetStatusList = [{ kode: 'KUN_YTELSE', kodeverk: 'AKTIVITET_STATUS' }];
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = 'KUN_YTELSE';
    const selectorData = createBeregningTableData.resultFunc(beregningsgrunnlagPerioder, aktivitetStatusList, dekningsgrad, grunnbelop, vilkaarBG);
    selectorData.forEach((periode) => {
      expect(periode.rows.length).to.equal(1);
      const { rows, rowsAndeler, dagsatser } = periode;
      expect(rows[0].ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(rows[0].ledetekst.props.values.redusert).to.equal(dekningsgrad);
      const andelLabel = rowsAndeler[0].ledetekst;
      expect(andelLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.YT');
      expect(dagsatser[0]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer returnerer riktig ved AT FL', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }, { kode: 'FL', kodeverk: 'AKTIVITET_STATUS' }];
    const flAndel = {
      aktivitetStatus: {
        kode: 'FL',
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 360002,
      bruttoPrAar: 300002,
      redusertPrAar: 360002,
    };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      flAndel,
    );
    const selectorData = createBeregningTableData.resultFunc(beregningsgrunnlagPerioder, aktivitetStatusList, dekningsgrad, vilkaarBG);
    selectorData.forEach((periode) => {
      expect(periode.rows.length).to.equal(2);
      const { rows, rowsAndeler, dagsatser } = periode;
      expect(rows[0].ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(rows[0].verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(rows[1].ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(rows[1].ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(2);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const andelLabelFL = rowsAndeler[1].ledetekst;
      expect(andelLabelFL.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.FL');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(flAndel.bruttoPrAar));

      expect(dagsatser[0]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer riktig data ved AT FL SN', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [
      { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'FL', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'SN', kodeverk: 'AKTIVITET_STATUS' },
    ];
    const flAndel = {
      aktivitetStatus: {
        kode: 'FL',
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 360002,
      bruttoPrAar: 300002,
      redusertPrAar: 360002,
    };
    const snAndel = {
      aktivitetStatus: {
        kode: 'SN',
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 360003,
      bruttoPrAar: 300003,
      pgiSnitt: 300033,
      redusertPrAar: 360003,
    };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      flAndel,
    );
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      snAndel,
    );
    const selectorData = createBeregningTableData.resultFunc(beregningsgrunnlagPerioder, aktivitetStatusList, dekningsgrad, vilkaarBG);
    selectorData.forEach((periode) => {
      expect(periode.rows.length).to.equal(2);
      const { rows, rowsAndeler, dagsatser } = periode;
      expect(rows[0].ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(rows[0].verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(rows[1].ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(rows[1].ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(2);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const andelLabelFL = rowsAndeler[1].ledetekst;
      expect(andelLabelFL.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.FL');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(flAndel.bruttoPrAar));

      expect(dagsatser[0]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer riktig data ved AT + DP > SN', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [
      { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'DP', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'SN', kodeverk: 'AKTIVITET_STATUS' },
    ];
    const dpAndel = {
      aktivitetStatus: {
        kode: 'DP',
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 360002,
      bruttoPrAar: 300002,
      redusertPrAar: 360002,
    };
    const snAndel = {
      aktivitetStatus: {
        kode: 'SN',
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 360003,
      bruttoPrAar: 300003,
      pgiSnitt: 300033,
      redusertPrAar: 360003,
    };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      dpAndel,
    );
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      snAndel,
    );
    const selectorData = createBeregningTableData.resultFunc(beregningsgrunnlagPerioder, aktivitetStatusList, dekningsgrad, vilkaarBG);
    selectorData.forEach((periode) => {
      expect(periode.rows.length).to.equal(1);
      const {
        rows, rowsAndeler, rowsForklaringer, dagsatser,
      } = periode;
      expect(rows[0].ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(rows[0].ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(1);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const forklaringLabel = rowsForklaringer[0];
      expect(forklaringLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_DP>SN');
      expect(dagsatser[0]).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
});
