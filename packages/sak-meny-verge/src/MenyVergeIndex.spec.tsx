import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-meny';
import MenyVergeIndex from './MenyVergeIndex';

describe('<MenyVergeIndex>', () => {
  it('skal vise modal for opprett og så velge å opprette verge', () => {
    const opprettVergeCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenyVergeIndex
      opprettVerge={opprettVergeCallback}
      lukkModal={lukkModalCallback}
    />);

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).to.have.length(1);
    expect(modal.prop('textCode')).is.eql('MenyVergeIndex.OpprettVergeSporsmal');

    modal.prop('submit')();

    const kall = opprettVergeCallback.getCalls();
    expect(kall).to.have.length(1);

    const lukkKall = lukkModalCallback.getCalls();
    expect(lukkKall).to.have.length(1);
  });

  it('skal vise modal for fjerne og så velge å fjerne verge', () => {
    const fjernVergeCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenyVergeIndex
      fjernVerge={fjernVergeCallback}
      lukkModal={lukkModalCallback}
    />);

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).to.have.length(1);
    expect(modal.prop('textCode')).is.eql('MenyVergeIndex.FjernVergeSporsmal');

    modal.prop('submit')();

    const kall = fjernVergeCallback.getCalls();
    expect(kall).to.have.length(1);

    const lukkKall = lukkModalCallback.getCalls();
    expect(lukkKall).to.have.length(1);
  });
});
