import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Element } from 'nav-frontend-typografi';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { OverstyringKnapp } from '@fpsak-frontend/shared-components';
import { OverstyringPanel } from '@fpsak-frontend/prosess-felles';

import { BeregningsresultatEngangsstonadFormImpl } from './BeregningsresultatEngangsstonadForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-beregningresultat';

describe('<BeregningsresultatEngangsstonadForm>', () => {
  it('skal vise beregningsgrunnlaget når en ikke har overstyrt', () => {
    const beregningResultat = {
      beregnetTilkjentYtelse: 120000,
      satsVerdi: 60000,
      antallBarn: 2,
    };

    const wrapper = shallowWithIntl(<BeregningsresultatEngangsstonadFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingResultatstruktur={beregningResultat}
      aksjonspunktCodes={[]}
      isOverstyrt={false}
      kanOverstyre
      toggleOverstyring={sinon.spy()}
    />);

    const texts = wrapper.find(Element);

    expect(texts).to.have.length(3);
    expect(texts.first().childAt(0).text()).to.eql('60 000 kr');
    expect(texts.at(1).childAt(0).text()).to.eql('2');
    expect(texts.last().childAt(0).text()).to.eql('120 000 kr');
  });

  it('skal ved valg av overstyr vise tekstfelter', () => {
    const beregningResultat = {
      beregnetTilkjentYtelse: 120000,
      satsVerdi: 60000,
      antallBarn: 2,
    };

    const wrapper = shallowWithIntl(<BeregningsresultatEngangsstonadFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingResultatstruktur={beregningResultat}
      aksjonspunktCodes={[]}
      isOverstyrt={false}
      kanOverstyre
      toggleOverstyring={sinon.spy()}
    />);

    expect(wrapper.find(OverstyringPanel)).to.have.length(0);

    wrapper.find(OverstyringKnapp).prop('onClick')();

    expect(wrapper.find(OverstyringPanel)).to.have.length(1);
  });
});
