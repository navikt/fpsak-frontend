import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

import TilleggsopplysningerFaktaForm from './TilleggsopplysningerFaktaForm';

describe('<TilleggsopplysningerFaktaForm>', () => {
  it('skal vise knapp ved readOnly', () => {
    const wrapper = shallow(<TilleggsopplysningerFaktaForm
      readOnly={false}
      submitting={false}
      tilleggsopplysninger="test"
    />);

    expect(wrapper.find(Normaltekst).childAt(0).text()).to.eql('test');
    const button = wrapper.find(Hovedknapp);
    expect(button.prop('spinner')).is.false;
    expect(button.prop('disabled')).is.false;
  });

  it('skal ikke vise knapp ved readOnly', () => {
    const wrapper = shallow(<TilleggsopplysningerFaktaForm
      readOnly
      submitting={false}
      tilleggsopplysninger="test"
    />);

    expect(wrapper.find(Normaltekst).childAt(0).text()).to.eql('test');
    const button = wrapper.find(Hovedknapp);
    expect(button).has.length(0);
  });
});
