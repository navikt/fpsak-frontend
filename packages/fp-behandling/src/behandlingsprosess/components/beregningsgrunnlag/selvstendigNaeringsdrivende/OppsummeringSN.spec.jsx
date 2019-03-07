import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import OppsummeringSN from './OppsummeringSN';

const inntekt = 200000;
const andel = [
  {
    aktivitetStatus: {
      kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    },
    beregnetPrAar: inntekt,
  },
];

describe('<OppsummeringSN>', () => {
  it('Skal teste at næringsinntekt vises på korrekt vis', () => {
    const wrapper = shallowWithIntl(<OppsummeringSN
      alleAndeler={andel}
    />);
    const element = wrapper.find('Element');
    expect(element).to.have.length(2);
    expect(element.children().at(1).text()).to.equal(formatCurrencyNoKr(inntekt));
  });
});
