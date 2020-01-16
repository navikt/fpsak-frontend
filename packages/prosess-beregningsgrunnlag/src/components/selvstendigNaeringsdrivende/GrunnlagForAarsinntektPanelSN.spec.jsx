import React from 'react';
import { expect } from 'chai';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { GrunnlagForAarsinntektPanelSN } from './GrunnlagForAarsinntektPanelSN';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

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
  it('Skal teste tabellen får korrekt antall rader og kolonner', () => {
    const wrapper = shallowWithIntl(<GrunnlagForAarsinntektPanelSN
      alleAndeler={beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel}
    />);
    const rows = wrapper.find('TableRow');
    const cols = wrapper.find('TableColumn');
    expect(rows).to.have.length(1);
    expect(cols).to.have.length(5);
  });

  it('Skal teste tabellen får korrekt innhold', () => {
    const wrapper = shallowWithIntl(<GrunnlagForAarsinntektPanelSN
      alleAndeler={beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel}
    />);
    const rows = wrapper.find('TableRow');
    const formattedMessage = rows.find('FormattedMessage');
    const normaltekst = rows.find('Normaltekst');
    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.first().prop('id')).to.eql('Beregningsgrunnlag.AarsinntektPanel.Pensjonsgivende');
    expect(rows.find('Element').at(0).childAt(0).text()).to.equal(formatCurrencyNoKr(200000));

    expect(normaltekst).to.have.length(4);
    expect(rows.find('Normaltekst').at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(320000));
    expect(rows.find('Normaltekst').at(2).childAt(0).text()).to.equal(formatCurrencyNoKr(500000));
    expect(rows.find('Normaltekst').at(3).childAt(0).text()).to.equal(formatCurrencyNoKr(400000));
  });
});
