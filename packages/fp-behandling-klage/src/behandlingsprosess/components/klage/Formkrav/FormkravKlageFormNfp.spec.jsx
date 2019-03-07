import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormkravKlageFormNfpImpl } from './FormkravKlageFormNfp';

describe('<FormkravKlageFormNfp>', () => {
  it('skal initiere fomrkrav-form', () => {
    const wrapper = shallowWithIntl(<FormkravKlageFormNfpImpl
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
      intl={intlMock}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find('Connect(InjectIntl(FormkravKlageForm))')).has.length(1);
  });
});
