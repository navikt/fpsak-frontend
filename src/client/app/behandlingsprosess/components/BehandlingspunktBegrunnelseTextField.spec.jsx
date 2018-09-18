import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { TextAreaField } from 'form/Fields';
import BehandlingspunktBegrunnelseTextField from './BehandlingspunktBegrunnelseTextField';

describe('<BehandlingspunktBegrunnelseTextField>', () => {
  it('skal vise tekstfelt som ikke readOnly', () => {
    const wrapper = shallowWithIntl(<BehandlingspunktBegrunnelseTextField.WrappedComponent
      intl={intlMock}
      readOnly={false}
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('readOnly')).is.false;
  });

  it('skal vise tekstfelt som readOnly', () => {
    const wrapper = shallowWithIntl(<BehandlingspunktBegrunnelseTextField.WrappedComponent
      intl={intlMock}
      readOnly
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('readOnly')).is.true;
  });

  it('skal vise default tekstkode', () => {
    const wrapper = shallowWithIntl(<BehandlingspunktBegrunnelseTextField.WrappedComponent
      intl={intlMock}
      readOnly={false}
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField.prop('label')).is.eql('Vurdering');
  });

  it('skal vise gitt tekstkode', () => {
    const wrapper = shallowWithIntl(<BehandlingspunktBegrunnelseTextField.WrappedComponent
      intl={intlMock}
      readOnly={false}
      textCode="Klage.ResolveKlage.ExplanationRequiredBrev"
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField.prop('label')).is.eql('Begrunnelse/tekst i brev');
  });

  it('skal hente begrunnelse fra første aksjonspunkt', () => {
    const aksjonspunkter = [{
      begrunnelse: 'test &amp;',
    }];
    const initalValues = BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter);
    expect(initalValues).is.eql({ begrunnelse: 'test &' });
  });
});
