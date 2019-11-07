import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import { BehandlingsprosessAnkeIndex } from './BehandlingsprosessAnkeIndex';
import BehandlingspunktAnkeInfoPanel from './components/BehandlingspunktAnkeInfoPanel';

describe('BehandlingsprosessAnkeIndex', () => {
  const defaultProps = {
    behandlingUuid: '1',
    behandlingIdentifier: new BehandlingIdentifier(1, 1),
    saveAnke: sinon.spy(),
    resolveAnkeTemp: sinon.spy(),
    fetchPreviewBrev: sinon.spy(),
    fagsakYtelseType: { kode: '' },
    behandlingVersjon: 1,
    behandlingType: { kode: '' },
    behandlingStatus: { kode: '' },
    aksjonspunkter: [],
    resolveProsessAksjonspunkterSuccess: true,
    location: {},
    isSelectedBehandlingHenlagt: true,
    hasForeslaVedtakAp: false,
  };
  const previewCallbackDef = sinon.spy();
  const submitCallbackDef = sinon.spy();
  const goToDefaultPageDef = sinon.spy();
  const goToSearchPageDef = sinon.spy();

  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      {...defaultProps}
    />).find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submitCallbackDef, goToDefaultPageDef, goToSearchPageDef);
    expect(wrapper.find(BehandlingspunktAnkeInfoPanel)).to.have.length(1);
  });

  it('skal gå til default side etter at aksjonspunkt er bekreftet og behandling ikke skal til medunderskiver eller ferdigstilles', () => {
    const submit = sinon.spy();
    const goToDefaultPage = sinon.spy();
    const wrapper = shallow(<BehandlingsprosessAnkeIndex
      {...defaultProps}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submit, goToDefaultPage, goToSearchPageDef);

    const panel = innerWrapper.find(BehandlingspunktAnkeInfoPanel);
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
      {...defaultProps}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submit, goToDefaultPage, goToSearchPageDef);

    const panel = innerWrapper.find(BehandlingspunktAnkeInfoPanel);
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
      {...defaultProps}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submit, goToDefaultPageDef, goToSearchPageDef);

    const panel = innerWrapper.find(BehandlingspunktAnkeInfoPanel);
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
      {...defaultProps}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submit, goToDefaultPageDef, goToSearchPageDef);

    const panel = innerWrapper.find(BehandlingspunktAnkeInfoPanel);
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
      {...defaultProps}
      saveAnke={saveAnke}
    />);

    const innerWrapper = wrapper.find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submitCallbackDef, goToDefaultPageDef, goToSearchPageDef);

    const panel = innerWrapper.find(BehandlingspunktAnkeInfoPanel);
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
