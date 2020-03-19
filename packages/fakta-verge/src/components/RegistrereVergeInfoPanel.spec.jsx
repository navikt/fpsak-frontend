import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { RegistrereVergeInfoPanelImpl } from './RegistrereVergeInfoPanel';
import RegistrereVergeFaktaForm from './RegistrereVergeFaktaForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-verge';

describe('<RegistrereVergeInfoPanel>', () => {
  it('skal vise faktapanel og form for registrere verge', () => {
    const wrapper = shallowWithIntl(<RegistrereVergeInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      hasOpenAksjonspunkter
      readOnly={false}
      aksjonspunkt={{
        kode: 5030,
        id: 100001,
        definisjon: { kode: '5030', navn: 'VERGE' },
        status: { kode: 'OPPR', navn: 'Opprettet', kodeverk: 'AKSJONSPUNKT_STATUS' },
        kanLoses: true,
        erAktivt: true,
      }}
      vergetyper={[{}]}
      behandlingId={1}
      behandlingVersjon={1}
      alleMerknaderFraBeslutter={{}}
    />);

    const panel = wrapper.find(RegistrereVergeFaktaForm);
    expect(panel).to.have.length(1);
  });
});
