import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers//redux-form-test-helper';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import { MilitaerPanel as UnwrappedForm } from './MilitaerPanel';

const periode = {
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: [
    {
      aktivitetStatus: {
        kode: aktivitetStatus.MILITAER_ELLER_SIVIL,
      },
      beregnetPrAar: 290000,
    },
  ],
};

describe('<MilitaerPanel>', () => {
  it('skal teste at korrekt brutto vises for militær', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
    />);
    const elements = wrapper.find('Element');
    expect(elements).to.have.length(1);
    expect(elements.at(0).children().text()).to.equal(formatCurrencyNoKr(290000));
  });
});
