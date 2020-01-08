import React from 'react';
import { expect } from 'chai';

import VurderMilitaer, { vurderMilitaerField } from './VurderMilitaer';
import shallowWithIntl from '../../../../i18n/intl-enzyme-test-helper-fakta-beregning';

const mockBGMedStatus = (mili) => ({
  vurderMilitaer: {
    harMilitaer: mili,
  },
});

describe('<VurderMilitaer>', () => {
  it('Skal teste at komponenten vises korrekt med radioknapper', () => {
    const wrapper = shallowWithIntl(<VurderMilitaer
      readOnly={false}
      isAksjonspunktClosed={false}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
  });

  it('Skal teste at buildInitialvalues bygges korrekt når vi ikke har satt verdi i fakta om beregning', () => {
    const faktaBg = {
      vurderMilitaer: null,
    };
    const acutalValues = VurderMilitaer.buildInitialValues(faktaBg);
    expect(acutalValues).to.eql({});
  });

  it('Skal teste at buildInitialvalues bygges korrekt når militær er satt til true', () => {
    const values = VurderMilitaer.buildInitialValues(mockBGMedStatus(true));
    const testobj = {
      [vurderMilitaerField]: true,
    };
    expect(values).to.deep.equal(testobj);
  });

  it('Skal teste at buildInitialvalues bygges korrekt når aksjonspunktet er løst og militær er satt til false', () => {
    const values = VurderMilitaer.buildInitialValues(mockBGMedStatus(false));
    const testobj = {
      [vurderMilitaerField]: false,
    };
    expect(values).to.deep.equal(testobj);
  });

  it('Skal teste at transformValues bygger korrekt objekt gitt at vurderMilitaerField er true', () => {
    const values = {
      [vurderMilitaerField]: true,
    };
    const transformedValues = VurderMilitaer.transformValues(values);
    const expectedValues = {
      vurderMilitaer: {
        harMilitaer: true,
      },
    };
    expect(transformedValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at transformValues bygger korrekt objekt gitt at vurderMilitaerField er false', () => {
    const values = {
      [vurderMilitaerField]: false,
    };
    const transformedValues = VurderMilitaer.transformValues(values);
    const expectedValues = {
      vurderMilitaer: {
        harMilitaer: false,
      },
    };
    expect(transformedValues).to.deep.equal(expectedValues);
  });
});
