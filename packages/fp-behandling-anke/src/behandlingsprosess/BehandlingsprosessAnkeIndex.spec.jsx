import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { BehandlingsprosessAnkeIndex } from './BehandlingsprosessAnkeIndex';
import BehandlingspunktAnkeInfoPanel from './components/BehandlingspunktAnkeInfoPanel';

describe('BehandlingsprosessAnkeIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      saveAnke={sinon.spy()}
      resolveAnkeTemp={sinon.spy()}
      previewCallback={sinon.spy()}
      submitCallback={sinon.spy()}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
    />);
    expect(wrapper.find(BehandlingspunktAnkeInfoPanel)).to.have.length(1);
  });

  it('skal gå til default side etter at aksjonspunkt er bekreftet og behandling ikke skal til medunderskiver eller ferdigstilles', () => {
    const submit = sinon.spy();
    const goToDefaultPage = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      saveAnke={sinon.spy()}
      resolveAnkeTemp={sinon.spy()}
      previewCallback={sinon.spy()}
      submitCallback={submit}
      goToDefaultPage={goToDefaultPage}
      goToSearchPage={sinon.spy()}
    />);

    const panel = wrapper.find(BehandlingspunktAnkeInfoPanel);
    const apModels = [{
      kode: '1234',
    }];

    panel.prop('submitCallback')(apModels);

    expect(submit.called).is.true;
    const { args } = submit.getCalls()[0];
    expect(args).has.length(3);
    expect(args[0]).is.eql(apModels);

    args[1]();

    expect(wrapper.state().showModalAnkeBehandling).is.false;
    expect(goToDefaultPage.called).is.true;
  });

  it('skal vise modal etter at aksjonspunkt er bekreftet og behandling skal til medunderskiver eller skal ferdigstilles', () => {
    const submit = sinon.spy();
    const goToDefaultPage = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      saveAnke={sinon.spy()}
      resolveAnkeTemp={sinon.spy()}
      previewCallback={sinon.spy()}
      submitCallback={submit}
      goToDefaultPage={goToDefaultPage}
      goToSearchPage={sinon.spy()}
    />);

    const panel = wrapper.find(BehandlingspunktAnkeInfoPanel);
    const apModels = [{
      kode: aksjonspunktCodes.FORESLA_VEDTAK,
    }];

    panel.prop('submitCallback')(apModels);

    expect(submit.called).is.true;
    const { args } = submit.getCalls()[0];
    expect(args).has.length(3);
    expect(args[0]).is.eql(apModels);

    args[1]();

    expect(wrapper.state().showModalAnkeBehandling).is.true;
    expect(goToDefaultPage.called).is.false;
  });

  it('skal oppdatere info når behandlingen ikke skal til medunderskriver', () => {
    const submit = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      saveAnke={sinon.spy()}
      resolveAnkeTemp={sinon.spy()}
      previewCallback={sinon.spy()}
      submitCallback={submit}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
    />);

    const panel = wrapper.find(BehandlingspunktAnkeInfoPanel);
    const apModels = [{
      kode: aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    }];

    panel.prop('submitCallback')(apModels);

    expect(submit.called).is.true;
    const { args } = submit.getCalls()[0];
    expect(args).has.length(3);
    expect(args[2]).is.true;
  });

  it('skal oppdatere info når behandlingen skal til medunderskriver', () => {
    const submit = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      saveAnke={sinon.spy()}
      resolveAnkeTemp={sinon.spy()}
      previewCallback={sinon.spy()}
      submitCallback={submit}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
    />);

    const panel = wrapper.find(BehandlingspunktAnkeInfoPanel);
    const apModels = [{
      kode: aksjonspunktCodes.FORESLA_VEDTAK,
    }];

    panel.prop('submitCallback')(apModels);

    expect(submit.called).is.true;
    const { args } = submit.getCalls()[0];
    expect(args).has.length(3);
    expect(args[2]).is.false;
  });

  it('skal mellomlagre anketekst', () => {
    const saveAnke = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      saveAnke={saveAnke}
      resolveAnkeTemp={sinon.spy()}
      previewCallback={sinon.spy()}
      submitCallback={sinon.spy()}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
    />);

    const panel = wrapper.find(BehandlingspunktAnkeInfoPanel);
    const apModels = [{
      kode: aksjonspunktCodes.FORESLA_VEDTAK,
    }];
    const shouldReopenAp = false;

    panel.prop('saveTempAnke')(apModels, shouldReopenAp);

    expect(saveAnke.called).is.true;
    const { args } = saveAnke.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql({
      behandlingId: 1,
      0: {
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
    });
  });
});
