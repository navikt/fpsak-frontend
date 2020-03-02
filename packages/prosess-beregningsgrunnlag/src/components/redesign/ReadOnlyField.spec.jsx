import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';
import Label from '@fpsak-frontend/form/src/Label';
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

  it('skal vise feltverdi som editert med endret info', () => {
    const wrapper = shallow(<ReadOnlyField label="Dette er en test" input={{ value: '123' }} endrettekst="EndretText" />);
    const flexContainer = wrapper.find('FlexContainer');
    expect(flexContainer).to.have.length(1);
    expect(flexContainer.find('EditedIcon')).to.have.length(1);

    const endretTekst = wrapper.find('Undertekst');
    expect(endretTekst).to.have.length(1);
    expect(endretTekst.childAt(0).text()).to.eql('EndretText');
  });

  it('skal ikke vise label når verdi er tom', () => {
    const wrapper = shallow(<ReadOnlyField label="Dette er en test" input={{ value: '' }} isEdited={false} />);
    expect(wrapper.children()).to.have.length(0);
  });
});
