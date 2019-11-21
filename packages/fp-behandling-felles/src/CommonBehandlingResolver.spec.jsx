import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import CommonBehandlingResolver from './CommonBehandlingResolver';

describe('CommonBehandlingResolver', () => {
  it('skal vise laste-panel når data ikke er hentet ferdig', () => {
    const saksnummer = 1234;
    const behandlingId = 1;
    const identifier = new BehandlingIdentifier(saksnummer, behandlingId);
    const fetchBehandling = sinon.spy();

    const wrapper = shallow(
      <CommonBehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        isInSync={false}
        hasFetchStarted
      >
        <div>test</div>
      </CommonBehandlingResolver>,
    );

    expect(wrapper.find(LoadingPanel)).to.have.length(1);
  });

  it('skal hente behandling når behandling-identifikator blir satt', () => {
    const saksnummer = 1234;
    const behandlingId = 1;
    const identifier = new BehandlingIdentifier(saksnummer, behandlingId);
    const fetchBehandling = sinon.spy();

    const wrapper = shallow(
      <CommonBehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        isInSync={false}
        hasFetchStarted={false}
      >
        <div>test</div>
      </CommonBehandlingResolver>,
    );

    wrapper.setProps({ behandlingIdentifier: identifier });

    expect(fetchBehandling.getCalls()).has.length(1);
    const { args } = fetchBehandling.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql(identifier);

    expect(wrapper.find(LoadingPanel)).to.have.length(1);
  });

  it('skal ikke hente behandling men kun vise innhold når data er hentet ferdig', () => {
    const saksnummer = 1234;
    const behandlingId = 1;
    const identifier = new BehandlingIdentifier(saksnummer, behandlingId);
    const fetchBehandling = sinon.spy();

    const wrapper = shallow(
      <CommonBehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        isInSync
        hasFetchStarted
      >
        <div>test</div>
      </CommonBehandlingResolver>,
    );

    expect(fetchBehandling.getCalls()).has.length(0);
    expect(wrapper.find('div')).to.have.length(1);
  });
});
