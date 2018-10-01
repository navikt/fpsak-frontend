import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import OverstyrConfirmationForm from './OverstyrConfirmationForm';

describe('<OverstyrConfirmationForm>', () => {
  it('skal rendre form for begrunnelse når en ikke er i readonly-modus', () => {
    const wrapper = shallowWithIntl(<OverstyrConfirmationForm.WrappedComponent
      formProps={reduxFormPropsMock}
      intl={intlMock}
      isReadOnly={false}
      isBeregningConfirmation
    />);

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    expect(textArea.prop('label')).is.eql('Oppgi årsak til overstyring av beregningsgrunnlag');
    expect(textArea.prop('maxLength')).is.eql(1500);
  });
});
