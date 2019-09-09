import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import tilbakekrevingAksjonspunktCodes from '../kodeverk/tilbakekrevingAksjonspunktCodes';
import { BehandlingsprosessTilbakekrevingIndex } from './BehandlingsprosessTilbakekrevingIndex';
import TilbakekrevingBehandlingspunktInfoPanel from './components/TilbakekrevingBehandlingspunktInfoPanel';

describe('BehandlingsprosessTilbakekrevingIndex', () => {
  const defaultProps = {
    behandlingUuid: '1',
    behandlingIdentifier: new BehandlingIdentifier(1, 1),
    fagsakYtelseType: { kode: '' },
    behandlingVersjon: 1,
    behandlingType: { kode: '' },
    behandlingStatus: { kode: '' },
    aksjonspunkter: [],
    resolveProsessAksjonspunkterSuccess: true,
    location: {},
    isSelectedBehandlingHenlagt: true,
    dispatchSubmitFailed: sinon.spy(),
  };
  const previewCallbackDef = sinon.spy();
  const submitCallbackDef = sinon.spy();
  const goToDefaultPageDef = sinon.spy();
  const goToSearchPageDef = sinon.spy();

  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessTilbakekrevingIndex
      {...defaultProps}
    />).find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submitCallbackDef, goToDefaultPageDef, goToSearchPageDef);
    expect(wrapper.find(TilbakekrevingBehandlingspunktInfoPanel)).to.have.length(1);
  });

  it('skal gå til default side etter at aksjonspunkt er bekreftet og aksjonspunkt ikke er foreslå vedtak', () => {
    const submit = sinon.spy();
    const goToDefaultPage = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessTilbakekrevingIndex
      {...defaultProps}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submit, goToDefaultPage, goToSearchPageDef);

    const panel = innerWrapper.find(TilbakekrevingBehandlingspunktInfoPanel);
    const apModels = [{
      kode: '1234',
    }];

    panel.prop('submitCallback')(apModels);

    expect(submit.called).is.true;
    const { args } = submit.getCalls()[0];
    expect(args).has.length(3);
    expect(args[0]).is.eql(apModels);

    args[1]();

    expect(wrapper.state().showFatterVedtakModal).is.false;
    expect(goToDefaultPage.called).is.true;
  });

  it('skal åpne fatter vedtak modal når aksjonspunkt er foreslå vedtak', () => {
    const submit = sinon.spy();
    const goToDefaultPage = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessTilbakekrevingIndex
      {...defaultProps}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submit, goToDefaultPage, goToSearchPageDef);

    const panel = innerWrapper.find(TilbakekrevingBehandlingspunktInfoPanel);
    const apModels = [{
      kode: tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK,
    }];

    panel.prop('submitCallback')(apModels);
    expect(submit.called).is.true;
    const { args } = submit.getCalls()[0];
    expect(args).has.length(3);
    expect(args[0]).is.eql(apModels);

    args[1]();

    expect(wrapper.state().showFatterVedtakModal).is.true;
    expect(goToDefaultPage.called).is.false;
  });
});
