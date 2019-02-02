import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormkravKlageFormKaImpl } from './FormkravKlageFormKa';


describe('<FormkravKlageFormKa>', () => {
  it('skal initiere form', () => {
    const wrapper = shallowWithIntl(<FormkravKlageFormKaImpl
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA}
      intl={intlMock}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find('Connect(InjectIntl(FormkravKlageForm))')).has.length(1);
  });
});
