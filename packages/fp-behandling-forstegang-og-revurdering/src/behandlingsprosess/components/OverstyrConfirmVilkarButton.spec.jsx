import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import OverstyrConfirmVilkarButton from './OverstyrConfirmVilkarButton';

describe('<OverstyrConfirmVilkarButton>', () => {
  it('skal rendre submit-knapp når en ikke er i readonly-modus', () => {
    const wrapper = shallow(<OverstyrConfirmVilkarButton.WrappedComponent
      submitting={false}
      pristine={false}
      isReadOnly={false}
    />);

    const button = wrapper.find('Hovedknapp');
    expect(button).to.have.length(1);
    expect(button.prop('spinner')).is.false;
    expect(button.prop('disabled')).is.false;
  });

  it('skal ikke vise submit-knapp når en er i readonly-modus', () => {
    const wrapper = shallow(<OverstyrConfirmVilkarButton.WrappedComponent
      submitting={false}
      pristine={false}
      isReadOnly
    />);

    const button = wrapper.find('Hovedknapp');
    expect(button).to.have.length(0);
  });
});
