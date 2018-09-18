import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { BehandlingResolver } from './BehandlingResolver';

describe('BehandlingResolver', () => {
  it('skal hente behandling og så vise laste-panel når data ikke er hentet ferdig', () => {
    const saksnummer = 1234;
    const behandlingId = 1;
    const identifier = new BehandlingIdentifier(saksnummer, behandlingId);
    const fetchBehandling = sinon.spy();

    const wrapper = shallow(
      <BehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        behandlingerVersjonMappedById={{ test: 'test' }}
        isInSync={false}
      >
        <div>test</div>
      </BehandlingResolver>,
    );

    expect(fetchBehandling.getCalls()).has.length(1);
    const { args } = fetchBehandling.getCalls()[0];
    expect(args).has.length(2);
    expect(args[0]).is.eql(identifier);
    expect(args[1]).is.eql({ test: 'test' });

    expect(wrapper.find(LoadingPanel)).to.have.length(1);
  });

  it('skal ikke hente behandling men kun vise innhold når data er hentet ferdig', () => {
    const saksnummer = 1234;
    const behandlingId = 1;
    const identifier = new BehandlingIdentifier(saksnummer, behandlingId);
    const fetchBehandling = sinon.spy();

    const wrapper = shallow(
      <BehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        behandlingerVersjonMappedById={{ }}
        isInSync
      >
        <div>test</div>
      </BehandlingResolver>,
    );

    expect(fetchBehandling.getCalls()).has.length(0);
    expect(wrapper.find('div')).to.have.length(1);
  });
});
