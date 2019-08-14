import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { BehandlingsprosessInnsynIndex } from './BehandlingsprosessInnsynIndex';
import BehandlingspunktInnsynInfoPanel from './components/BehandlingspunktInnsynInfoPanel';

describe('BehandlingsprosessInnsynIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessInnsynIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      previewCallback={sinon.spy()}
      submitCallback={sinon.spy()}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
    />);
    expect(wrapper.find(BehandlingspunktInnsynInfoPanel)).to.have.length(1);
  });

  it('skal bekrefte aksjonspunktet', () => {
    const submit = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessInnsynIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      previewCallback={sinon.spy()}
      submitCallback={submit}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
    />);

    const panel = wrapper.find(BehandlingspunktInnsynInfoPanel);
    const apModels = [{
      kode: aksjonspunktCodes.FORESLA_VEDTAK,
    }];

    panel.prop('submitCallback')(apModels);

    expect(submit.called).is.true;
    const { args } = submit.getCalls()[0];
    expect(args).has.length(3);
    expect(args[2]).is.true;
  });
});
