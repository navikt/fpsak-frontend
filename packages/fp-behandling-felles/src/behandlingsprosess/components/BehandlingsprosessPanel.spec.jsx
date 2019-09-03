import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import BehandlingsprosessPanel from './BehandlingsprosessPanel';
import BehandlingspunktIcon from './BehandlingspunktIcon';

describe('<BehandlingsprosessPanel>', () => {
  it('skal vise to behandlingspunkt', () => {
    const selectCallback = sinon.spy();
    const punkter = [
      {
        navn: behandlingspunktCodes.ADOPSJON,
        selected: true,
        src: '/dummy.svg',
        srcHoover: '/dummy_hoover.svg',
        title: behandlingspunktCodes.ADOPSJON,
        isIkkeVurdert: true,
        callback: selectCallback,
      }, {
        navn: behandlingspunktCodes.FOEDSEL,
        selected: false,
        src: '/dummy.svg',
        srcHoover: '/dummy_hoover.svg',
        title: behandlingspunktCodes.FOEDSEL,
        isIkkeVurdert: true,
        callback: selectCallback,
      }];
    const wrapper = shallow(<BehandlingsprosessPanel
      punkter={punkter}
      selectedBehandlingspunkt={behandlingspunktCodes.ADOPSJON}
      isSelectedBehandlingHenlagt={false}
    />);

    expect(wrapper.find(BehandlingspunktIcon)).to.have.length(2);
  });

  it('skal ikke kunne velge behandlingspunkt som ikke er vurdert med tastetrykk eller museklikk', () => {
    ['keyDown', 'mouseDown'].forEach((action) => {
      const selectCallback = sinon.spy();
      const punkter = [
        {
          navn: behandlingspunktCodes.ADOPSJON,
          selected: true,
          src: '/dummy.svg',
          srcHoover: '/dummy_hoover.svg',
          title: 'dummy',
          isIkkeVurdert: true,
          callback: selectCallback,
        }];
      const wrapper = shallow(<BehandlingsprosessPanel
        punkter={punkter}
        selectedBehandlingspunkt={behandlingspunktCodes.ADOPSJON}
        isSelectedBehandlingHenlagt={false}
      />);
      const icon = wrapper.find(BehandlingspunktIcon);
      icon.simulate(action);
      expect(selectCallback)
        .to
        .have
        .property('callCount', 0);
    });
  });
});
