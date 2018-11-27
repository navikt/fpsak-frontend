import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import relatertYtelseType from 'kodeverk/relatertYtelseType';
import relatertYtelseTypeTextCodes
  from 'behandlingsprosess/components/beregningsgrunnlag/fellesPaneler/relatertYtelseTypeTextCodes';
import YtelserFraInfotrygd from './YtelserFraInfotrygd';

describe('<YtelserFraInfotrygd>', () => {
  it('Skal teste at de korrekte ytelser for tilstøtende ytelser vises', () => {
    const brutto = 290000;
    const wrapper = shallowWithIntl(<YtelserFraInfotrygd
      tilstøtendeYtelseType={relatertYtelseType.ENSLIG_FORSORGER}
      bruttoPrAar={brutto}
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');

    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.at(0).prop('id')).to.equal(relatertYtelseTypeTextCodes[relatertYtelseType.ENSLIG_FORSORGER]);

    expect(element).to.have.length(1);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(brutto));
  });
});
