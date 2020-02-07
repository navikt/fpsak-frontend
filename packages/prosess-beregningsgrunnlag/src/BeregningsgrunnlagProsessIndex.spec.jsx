
import sinon from 'sinon';
import { expect } from 'chai';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import React from 'react';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import BeregningsgrunnlagProsessIndex from './BeregningsgrunnlagProsessIndex';
import shallowWithIntl from '../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

const behandling = {
  id: 1,
  versjon: 1,
  venteArsakKode: venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
  sprakkode: {
    kode: '-',
    kodeverk: 'SPRAAK_KODE',
  },
};
const vilkarMedUtfall = (kode) => [{
  vilkarType: {
    kode: vilkarType.BEREGNINGSGRUNNLAGVILKARET,
    kodeverk: 'vilkarType',
  },
  vilkarStatus: {
    kode,
    kodeverk: 'vilkarStatus',
  },
}];
const lagPeriode = () => ({
  beregningsgrunnlagPeriodeFom: '2019-09-16',
  beregningsgrunnlagPeriodeTom: undefined,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  beregningsgrunnlagPrStatusOgAndel: [{
    aktivitetStatus: {
      kode: 'AT',
      kodeverk: 'AKTIVITET_STATUS',
    },
  }],
  andelerLagtTilManueltIForrige: [],
});
const lagBeregningsgrunnlag = (avvikPromille, årsinntektVisningstall,
  sammenligningSum, dekningsgrad, tilfeller) => ({
  beregningsgrunnlagPeriode: [lagPeriode()],
  sammenligningsgrunnlag: {
    avvikPromille,
    rapportertPrAar: sammenligningSum,
  },
  dekningsgrad,
  årsinntektVisningstall,
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: tilfeller,
  },
  aktivitetStatus: [{
    kode: 'UDEFINERT',
  }],
});
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
const alleKodeverk = {
  test: 'test',
};

describe('<BeregningsgrunnlagProsessIndex>', () => {
  it('skal teste at BeregningsgrunnlagProsessIndex rendrer beregningFP', () => {
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    beregningsgrunnlag.sammenligningsgrunnlagPrStatus = [sammenligningsgrunnlagPrStatus];
    const wrapper = shallowWithIntl(<BeregningsgrunnlagProsessIndex
      behandling={behandling}
      beregningsgrunnlag={beregningsgrunnlag}
      aksjonspunkter={[]}
      submitCallback={sinon.spy}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen={false}
      vilkar={vilkarMedUtfall(vilkarUtfallType.OPPFYLT)}
      alleKodeverk={alleKodeverk}
    />);
    const beregningFp = wrapper.find('BeregningFP2');
    expect(beregningFp.length).to.equal(1);
  });
});
