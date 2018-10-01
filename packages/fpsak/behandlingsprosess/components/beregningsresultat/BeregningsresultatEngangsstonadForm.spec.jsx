import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import { BeregningsresultatEngangsstonadFormImpl } from './BeregningsresultatEngangsstonadForm';

describe('<BeregningsresultatEngangsstonadForm>', () => {
  it('skal vise beregningsgrunnlaget', () => {
    const beregningResultat = {
      beregnetTilkjentYtelse: 120000,
      satsVerdi: 60000,
      antallBarn: 2,
    };

    const wrapper = shallowWithIntl(<BeregningsresultatEngangsstonadFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      beregningResultat={beregningResultat}
      isOverstyrt={false}
    />);

    const texts = wrapper.find('Normaltekst');

    expect(texts).to.have.length(3);
    expect(texts.first().childAt(0).text()).to.eql('120 000 kr');
    expect(texts.at(1).childAt(0).text()).to.eql('2');
    expect(texts.last().childAt(0).text()).to.eql('60 000 kr');
  });
});
