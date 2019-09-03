import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Image } from '@fpsak-frontend/shared-components';
import { BehandlingspunktIcon } from './BehandlingspunktIcon';

describe('<BehandlingspunktIcon>', () => {
  it('skal rendre komponent korrekt', () => {
    const callback = sinon.spy();
    const wrapper = shallow(<BehandlingspunktIcon
      callback={callback}
      isIkkeVurdert
      selected={false}
      src="/dummy.svg"
      srcHoover="/dummy_hoover.svg"
      title="Adopsjonsvilkaret"
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(1);
  });

  it('skal velge behandling ved tastetrykk når behandlingspunkt er vurdert', () => {
    const callback = sinon.spy();
    const wrapper = shallow(<BehandlingspunktIcon
      callback={callback}
      isIkkeVurdert={false}
      selected={false}
      src="/dummy.svg"
      srcHoover="/dummy_hoover.svg"
      title="Adopsjonsvilkaret"
    />);

    wrapper.find(Image).simulate('keyDown');
    expect(callback.called).is.true;
  });

  it('skal ikke velge behandling ved tastetrykk når behandlingspunkt ikke er vurdert', () => {
    const callback = sinon.spy();
    const wrapper = shallow(<BehandlingspunktIcon
      callback={callback}
      isIkkeVurdert
      selected={false}
      src="/dummy.svg"
      srcHoover="/dummy_hoover.svg"
      title="Adopsjonsvilkaret"
    />);

    wrapper.find(Image).simulate('keyDown');

    expect(callback.called).is.false;
  });
});
