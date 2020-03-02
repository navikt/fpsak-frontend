import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { GrunnlagForAarsinntektPanelSN } from './GrunnlagForAarsinntektPanelSN';

const beregningsgrunnlagperioder = {
  bruttoPrAar: 300000,
  beregnetPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: [
    {
      aktivitetStatus: {
        kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      },
      elementNavn: 'arbeidsgiver 1',
      beregnetPrAar: 200000,
      overstyrtPrAar: 100,
      pgiVerdier: [
        {
          beløp: 320000,
          årstall: 2017,
        },
        {
          beløp: 500000,
          årstall: 2016,
        },
        {
          beløp: 400000,
          årstall: 2015,
        },
      ],
      pgiSnitt: 200000,
      beregningsperiodeFom: '2015-01-01',
      beregningsperiodeTom: '2017-01-01',
    },
  ],
};

describe('<GrunnlagForAarsinntektPanelSN>', () => {
  it('Skal teste tabellen får korrekt antall rader', () => {
    const wrapper = shallowWithIntl(<GrunnlagForAarsinntektPanelSN
      alleAndeler={beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel}
    />);

    const rows = wrapper.find('Row');
    expect(rows).to.have.length(7);
  });
  it('Skal teste tabellen får korrekt innhold', () => {
    const wrapper = shallowWithIntl(<GrunnlagForAarsinntektPanelSN
      alleAndeler={beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel}
    />);
    const rows = wrapper.find('Row');
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage.first().prop('id')).to.eql('Beregningsgrunnlag.AarsinntektPanel.Pensjonsgivendeinntekt');
    expect(formattedMessage.at(1).prop('id')).to.eql('Beregningsgrunnlag.AarsinntektPanel.SN.sisteTreAar');
    expect(formattedMessage.at(2).prop('id')).to.eql('Beregningsgrunnlag.AarsinntektPanel.AarHeader');
    expect(formattedMessage.at(3).prop('id')).to.eql('Beregningsgrunnlag.AarsinntektPanel.TotalPensjonsGivende');

    beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel[0].pgiVerdier.forEach((pgi, index) => {
      const etikettLiten = rows.at(index + 2).find('EtikettLiten');
      const expectedBelop = formatCurrencyNoKr(pgi.beløp);
      const expectedAar = pgi.årstall.toString();
      expect(etikettLiten.at(0).childAt(0).text()).to.equal(expectedAar);
      expect(etikettLiten.at(1).childAt(0).text()).to.equal(expectedBelop);
    });
    const resultMessage = rows.at(6).find('FormattedMessage');
    expect(resultMessage.first().prop('id')).to.eql('Beregningsgrunnlag.AarsinntektPanel.SnittPensjonsGivende');
    const resultSnitt = rows.at(6).find('Element');
    const expectedSnitt = formatCurrencyNoKr(beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel[0].pgiSnitt);
    expect(resultSnitt.at(1).childAt(0).text()).to.equal(expectedSnitt);
  });
});
