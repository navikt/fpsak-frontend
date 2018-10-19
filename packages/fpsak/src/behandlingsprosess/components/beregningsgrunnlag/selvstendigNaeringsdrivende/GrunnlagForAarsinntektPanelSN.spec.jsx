import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
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
      pgi1: 100000,
      pgi2: 200000,
      pgi3: 300000,
      pgiSnitt: 200000,
      beregningsperiodeFom: '2015-01-01',
      beregningsperiodeTom: '2017-01-01',
    },
  ],
};

describe('<GrunnlagForAarsinntektPanelSN>', () => {
  it('Skal teste tabellen får korrekt antall rader og kolonner', () => {
    const wrapper = shallowWithIntl(<GrunnlagForAarsinntektPanelSN
      intl={intlMock}
      alleAndeler={beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel}
    />);
    const rows = wrapper.find('TableRow');
    const cols = wrapper.find('TableColumn');
    expect(rows).to.have.length(1);
    expect(cols).to.have.length(5);
  });

  it('Skal teste tabellen får korrekt innhold', () => {
    const wrapper = shallowWithIntl(<GrunnlagForAarsinntektPanelSN
      intl={intlMock}
      alleAndeler={beregningsgrunnlagperioder.beregningsgrunnlagPrStatusOgAndel}
    />);
    const rows = wrapper.find('TableRow');
    const formattedMessage = rows.find('FormattedMessage');
    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.first().prop('id')).to.eql('Beregningsgrunnlag.AarsinntektPanel.Pensjonsgivende');
    expect(rows.find('Element').at(0).childAt(0).text()).to.equal(formatCurrencyNoKr(200000));
  });
});
