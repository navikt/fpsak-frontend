import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import TilleggsopplysningerFaktaForm from './TilleggsopplysningerFaktaForm';

describe('<TilleggsopplysningerFaktaForm>', () => {
  it('skal rendre tilleggsopplysninger', () => {
    const wrapper = shallow(<TilleggsopplysningerFaktaForm.WrappedComponent
      readOnly={false}
      submitting={false}
      tilleggsopplysninger="test"
    />);

    expect(wrapper.find('Normaltekst').childAt(0).text()).to.eql('test');
    const button = wrapper.find('Hovedknapp');
    expect(button.prop('spinner')).is.false;
    expect(button.prop('disabled')).is.false;
  });

  it('skal sette opp initielle verdier fra behandling', () => {
    const soknad = {
      tilleggsopplysninger: 'test',
    };

    const initialValues = TilleggsopplysningerFaktaForm.buildInitialValues(soknad);

    expect(initialValues).to.eql({
      tilleggsopplysninger: 'test',
      aksjonspunktCode: aksjonspunktCodes.TILLEGGSOPPLYSNINGER,
    });
  });
});
