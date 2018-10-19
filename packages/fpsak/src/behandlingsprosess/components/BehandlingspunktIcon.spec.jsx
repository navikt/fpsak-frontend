import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import { intlMock } from 'testHelpers/intl-enzyme-test-helper';
import Image from 'sharedComponents/Image';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import { BehandlingspunktIcon } from './BehandlingspunktIcon';

describe('<BehandlingspunktIcon>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<BehandlingspunktIcon
      intl={intlMock}
      behandlingspunkt={behandlingspunktCodes.ADOPSJON}
      isSelectedBehandlingspunkt
      isSelectedBehandlingHenlagt={false}
      titleCode="Behandlingspunkt.Adopsjonsvilkaret"
      status={vilkarUtfallType.IKKE_VURDERT}
      hasOpenAksjonspunkt
      selectBehandlingspunktCallback={sinon.spy()}
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(1);
  });

  it('skal velge behandling ved tastetrykk når behandlingspunkt er vurdert', () => {
    const callback = sinon.spy();
    const wrapper = shallow(<BehandlingspunktIcon
      intl={intlMock}
      behandlingspunkt={behandlingspunktCodes.ADOPSJON}
      isSelectedBehandlingspunkt
      isSelectedBehandlingHenlagt={false}
      titleCode="Behandlingspunkt.Adopsjonsvilkaret"
      status={vilkarUtfallType.IKKE_VURDERT}
      hasOpenAksjonspunkt
      selectBehandlingspunktCallback={callback}
    />);

    wrapper.find(Image).simulate('keyDown');

    expect(callback.called).is.true;
    const { args } = callback.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql(behandlingspunktCodes.ADOPSJON);
  });

  it('skal ikke velge behandling ved tastetrykk når behandlingspunkt ikke er vurdert', () => {
    const callback = sinon.spy();
    const wrapper = shallow(<BehandlingspunktIcon
      intl={intlMock}
      behandlingspunkt={behandlingspunktCodes.ADOPSJON}
      isSelectedBehandlingspunkt
      isSelectedBehandlingHenlagt={false}
      titleCode="Behandlingspunkt.Adopsjonsvilkaret"
      status={vilkarUtfallType.IKKE_VURDERT}
      hasOpenAksjonspunkt={false}
      selectBehandlingspunktCallback={callback}
    />);

    wrapper.find(Image).simulate('keyDown');

    expect(callback.called).is.false;
  });
});
