import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { TextAreaField } from '@fpsak-frontend/form';
import ProsessStegBegrunnelseTextField from './ProsessStegBegrunnelseTextField';

describe('<ProsessStegBegrunnelseTextField>', () => {
  it('skal vise tekstfelt som ikke readOnly', () => {
    const wrapper = shallowWithIntl(<ProsessStegBegrunnelseTextField.WrappedComponent
      intl={intlMock}
      readOnly={false}
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('readOnly')).is.false;
  });

  it('skal vise tekstfelt som readOnly', () => {
    const wrapper = shallowWithIntl(<ProsessStegBegrunnelseTextField.WrappedComponent
      intl={intlMock}
      readOnly
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);
    expect(textField.prop('readOnly')).is.true;
  });

  it('skal vise default tekstkode', () => {
    const wrapper = shallowWithIntl(<ProsessStegBegrunnelseTextField.WrappedComponent
      intl={intlMock}
      readOnly={false}
    />);

    const textField = wrapper.find(TextAreaField);
    expect(textField.prop('label')).is.eql('ProsessStegBegrunnelseTextField.ExplanationRequired');
  });

  it('skal vise gitt tekstkode', () => {
    const wrapper = shallowWithIntl(<ProsessStegBegrunnelseTextField.WrappedComponent
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
    // @ts-ignore Korleis fikse dette på ein bra måte?
    const initalValues = ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter);
    expect(initalValues).is.eql({ begrunnelse: 'test &' });
  });
});
