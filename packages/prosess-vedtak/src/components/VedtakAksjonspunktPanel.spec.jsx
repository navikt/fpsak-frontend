import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VedtakAksjonspunktPanelImpl } from './VedtakAksjonspunktPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-vedtak';

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
    expect(label.childAt(0).text()).is.eql('Behandlingen er henlagt');
  });
});
