import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';

import { EditedIcon } from '@fpsak-frontend/shared-components';
import Label from './Label';
import ReadOnlyField from './ReadOnlyField';

describe('ReadOnlyField', () => {
  it('skal vise feltverdi', () => {
    const wrapper = shallow(<ReadOnlyField label="Dette er en test" input={{ value: '123' }} isEdited={false} />);

    const label = wrapper.find(Label);
    expect(label).to.have.length(1);
    expect(label.prop('input')).to.eql('Dette er en test');

    const value = wrapper.find(Normaltekst);
    expect(value).to.have.length(1);
    expect(value.childAt(0).text()).to.eql('123');
  });

  it('skal vise feltverdi som editert', () => {
    const wrapper = shallow(<ReadOnlyField label="Dette er en test" input={{ value: '123' }} isEdited />);
    expect(wrapper.find(EditedIcon)).to.have.length(1);
  });

  it('skal ikke vise label når verdi er tom', () => {
    const wrapper = shallow(<ReadOnlyField label="Dette er en test" input={{ value: '' }} isEdited={false} />);
    expect(wrapper.children()).to.have.length(0);
  });
});
