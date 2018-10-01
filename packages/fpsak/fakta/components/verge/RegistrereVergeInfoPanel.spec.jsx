import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { RegistrereVergeInfoPanelImpl } from './RegistrereVergeInfoPanel';

describe('<RegistrereVergeInfoPanel>', () => {
  it('skal vise faktapanel og form for registrere verge', () => {
    const wrapper = shallowWithIntl(<RegistrereVergeInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['verge']}
      toggleInfoPanelCallback={sinon.spy()}
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
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel).to.have.length(1);
    expect(panel.prop('title')).to.eql('Fakta om verge/fullmektig');
    expect(panel.prop('hasOpenAksjonspunkter')).is.true;
    expect(panel.prop('isInfoPanelOpen')).is.true;
    expect(panel.prop('faktaId')).to.eql('verge');
  });

  it('skal vise lukket faktapanel når panelet er markert lukket', () => {
    const wrapper = shallowWithIntl(<RegistrereVergeInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
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
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel.prop('isInfoPanelOpen')).is.false;
  });
});
