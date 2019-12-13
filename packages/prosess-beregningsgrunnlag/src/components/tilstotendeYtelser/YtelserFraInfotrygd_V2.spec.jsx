import React from 'react';
import { expect } from 'chai';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import YtelserFraInfotrygd from './YtelserFraInfotrygd';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

describe('<YtelserFraInfotrygd2>', () => {
  it('Skal teste at de korrekte verdier for ytelse', () => {
    const brutto = 290000;
    const wrapper = shallowWithIntl(<YtelserFraInfotrygd
      bruttoPrAar={brutto}
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');

    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.at(0).prop('id')).to.equal('Beregningsgrunnlag.YtelserFraInfotrygd.Ytelse');

    expect(element).to.have.length(1);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(brutto));
  });
});
