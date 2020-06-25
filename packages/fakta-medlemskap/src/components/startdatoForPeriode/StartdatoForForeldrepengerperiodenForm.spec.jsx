import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { FaktaSubmitButton } from '@fpsak-frontend/fakta-felles';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';

import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-medlemskap';
import { StartdatoForForeldrepengerperiodenForm } from './StartdatoForForeldrepengerperiodenForm';

describe('<StartdatoForForeldrepengerperiodenForm>', () => {
  it('skal vise form for avklaring av startdato', () => {
    const wrapper = shallowWithIntl(<StartdatoForForeldrepengerperiodenForm
      {...reduxFormPropsMock}
      intl={intlMock}
      arbeidsgiver="Sopra Steria"
      hasAksjonspunkt
      hasOpenAksjonspunkt
      hasOpenMedlemskapAksjonspunkter
      submittable
      overstyringDisabled={false}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText).has.length(1);
    expect(helpText.prop('isAksjonspunktOpen')).is.true;

    const button = wrapper.find(FaktaSubmitButton);
    expect(button).has.length(1);
    expect(button.prop('isReadOnly')).is.false;
    expect(button.prop('formName')).is.eql('mockForm');
    expect(button.prop('isSubmittable')).is.true;
  });
});
