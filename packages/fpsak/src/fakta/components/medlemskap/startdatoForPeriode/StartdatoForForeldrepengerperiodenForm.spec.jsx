import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import { StartdatoForForeldrepengerperiodenForm } from './StartdatoForForeldrepengerperiodenForm';

describe('<StartdatoForForeldrepengerperiodenForm>', () => {
  it('skal vise form for avklaring av startdato', () => {
    const wrapper = shallow(<StartdatoForForeldrepengerperiodenForm
      {...reduxFormPropsMock}
      arbeidsgiver="Sopra Steria"
      hasOpenAksjonspunkt
      hasOpenMedlemskapAksjonspunkter
      submittable
      readOnly={false}
    />);

    const helpText = wrapper.find(AksjonspunktHelpText);
    expect(helpText).has.length(1);
    expect(helpText.prop('isAksjonspunktOpen')).is.true;

    const button = wrapper.find(FaktaSubmitButton);
    expect(button).has.length(1);
    expect(button.prop('isReadOnly')).is.false;
    expect(button.prop('formName')).is.eql('mockForm');
    expect(button.prop('isSubmittable')).is.true;
  });
});
