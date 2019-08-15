import React from 'react';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import VilkarBegrunnelse from './VilkarBegrunnelse';
import OverstyrConfirmationForm from './OverstyrConfirmationForm';

describe('<OverstyrConfirmationForm>', () => {
  it('skal rendre form for begrunnelse når en ikke er i readonly-modus', () => {
    const wrapper = shallowWithIntl(<OverstyrConfirmationForm.WrappedComponent
      isReadOnly={false}
      isBeregningConfirmation
    />);

    const begrunnelseFelt = wrapper.find(VilkarBegrunnelse);
    expect(begrunnelseFelt).to.have.length(1);
  });
});
