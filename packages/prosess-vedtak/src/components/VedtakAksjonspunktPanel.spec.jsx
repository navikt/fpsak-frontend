import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VedtakAksjonspunktPanelImpl } from './VedtakAksjonspunktPanel';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-vedtak';

describe('<VedtakAksjonspunktPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const aksjonspunktKoder = [];
    const wrapper = shallowWithIntl(<VedtakAksjonspunktPanelImpl
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      readOnly={false}
      aksjonspunktKoder={aksjonspunktKoder}
      isBehandlingReadOnly={false}
    />);

    expect(wrapper.find(VedtakHelpTextPanel)).to.have.length(1);
  });
});
