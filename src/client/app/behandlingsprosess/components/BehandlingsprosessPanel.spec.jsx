import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import { BehandlingsprosessPanel } from './BehandlingsprosessPanel';
import BehandlingspunktIcon from './BehandlingspunktIcon';

describe('<BehandlingsprosessPanel>', () => {
  it('skal vise ett behandlingspunkt', () => {
    const wrapper = shallow(<BehandlingsprosessPanel
      behandlingspunkter={[behandlingspunktCodes.ADOPSJON]}
      selectedBehandlingspunkt={behandlingspunktCodes.ADOPSJON}
      selectBehandlingspunktCallback={sinon.spy()}
      isSelectedBehandlingHenlagt={false}
      notAcceptedByBeslutter={false}
    />);

    expect(wrapper.find(BehandlingspunktIcon)).to.have.length(1);
  });

  it('skal vise to behandlingspunkt', () => {
    const wrapper = shallow(<BehandlingsprosessPanel
      behandlingspunkter={[behandlingspunktCodes.ADOPSJON, behandlingspunktCodes.FOEDSEL]}
      selectedBehandlingspunkt={behandlingspunktCodes.ADOPSJON}
      selectBehandlingspunktCallback={sinon.spy()}
      isSelectedBehandlingHenlagt={false}
      notAcceptedByBeslutter={false}
    />);

    expect(wrapper.find(BehandlingspunktIcon)).to.have.length(2);
  });

  it('skal ikke kunne velge behandlingspunkt som ikke er vurdert med museklikk', () => {
    const selectCallback = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessPanel
      behandlingspunkter={[behandlingspunktCodes.ADOPSJON]}
      selectedBehandlingspunkt={behandlingspunktCodes.ADOPSJON}
      selectBehandlingspunktCallback={selectCallback}
      isSelectedBehandlingHenlagt={false}
      notAcceptedByBeslutter={false}
    />);

    const icon = wrapper.find(BehandlingspunktIcon);
    icon.simulate('mouseDown');
    expect(selectCallback).to.have.property('callCount', 0);
  });

  it('skal ikke kunne velge behandlingspunkt som ikke er vurdert med tastetrykk', () => {
    const selectCallback = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessPanel
      behandlingspunkter={[behandlingspunktCodes.ADOPSJON]}
      selectedBehandlingspunkt={behandlingspunktCodes.ADOPSJON}
      selectBehandlingspunktCallback={selectCallback}
      isSelectedBehandlingHenlagt={false}
      notAcceptedByBeslutter={false}
    />);

    const icon = wrapper.find(BehandlingspunktIcon);
    icon.simulate('keyDown');
    expect(selectCallback).to.have.property('callCount', 0);
  });
});
