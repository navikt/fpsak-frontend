import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import { BehandlingsprosessInnsynIndex } from './BehandlingsprosessInnsynIndex';
import BehandlingspunktInnsynInfoPanel from './components/BehandlingspunktInnsynInfoPanel';

describe('BehandlingsprosessInnsynIndex', () => {
  const defaultProps = {
    behandlingUuid: '1',
    behandlingIdentifier: new BehandlingIdentifier(1, 1),
    fetchPreviewBrev: sinon.spy(),
    fagsakYtelseType: { kode: '' },
    behandlingVersjon: 1,
    behandlingType: { kode: '' },
    behandlingStatus: { kode: '' },
    aksjonspunkter: [],
    resolveProsessAksjonspunkterSuccess: true,
    location: {},
    isSelectedBehandlingHenlagt: true,
  };
  const previewCallbackDef = sinon.spy();
  const submitCallbackDef = sinon.spy();
  const goToDefaultPageDef = sinon.spy();

  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessInnsynIndex
      {...defaultProps}
    />).find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submitCallbackDef, goToDefaultPageDef);
    expect(wrapper.find(BehandlingspunktInnsynInfoPanel)).to.have.length(1);
  });

  it('skal bekrefte aksjonspunktet', () => {
    const submit = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessInnsynIndex
      {...defaultProps}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submit, goToDefaultPageDef);

    const panel = innerWrapper.find(BehandlingspunktInnsynInfoPanel);
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
