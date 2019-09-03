import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import { BehandlingsupportDataResolver } from './BehandlingsupportDataResolver';

describe('<BehandlingsupportDataResolver>', () => {
  it('skal vise loadingPanel når data ikke er hentet', () => {
    const wrapper = shallow(
      <BehandlingsupportDataResolver
        fetchTotrinnsaksjonspunkter={sinon.spy()}
        fetchTotrinnsaksjonspunkterReadonly={sinon.spy()}
        resetTotrinnsaksjonspunkter={sinon.spy()}
        resetTotrinnsaksjonspunkterReadonly={sinon.spy()}
        behandlingId={1}
        behandlingStatusKode={BehandlingStatus.FATTER_VEDTAK}
        isInSync={false}
        isInnsyn={false}
      >
        <div>test</div>
      </BehandlingsupportDataResolver>,
    );

    expect(wrapper.find(LoadingPanel)).to.have.length(1);
  });

  it('skal hente totrinnsaksjonspunkter når behandling er endret og behandlingsstatus er FATTER_VEDTAK', () => {
    const fetchTotrinnsaksjonspunkter = sinon.spy();
    const fetchTotrinnsaksjonspunkterReadonly = sinon.spy();
    const wrapper = shallow(
      <BehandlingsupportDataResolver
        fetchTotrinnsaksjonspunkter={fetchTotrinnsaksjonspunkter}
        fetchTotrinnsaksjonspunkterReadonly={fetchTotrinnsaksjonspunkterReadonly}
        resetTotrinnsaksjonspunkter={sinon.spy()}
        resetTotrinnsaksjonspunkterReadonly={sinon.spy()}
        behandlingId={1}
        isInSync={false}
        isInnsyn={false}
      >
        <div>test</div>
      </BehandlingsupportDataResolver>,
    );

    wrapper.setProps({
      behandlingId: 2,
      behandlingStatusKode: BehandlingStatus.FATTER_VEDTAK,
    });

    expect(fetchTotrinnsaksjonspunkter.called).is.true;
    expect(fetchTotrinnsaksjonspunkterReadonly.called).is.false;
  });

  it('skal hente readonly totrinnsaksjonspunkter når behandling er endret og behandlingsstatus er BEHANDLING_UTREDES', () => {
    const fetchTotrinnsaksjonspunkter = sinon.spy();
    const fetchTotrinnsaksjonspunkterReadonly = sinon.spy();
    const wrapper = shallow(
      <BehandlingsupportDataResolver
        fetchTotrinnsaksjonspunkter={fetchTotrinnsaksjonspunkter}
        fetchTotrinnsaksjonspunkterReadonly={fetchTotrinnsaksjonspunkterReadonly}
        resetTotrinnsaksjonspunkter={sinon.spy()}
        resetTotrinnsaksjonspunkterReadonly={sinon.spy()}
        behandlingId={1}
        isInSync={false}
        isInnsyn={false}
      >
        <div>test</div>
      </BehandlingsupportDataResolver>,
    );

    wrapper.setProps({
      behandlingId: 2,
      behandlingStatusKode: BehandlingStatus.BEHANDLING_UTREDES,
    });

    expect(fetchTotrinnsaksjonspunkter.called).is.false;
    expect(fetchTotrinnsaksjonspunkterReadonly.called).is.true;
  });
});
