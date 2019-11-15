import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { BeregningsresultatEngangsstonadFormImpl } from './BeregningsresultatEngangsstonadForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-beregningresultat';


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
      aksjonspunktCodes={[]}
      isOverstyrt={false}
      kanOverstyreAccess={{
        isEnabled: true,
      }}
    />);

    const texts = wrapper.find('Normaltekst');

    expect(texts).to.have.length(3);
    expect(texts.first().childAt(0).text()).to.eql('120 000 kr');
    expect(texts.at(1).childAt(0).text()).to.eql('2');
    expect(texts.last().childAt(0).text()).to.eql('60 000 kr');
  });
});
