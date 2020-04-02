import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import { BehandlingsupportDataResolver } from './BehandlingsupportDataResolver';

describe('<BehandlingsupportDataResolver>', () => {
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
