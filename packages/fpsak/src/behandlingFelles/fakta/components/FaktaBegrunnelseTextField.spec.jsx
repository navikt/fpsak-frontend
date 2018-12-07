import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { TextAreaField } from 'form/Fields';
import FaktaBegrunnelseTextField from './FaktaBegrunnelseTextField';

describe('<FaktaBegrunnelseTextField>', () => {
  it('skal ikke vise tekstfelt når en ikke har gjort endringer', () => {
    const wrapper = shallow(<FaktaBegrunnelseTextField
      isReadOnly={false}
      isSubmittable
      isDirty={false}
      hasBegrunnelse={false}
    />);

    expect(wrapper.find(TextAreaField)).to.have.length(0);
  });

  it('skal ikke vise tekstfelt når en ikke har lov til å løse aksjonspunkt', () => {
    const wrapper = shallow(<FaktaBegrunnelseTextField
      isReadOnly={false}
      isSubmittable={false}
      isDirty
      hasBegrunnelse={false}
    />);

    expect(wrapper.find(TextAreaField)).to.have.length(0);
  });

  it('skal vise tekstfelt når en har lov til å løse aksjonspunkt og en har gjort endringer', () => {
    const wrapper = shallow(<FaktaBegrunnelseTextField
      isReadOnly={false}
      isSubmittable
      isDirty
      hasBegrunnelse={false}
    />);

    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });

  it('skal ikke vise label når readOnly', () => {
    const wrapper = shallow(<FaktaBegrunnelseTextField
      isReadOnly
      isSubmittable
      isDirty
      hasBegrunnelse={false}
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('label')).to.eql('');
  });

  it('skal vise standard-label når en ikke har valgt å vise vurderingstekst eller sende med tekstkode', () => {
    const wrapper = shallow(<FaktaBegrunnelseTextField
      isReadOnly={false}
      isSubmittable
      isDirty
      hasBegrunnelse={false}
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('label')).to.eql({ id: 'FaktaBegrunnelseTextField.BegrunnEndringene' });
  });

  it('skal vise label for vurdering når dette er markert av prop', () => {
    const wrapper = shallow(<FaktaBegrunnelseTextField
      isReadOnly={false}
      isSubmittable
      isDirty
      hasBegrunnelse={false}
      hasVurderingText
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('label')).to.eql({ id: 'FaktaBegrunnelseTextField.Vurdering' });
  });

  it('skal vise medsendt label', () => {
    const wrapper = shallow(<FaktaBegrunnelseTextField
      isReadOnly={false}
      isSubmittable
      isDirty
      hasBegrunnelse={false}
      labelCode="Test"
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('label')).to.eql({ id: 'Test' });
  });
});
