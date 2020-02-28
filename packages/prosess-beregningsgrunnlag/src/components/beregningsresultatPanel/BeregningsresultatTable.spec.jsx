
import { expect } from 'chai';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { createBeregningTableData } from './BeregningsresultatTable';

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
  avkortetPrAar: 360000, // under 6G
  redusertPrAar: 340000, // redusert ved dekningsgrad 80
  dagsats: 1385,
  beregningsgrunnlagPrStatusOgAndel: [{
    aktivitetStatus: {
      kode: 'AT',
      kodeverk: 'AKTIVITET_STATUS',
    },
    avkortetPrAar: 360001,
    overstyrtPrAar: undefined,
    bruttoPrAar: 300001,
    redusertPrAar: 360001,
    erTilkommetAndel: false,
    lagtTilAvSaksbehandler: false,
  }],
  andelerLagtTilManueltIForrige: [],
  periodeAarsaker: [],

}]);
const flAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.FRILANSER,
    kodeverk: 'AKTIVITET_STATUS',
  },
  avkortetPrAar: 140250,
  bruttoPrAar: 140250,
  redusertPrAar: 140250,
};
const grunnbelop = 99123;
const seksG = grunnbelop * 6;
describe('<BeregningsresultatTable>', () => {
  it('Skal teste at create table returnerer riktig data ved AT og dekningsgrad 80', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }];
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      expect(periode.rowsAndeler.length).to.equal(1);
      const { rowsAndeler, dagsatser, redusertRad } = periode;
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      const andelLabel = rowsAndeler[0].ledetekst;
      expect(andelLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.AT');
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer riktig data ved AT vilkartype OPPFYLT', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 100;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }];
    vilkaarBG.vilkarStatus.kode = vilkarUtfallType.OPPFYLT;
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].skalFastsetteGrunnlag = false;
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      expect(periode.rowsAndeler.length).to.equal(1);
      const { rowsAndeler, dagsatser } = periode;
      const andelLabel = rowsAndeler[0].ledetekst;
      expect(andelLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AT');
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer en at rad ved Brukers Andel', () => {
    vilkaarBG.vilkarStatus.kode = vilkarUtfallType.IKKE_VURDERT;
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'BA', kodeverk: 'AKTIVITET_STATUS' }];
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = 'BA';
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      expect(periode.rowsAndeler.length).to.equal(1);
      const { rowsAndeler, dagsatser, redusertRad } = periode;
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      const andelLabel = rowsAndeler[0].ledetekst;
      expect(andelLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.BA');
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer returnerer riktig ved AT FL', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }, { kode: 'FL', kodeverk: 'AKTIVITET_STATUS' }];
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      flAndel,
    );
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      expect(periode.rowsAndeler.length).to.equal(2);
      const {
        rowsAndeler, dagsatser, bruttoRad, redusertRad,
      } = periode;
      expect(bruttoRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(bruttoRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(2);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const andelLabelFL = rowsAndeler[1].ledetekst;
      expect(andelLabelFL.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.FL');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(flAndel.bruttoPrAar));

      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer riktig ved AT < SN', () => {
    vilkaarBG.vilkarStatus.kode = vilkarUtfallType.IKKE_VURDERT;
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }, { kode: 'SN', kodeverk: 'AKTIVITET_STATUS' }];
    const snAndel = {
      aktivitetStatus: {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 599985,
      bruttoPrAar: 754985,
      pgiSnitt: 754985,
      redusertPrAar: 554985,
    };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      snAndel,
    );
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      expect(periode.rowsAndeler.length).to.equal(1);
      const {
        rowsAndeler, dagsatser, bruttoRad, redusertRad,
      } = periode;
      expect(bruttoRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(bruttoRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(1);
      const andelLabelSN = rowsAndeler[0].ledetekst;
      expect(andelLabelSN.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.SN');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(snAndel.bruttoPrAar));
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer riktig ved AT > SN', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }, { kode: 'SN', kodeverk: 'AKTIVITET_STATUS' }];
    const snAndel = {
      aktivitetStatus: {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
        kodeverk: 'AKTIVITET_STATUS',
      },
      bruttoPrAar: 254985,
      pgiSnitt: 254985,
    };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      snAndel,
    );
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      const {
        rowsAndeler, dagsatser, bruttoRad, redusertRad, rowsForklaringer,
      } = periode;
      expect(bruttoRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(bruttoRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(1);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const forklaringLabel = rowsForklaringer[0];
      expect(forklaringLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAToverstigerSN');
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer riktig data ved AT FL SN med redusert og avkortet', () => {
    vilkaarBG.vilkarStatus.kode = vilkarUtfallType.OPPFYLT;
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [
      { kode: aktivitetStatus.ARBEIDSTAKER, kodeverk: 'AKTIVITET_STATUS' },
      { kode: aktivitetStatus.FRILANSER, kodeverk: 'AKTIVITET_STATUS' },
      { kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, kodeverk: 'AKTIVITET_STATUS' },
    ];
    const snAndel = {
      aktivitetStatus: {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 599985,
      bruttoPrAar: 754985,
      pgiSnitt: 754985,
      redusertPrAar: 554985,
    };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      flAndel,
    );
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      snAndel,
    );
    beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1330250;
    beregningsgrunnlagPerioder[0].avkortetPrAar = seksG;
    beregningsgrunnlagPerioder[0].redusertPrAar = 554985;
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );

    selectorData.forEach((periode) => {
      const {
        rowsAndeler, dagsatser, bruttoRad, redusertRad, avkortetRad,
      } = periode;
      expect(rowsAndeler.length).to.equal(3);
      expect(bruttoRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(bruttoRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(redusertRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].redusertPrAar));
      expect(avkortetRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Avkortet6g');
      expect(avkortetRad.verdi).to.equal(formatCurrencyNoKr(seksG));
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const andelLabelFL = rowsAndeler[1].ledetekst;
      expect(andelLabelFL.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.FL');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(flAndel.bruttoPrAar));
      const andelLabelSN = rowsAndeler[2].ledetekst;
      expect(andelLabelSN.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Fastsatt.SN');
      expect(formatCurrencyNoKr(rowsAndeler[2].verdi)).to.equal(formatCurrencyNoKr(snAndel.bruttoPrAar));
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });

  it('Skal teste at create table returnerer riktig data ved AT FL > SN med redusert og avkortet', () => {
    vilkaarBG.vilkarStatus.kode = vilkarUtfallType.OPPFYLT;
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [
      { kode: aktivitetStatus.ARBEIDSTAKER, kodeverk: 'AKTIVITET_STATUS' },
      { kode: aktivitetStatus.FRILANSER, kodeverk: 'AKTIVITET_STATUS' },
      { kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, kodeverk: 'AKTIVITET_STATUS' },
    ];
    const snAndel = {
      aktivitetStatus: {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 599985,
      bruttoPrAar: 154985,
      pgiSnitt: 154985,
    };
    flAndel.bruttoPrAar = 596000;
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      flAndel,
    );
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      snAndel,
    );
    snAndel.skalFastsetteGrunnlag = true;
    beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar = 1147342;
    beregningsgrunnlagPerioder[0].avkortetPrAar = seksG;
    beregningsgrunnlagPerioder[0].redusertPrAar = 479318;
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].bruttoPrAar = 551316;

    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      const {
        rowsAndeler, dagsatser, bruttoRad, redusertRad, avkortetRad, rowsForklaringer,
      } = periode;
      expect(rowsAndeler.length).to.equal(2);
      expect(bruttoRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(bruttoRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(redusertRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].redusertPrAar));
      expect(avkortetRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Avkortet6g');
      expect(avkortetRad.verdi).to.equal(formatCurrencyNoKr(seksG));
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(551316));
      const andelLabelFL = rowsAndeler[1].ledetekst;
      expect(andelLabelFL.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.FL');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(flAndel.bruttoPrAar));
      const forklaringLabel = rowsForklaringer[0];
      expect(forklaringLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_FLoverstigerSN');
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });

  it('Skal teste at create table returnerer riktig data ved DP FL SN', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [
      { kode: 'DP', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'FL', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'SN', kodeverk: 'AKTIVITET_STATUS' },
    ];

    const snAndel = {
      aktivitetStatus: {
        kode: 'SN',
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 599985,
      bruttoPrAar: 754985,
      pgiSnitt: 754985,
      redusertPrAar: 554985,
    };

    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      flAndel,
    );
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      snAndel,
    );
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].bruttoPrAar = 123000;
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[1].bruttoPrAar = 223000;
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = aktivitetStatus.DAGPENGER;
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );

    selectorData.forEach((periode) => {
      const {
        rowsAndeler, dagsatser, redusertRad,
      } = periode;
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(3);
      const andelLabelDP = rowsAndeler[1].ledetekst;
      expect(andelLabelDP.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.DP');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(123000));
      const andelLabelFL = rowsAndeler[0].ledetekst;
      expect(andelLabelFL.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.FL');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(223000));
      const andelLabelSN = rowsAndeler[2].ledetekst;
      expect(andelLabelSN.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.SN');
      expect(formatCurrencyNoKr(rowsAndeler[2].verdi)).to.equal(formatCurrencyNoKr(snAndel.pgiSnitt));
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });

  it('Skal teste at create table returnerer riktig data ved DP + FL > SN', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [
      { kode: 'DP', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'FL', kodeverk: 'AKTIVITET_STATUS' },
      { kode: 'SN', kodeverk: 'AKTIVITET_STATUS' },
    ];

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
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = aktivitetStatus.DAGPENGER;
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );

    selectorData.forEach((periode) => {
      const {
        rowsAndeler, dagsatser, redusertRad, rowsForklaringer,
      } = periode;
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(2);
      const andelLabelFL = rowsAndeler[0].ledetekst;
      expect(andelLabelFL.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.FL');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(flAndel.bruttoPrAar));
      const forklaringLabel = rowsForklaringer[0];
      expect(forklaringLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringDP_FLoverstigerSN');
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
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
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      const {
        rowsAndeler, dagsatser, redusertRad, rowsForklaringer,
      } = periode;
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(2);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const forklaringLabel = rowsForklaringer[0];
      expect(forklaringLabel.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_DPoverstigerSN');
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer returnerer riktig ved AT AAP', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }, { kode: 'AAP', kodeverk: 'AKTIVITET_STATUS' }];
    const aapAndel = {
      aktivitetStatus: {
        kode: 'AAP',
        kodeverk: 'AKTIVITET_STATUS',
      },
      avkortetPrAar: 360003,
      bruttoPrAar: 300003,
      pgiSnitt: 300033,
      redusertPrAar: 360003,
    };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel.push(
      aapAndel,
    );
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      expect(periode.rowsAndeler.length).to.equal(2);
      const {
        rowsAndeler, dagsatser, bruttoRad, redusertRad,
      } = periode;
      expect(bruttoRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(bruttoRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(2);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const andelLabelAAP = rowsAndeler[1].ledetekst;
      expect(andelLabelAAP.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AAP');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(aapAndel.bruttoPrAar));
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
  it('Skal teste at create table returnerer returnerer riktig ved AT med naturalytelse', () => {
    const beregningsgrunnlagPerioder = mockPeriode();
    const dekningsgrad = 80;
    const aktivitetStatusList = [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }, { kode: 'AAP', kodeverk: 'AKTIVITET_STATUS' }];
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].arbeidsforhold = { naturalytelseBortfaltPrÅr: 48000 };
    beregningsgrunnlagPerioder[0].beregningsgrunnlagPrStatusOgAndel[0].bortfaltNaturalytelse = 48000;
    const selectorData = createBeregningTableData.resultFunc(
      beregningsgrunnlagPerioder,
      aktivitetStatusList,
      dekningsgrad,
      grunnbelop,
      false,
      vilkaarBG.vilkarStatus,
    );
    selectorData.forEach((periode) => {
      expect(periode.rowsAndeler.length).to.equal(2);
      const {
        rowsAndeler, dagsatser, bruttoRad, redusertRad,
      } = periode;
      expect(bruttoRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.BruttoTotalt');
      expect(bruttoRad.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].bruttoInkludertBortfaltNaturalytelsePrAar));
      expect(redusertRad.ledetekst.props.id).to.equal('Beregningsgrunnlag.BeregningTable.RedusertProsent');
      expect(redusertRad.ledetekst.props.values.redusert).to.equal(dekningsgrad);
      expect(rowsAndeler.length).to.equal(2);
      const andelLabelAT = rowsAndeler[0].ledetekst;
      expect(andelLabelAT.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Omberegnet.AT');
      expect(formatCurrencyNoKr(rowsAndeler[0].verdi)).to.equal(formatCurrencyNoKr(300001));
      const andelLabelAAP = rowsAndeler[1].ledetekst;
      expect(andelLabelAAP.props.id).to.equal('Beregningsgrunnlag.BeregningTable.Naturalytelser');
      expect(formatCurrencyNoKr(rowsAndeler[1].verdi)).to.equal(formatCurrencyNoKr(48000));
      expect(dagsatser.verdi).to.equal(formatCurrencyNoKr(beregningsgrunnlagPerioder[0].dagsats));
    });
  });
});
