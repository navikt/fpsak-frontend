import React from 'react';
import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import YtelserFraInfotrygd from './YtelserFraInfotrygd';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

describe('<YtelserFraInfotrygd>', () => {
  it('Skal teste at de korrekte verdier for ytelse', () => {
    const brutto = 290000;
    const wrapper = shallowWithIntl(<YtelserFraInfotrygd
      bruttoPrAar={brutto}
    />);

    const formattedMessage = wrapper.find('FormattedMessage');

    expect(formattedMessage).to.have.length(4);
    expect(formattedMessage.at(0).prop('id')).to.equal('Beregningsgrunnlag.YtelserFraInfotrygd.Ytelse2');
    expect(formattedMessage.at(1).prop('id')).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned');
    expect(formattedMessage.at(2).prop('id')).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar');
    expect(formattedMessage.at(3).prop('id')).to.equal('Beregningsgrunnlag.YtelserFraInfotrygd.YtelseNavn');
    const maaned = wrapper.find('Normaltekst');
    expect(maaned).to.have.length(2);
    expect(maaned.children().at(1).text()).to.equal(formatCurrencyNoKr(brutto / 12));
    const element = wrapper.find('Element');
    expect(element).to.have.length(2);
    expect(element.children().at(1).text()).to.equal(formatCurrencyNoKr(brutto));
  });
});
