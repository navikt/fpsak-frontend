import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { UttakFaktaForm } from './UttakFaktaForm';


describe('<UttakFaktaForm>', () => {
  it('skal vise error melding hvis det er noe error', () => {
    const formProps = {
      error: 'Perioder overlapper',
    };
    const wrapper = shallowWithIntl(
      <UttakFaktaForm
        readOnly={false}
        hasOpenAksjonspunkter
        behandlingFormPrefix="UttakFaktaForm"
        initialValues={{}}
        aksjonspunkter={[]}
        submitting={false}
        hasRevurderingOvertyringAp={false}
        {...formProps}
      />,
    );

    const span = wrapper.find('span');
    expect(span).to.have.length(1);
    expect(span.text()).to.equal('Perioder overlapper');
  });
});
