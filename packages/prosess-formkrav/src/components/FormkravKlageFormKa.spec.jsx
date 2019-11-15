import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormkravKlageFormKa } from './FormkravKlageFormKa';
import FormkravKlageForm from './FormkravKlageForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-formkrav';


describe('<FormkravKlageFormKa>', () => {
  it('skal initiere form', () => {
    const wrapper = shallowWithIntl(<FormkravKlageFormKa
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA}
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
      avsluttedeBehandlinger={[]}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find(FormkravKlageForm)).has.length(1);
  });
});
