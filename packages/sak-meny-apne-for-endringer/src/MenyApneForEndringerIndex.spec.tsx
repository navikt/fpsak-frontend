import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-meny';
import MenyApneForEndringerIndex from './MenyApneForEndringerIndex';

describe('<MenyApneForEndringerIndex>', () => {
  it('skal vise modal og velge å åpne behandling for endringer', () => {
    const apneForEndringerCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenyApneForEndringerIndex
      behandlingId={3}
      behandlingVersjon={1}
      apneBehandlingForEndringer={apneForEndringerCallback}
      lukkModal={lukkModalCallback}
    />);

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).to.have.length(1);

    modal.prop('submit')();

    const kall = apneForEndringerCallback.getCalls();
    expect(kall).to.have.length(1);
    expect(kall[0].args).to.have.length(1);
    expect(kall[0].args[0]).to.eql({
      behandlingId: 3,
      behandlingVersjon: 1,
    });
  });
});
