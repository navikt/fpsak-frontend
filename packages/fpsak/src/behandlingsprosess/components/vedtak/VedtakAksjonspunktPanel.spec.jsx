import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import behandlingStatus from 'kodeverk/behandlingStatus';
import { VedtakAksjonspunktPanelImpl } from './VedtakAksjonspunktPanel';

describe('<VedtakAksjonspunktPanel>', () => {
  it('skal kun vise en tekst når behandling er henlagt', () => {
    const aksjonspunktKoder = [];
    const wrapper = shallowWithIntl(<VedtakAksjonspunktPanelImpl
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      readOnly={false}
      isBehandlingHenlagt
      aksjonspunktKoder={aksjonspunktKoder}
      isBehandlingReadOnly={false}
    />);

    const label = wrapper.find('Systemtittel');
    expect(label).to.have.length(1);
    expect(label.childAt(0).text()).is.eql('Behandlingen er henlagt');
  });
});
