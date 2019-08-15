import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import tilbakekrevingAksjonspunktCodes from '../kodeverk/tilbakekrevingAksjonspunktCodes';
import { BehandlingsprosessTilbakekrevingIndex } from './BehandlingsprosessTilbakekrevingIndex';
import TilbakekrevingBehandlingspunktInfoPanel from './components/TilbakekrevingBehandlingspunktInfoPanel';

describe('BehandlingsprosessTilbakekrevingIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessTilbakekrevingIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      submitCallback={sinon.spy()}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
    />);
    expect(wrapper.find(TilbakekrevingBehandlingspunktInfoPanel)).to.have.length(1);
  });

  it('skal gå til default side etter at aksjonspunkt er bekreftet og aksjonspunkt ikke er foreslå vedtak', () => {
    const submit = sinon.spy();
    const goToDefaultPage = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessTilbakekrevingIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      submitCallback={submit}
      goToDefaultPage={goToDefaultPage}
      goToSearchPage={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
    />);

    const panel = wrapper.find(TilbakekrevingBehandlingspunktInfoPanel);
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
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      submitCallback={submit}
      goToDefaultPage={goToDefaultPage}
      goToSearchPage={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
    />);

    const panel = wrapper.find(TilbakekrevingBehandlingspunktInfoPanel);
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
