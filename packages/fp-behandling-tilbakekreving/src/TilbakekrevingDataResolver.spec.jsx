import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { TilbakekrevingDataResolver } from './TilbakekrevingDataResolver';

describe('TilbakekrevingDataResolver', () => {
  it('skal vise laste-panel når data ikke er hentet ferdig', () => {
    const fetchKodeverk = sinon.spy();

    const wrapper = shallow(
      <TilbakekrevingDataResolver
        fetchKodeverk={fetchKodeverk}
        isInSync={false}
      >
        <div>test</div>
      </TilbakekrevingDataResolver>,
    );

    expect(wrapper.find(LoadingPanel)).to.have.length(1);
    expect(wrapper.find('div')).to.have.length(0);

    expect(fetchKodeverk.getCalls()).has.length(1);
  });

  it('skal vise innhold når data er hentet ferdig', () => {
    const fetchKodeverk = sinon.spy();

    const wrapper = shallow(
      <TilbakekrevingDataResolver
        fetchKodeverk={fetchKodeverk}
        isInSync
      >
        <div>test</div>
      </TilbakekrevingDataResolver>,
    );

    expect(wrapper.find(LoadingPanel)).to.have.length(0);
    expect(wrapper.find('div')).to.have.length(1);
  });
});
