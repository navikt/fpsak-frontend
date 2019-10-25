import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VedtakAksjonspunktPanelImpl } from './VedtakAksjonspunktPanel';

describe('<VedtakAksjonspunktPanel>', () => {
  it('skal kun vise en tekst når behandling er henlagt', () => {
    const aksjonspunktKoder = [];
    const wrapper = shallowWithIntl(<VedtakAksjonspunktPanelImpl
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      readOnly={false}
      erBehandlingHenlagt
      aksjonspunktKoder={aksjonspunktKoder}
      isBehandlingReadOnly={false}
    />);

    const label = wrapper.find('Systemtittel');
    expect(label).to.have.length(1);
    expect(label.childAt(0).text()).is.eql('VedtakForm.BehandlingHenlagt');
  });
});
