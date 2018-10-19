import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import FaktaEkspandertpanel from './FaktaEkspandertpanel';

describe('<FaktaEkspandertpanel>', () => {
  it('skal vise ekspandertpanel for fakta', () => {
    const toggleFunction = sinon.spy();
    const wrapper = shallowWithIntl(
      <FaktaEkspandertpanel
        title="faktapanelTitle"
        hasOpenAksjonspunkter
        isInfoPanelOpen
        toggleInfoPanelCallback={toggleFunction}
        readOnly={false}
        faktaId="id"
      >
        <span>test</span>
      </FaktaEkspandertpanel>,
    );

    const panel = wrapper.find('EkspanderbartpanelPure');
    expect(panel).to.have.length(1);
    expect(panel.prop('tittel')).to.eql('faktapanelTitle');
    expect(panel.prop('apen')).is.true;
    expect(panel.children()).has.length(1);
    expect(panel.childAt(0).text()).is.eql('test');
  });

  it('skal lage korrekt toggle callback', () => {
    const toggleFunction = sinon.spy();
    const wrapper = shallowWithIntl(
      <FaktaEkspandertpanel
        title="faktapanelTitle"
        hasOpenAksjonspunkter
        isInfoPanelOpen
        toggleInfoPanelCallback={toggleFunction}
        faktaId="id"
        readOnly={false}
      >
        <span>test</span>
      </FaktaEkspandertpanel>,
    );

    const panel = wrapper.find('EkspanderbartpanelPure');
    expect(toggleFunction).to.have.property('callCount', 0);

    panel.prop('onClick')();

    expect(toggleFunction).to.have.property('callCount', 1);
    const { args } = toggleFunction.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql('id');
  });
});
