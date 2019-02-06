import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-behandling-felles';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { FpSakBehandlingResolver } from './FpSakBehandlingResolver';

describe('FpSakBehandlingResolver', () => {
  it('skal vise laste-panel når data ikke er hentet ferdig', () => {
    const saksnummer = 1234;
    const behandlingId = 1;
    const identifier = new BehandlingIdentifier(saksnummer, behandlingId);
    const fetchBehandling = sinon.spy();

    const wrapper = shallow(
      <FpSakBehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        behandlingerVersjonMappedById={{ test: 'test' }}
        isInSync={false}
        behandlingerTyperMappedById={{ 1: BehandlingType.FORSTEGANGSSOKNAD }}
        hasFetchStarted
      >
        <div>test</div>
      </FpSakBehandlingResolver>,
    );

    expect(wrapper.find(LoadingPanel)).to.have.length(1);
  });

  it('skal hente behandling når behandling-identifikator blir satt', () => {
    const saksnummer = 1234;
    const behandlingId = 1;
    const identifier = new BehandlingIdentifier(saksnummer, behandlingId);
    const fetchBehandling = sinon.spy();

    const wrapper = shallow(
      <FpSakBehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        behandlingerVersjonMappedById={{ test: 'test' }}
        isInSync={false}
        behandlingerTyperMappedById={{ 1: BehandlingType.FORSTEGANGSSOKNAD }}
        hasFetchStarted={false}
      >
        <div>test</div>
      </FpSakBehandlingResolver>,
    );

    wrapper.setProps({ behandlingIdentifier: identifier });

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
      <FpSakBehandlingResolver
        behandlingIdentifier={identifier}
        fetchBehandling={fetchBehandling}
        behandlingerVersjonMappedById={{ }}
        isInSync
        behandlingerTyperMappedById={{ 1: BehandlingType.FORSTEGANGSSOKNAD }}
        hasFetchStarted
      >
        <div>test</div>
      </FpSakBehandlingResolver>,
    );

    expect(fetchBehandling.getCalls()).has.length(0);
    expect(wrapper.find('div')).to.have.length(1);
  });
});
