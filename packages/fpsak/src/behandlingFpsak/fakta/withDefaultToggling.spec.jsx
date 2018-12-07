import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import withDefaultToggling from './withDefaultToggling';

const TestComp = () => (
  <div className="component" />
);

const TogglingComp = withDefaultToggling('adopsjon', [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD])(TestComp);

describe('HOC: withDefaultToggling', () => {
  it('skal toggle og rendre komponent med nye props', () => {
    const aksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
        navn: 'test',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };
    const toggleCallback = sinon.spy();
    const wrapper = mount(<TogglingComp
      aksjonspunkter={[aksjonspunkt]}
      toggleInfoPanelCallback={toggleCallback}
      shouldOpenDefaultInfoPanels
      readOnly={false}
    />);

    expect(toggleCallback).to.have.property('callCount', 1);
    const { args } = toggleCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql('adopsjon');

    const newTestComp = wrapper.find('TestComp');
    expect(newTestComp).to.have.length(1);
    expect(newTestComp.prop('hasOpenAksjonspunkter')).is.true;
  });

  it('skal ikke toggle og rendre komponent med nye props når det ikke er åpent aksjonspunkt', () => {
    const aksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
        navn: 'test',
      },
      status: {
        kode: aksjonspunktStatus.AVBRUTT,
        navn: 'test',
      },
      kanLoses: true,
      erAktivt: true,
    };
    const toggleCallback = sinon.spy();
    const wrapper = mount(<TogglingComp
      aksjonspunkter={[aksjonspunkt]}
      toggleInfoPanelCallback={toggleCallback}
      shouldOpenDefaultInfoPanels
      readOnly={false}
    />);

    expect(toggleCallback).to.have.property('callCount', 0);
    const newTestComp = wrapper.find('TestComp');
    expect(newTestComp).to.have.length(1);
    expect(newTestComp.prop('hasOpenAksjonspunkter')).is.false;
  });
});
