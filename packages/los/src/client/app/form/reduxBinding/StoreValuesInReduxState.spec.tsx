
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { StoreValuesInReduxState } from './StoreValuesInReduxState';

describe('<StoreValuesInReduxState>', () => {
  it('skal lagre ved unmount', () => {
    const saveFn = sinon.spy();
    const wrapper = shallow(<StoreValuesInReduxState
      onUmount
      saveInReduxState={saveFn}
      stateKey="form"
      values={{ inputValue: 'test' }}
    />);

    wrapper.unmount();

    expect(saveFn.calledOnce).to.be.true;
    const { args } = saveFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({
      key: 'form',
      values: { inputValue: 'test' },
    });
  });
});
