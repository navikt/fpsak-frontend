import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormkravKlageFormNfpImpl } from './FormkravKlageFormNfp';
import FormkravKlageForm from './FormkravKlageForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-formkrav';

describe('<FormkravKlageFormNfp>', () => {
  it('skal initiere fomrkrav-form', () => {
    const wrapper = shallowWithIntl(<FormkravKlageFormNfpImpl
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={2}
      alleKodeverk={{}}
      avsluttedeBehandlinger={[]}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find(FormkravKlageForm)).has.length(1);
  });
});
