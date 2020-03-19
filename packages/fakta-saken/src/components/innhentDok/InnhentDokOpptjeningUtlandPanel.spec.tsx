import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { AksjonspunktBox } from '@fpsak-frontend/shared-components';

import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-saken';
import { InnhentDokOpptjeningUtlandPanel } from './InnhentDokOpptjeningUtlandPanel';

describe('<InnhentDokOpptjeningUtlandPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<InnhentDokOpptjeningUtlandPanel
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
      harApneAksjonspunkter
      handleSubmit={() => undefined}
      readOnly={false}
      submittable
      dirty
      initialValues={{ begrunnelse: undefined }}
      form="FORM_NAVN"
    />);
    expect(wrapper.find(AksjonspunktBox)).to.have.length(1);
  });
});
