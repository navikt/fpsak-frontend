import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Image } from '@fpsak-frontend/shared-components';

import TilbakekrevingTimelineController from './TilbakekrevingTimelineController';

describe('<TilbakekrevingTimelineController>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(
      <TilbakekrevingTimelineController
        goBackwardCallback={sinon.spy()}
        goForwardCallback={sinon.spy()}
        zoomInCallback={sinon.spy()}
        zoomOutCallback={sinon.spy()}
        openPeriodInfo={sinon.spy()}
        selectedPeriod={{}}
      >
        <div>test</div>
      </TilbakekrevingTimelineController>,
    );

    expect(wrapper.find(Image)).has.length(6);
  });
});
