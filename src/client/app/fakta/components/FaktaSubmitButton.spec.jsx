import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Hovedknapp } from 'nav-frontend-knapper';
import { FaktaSubmitButton } from './FaktaSubmitButton';

describe('<FaktaSubmitButton>', () => {
  it('skal ikke vise knapp når readonly', () => {
    const wrapper = shallow(<FaktaSubmitButton
      isReadOnly
      isSubmittable
      isSubmitting={false}
      isDirty={false}
      hasEmptyRequiredFields={false}
      hasOpenAksjonspunkter
    />);

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal vise knapp som trykkbar når en kan avklare aksjonspunkt og en har gjort endringer', () => {
    const wrapper = shallow(<FaktaSubmitButton
      isReadOnly={false}
      isSubmittable
      isSubmitting={false}
      isDirty
      hasEmptyRequiredFields={false}
      hasOpenAksjonspunkter
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.false;
  });

  it('skal vise knapp som utgrået når en ikke kan avklare aksjonspunkt', () => {
    const wrapper = shallow(<FaktaSubmitButton
      isReadOnly={false}
      isSubmittable={false}
      isSubmitting={false}
      isDirty
      hasEmptyRequiredFields={false}
      hasOpenAksjonspunkter
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.true;
  });

  it('skal vise knapp som utgrået når en har trykket på knapp', () => {
    const wrapper = shallow(<FaktaSubmitButton
      isReadOnly={false}
      isSubmittable
      isSubmitting
      isDirty
      hasEmptyRequiredFields={false}
      hasOpenAksjonspunkter
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.true;
  });

  it('skal vise knapp som utgrået når en ikke har gjort endringer og det er tomme obligatoriske felter', () => {
    const wrapper = shallow(<FaktaSubmitButton
      isReadOnly={false}
      isSubmittable
      isSubmitting={false}
      isDirty={false}
      hasEmptyRequiredFields
      hasOpenAksjonspunkter
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.true;
  });

  it('skal vise knapp som trykkbar når en ikke har gjort endringer men alle obligatoriske felter er utfylte', () => {
    const wrapper = shallow(<FaktaSubmitButton
      isReadOnly={false}
      isSubmittable
      isSubmitting={false}
      isDirty={false}
      hasEmptyRequiredFields={false}
      hasOpenAksjonspunkter
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.false;
  });

  it('skal vise knapp som utgrået når en ikke har gjort endringer og aksjonspunktet er løst tidligere', () => {
    const wrapper = shallow(<FaktaSubmitButton
      isReadOnly={false}
      isSubmittable
      isSubmitting={false}
      isDirty={false}
      hasEmptyRequiredFields={false}
      hasOpenAksjonspunkter={false}
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.true;
  });
});
