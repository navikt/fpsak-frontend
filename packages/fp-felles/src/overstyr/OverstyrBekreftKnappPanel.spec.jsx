import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';

describe('<OverstyrBekreftKnappPanel>', () => {
  it('skal rendre submit-knapp når en ikke er i readonly-modus', () => {
    const wrapper = shallow(<OverstyrBekreftKnappPanel
      submitting={false}
      pristine={false}
      overrideReadOnly={false}
    />);

    const button = wrapper.find('Hovedknapp');
    expect(button).to.have.length(1);
    expect(button.prop('spinner')).is.false;
    expect(button.prop('disabled')).is.false;
  });

  it('skal ikke vise submit-knapp når en er i readonly-modus', () => {
    const wrapper = shallow(<OverstyrBekreftKnappPanel
      submitting={false}
      pristine={false}
      overrideReadOnly
    />);

    const button = wrapper.find('Hovedknapp');
    expect(button).to.have.length(0);
  });
});
