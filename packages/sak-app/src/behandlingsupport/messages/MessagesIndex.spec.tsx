import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import Messages, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';

import MessageBehandlingPaVentModal from './MessageBehandlingPaVentModal';
import DataFetcher from '../../app/DataFetcher';
import BehandlingIdentifier from '../../behandling/BehandlingIdentifier';
import { MessagesIndex } from './MessagesIndex';

describe('<MessagesIndex>', () => {
  const recipients = ['Søker', 'Annen person'];
  const templates = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
  ];
  const behandlingIdentifier = new BehandlingIdentifier(1234, 1);
  const sprak = {
    kode: 'NB',
    kodeverk: 'SPRAK',
  };

  it('skal vise messages når mottakere og brevmaler har blitt hentet fra server', () => {
    const templates2 = [
      { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
      { kode: 'Mal2', navn: 'Mal 2', tilgjengelig: true },
      { kode: 'Mal3', navn: 'Mal 3', tilgjengelig: true },
    ];

    const wrapper = shallow(<MessagesIndex
      submitFinished={false}
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);

    const dataFetcher = wrapper.find(DataFetcher);
    const messages = dataFetcher.renderProp('render')({
      brevmaler: templates2,
    }).find(Messages);
    expect(messages).to.have.length(1);
    expect(messages.prop('recipients')).to.eql(recipients);
    expect(messages.prop('templates')).to.eql(templates2);
  });

  it('skal sette default tom streng ved forhåndsvisning dersom fritekst ikke er fylt ut', () => {
    const fetchPreviewFunction = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      submitFinished={false}
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={fetchPreviewFunction}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);

    const dataFetcher = wrapper.find(DataFetcher);
    const messages = dataFetcher.renderProp('render')({
      brevmaler: templates,
    }).find(Messages);
    const previewCallback = messages.prop('previewCallback') as (params: {}) => void;
    previewCallback({ mottaker: 'Søker', brevmalkode: 'Mal1' });

    expect(fetchPreviewFunction).to.have.property('callCount', 1);
    expect(fetchPreviewFunction.getCall(0).args[2].fritekst).to.equal(' ');
  });

  it('skal resette fritekst ved lukking av modal', () => {
    const resetSubmitMessageFunction = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={resetSubmitMessageFunction}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);
    wrapper.setState({ showMessagesModal: true });

    const closeEvent = wrapper.find(MessagesModalSakIndex).prop('closeEvent') as () => void;
    closeEvent();

    expect(resetSubmitMessageFunction).to.have.property('callCount', 1);

    const state = wrapper.state() as { showMessagesModal: boolean };
    expect(state.showMessagesModal).is.false;
  });

  it('skal sende melding', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);

    const message = {
      mottaker: 'Espen Utvikler',
      brevmalkode: 'testkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const dataFetcher = wrapper.find(DataFetcher);
    const messages = dataFetcher.renderProp('render')({
      brevmaler: templates,
    }).find(Messages);
    const submitCallback = messages.prop('submitCallback') as (params: {}) => void;
    submitCallback(message);

    expect(submitMessageCallback).to.have.property('callCount', 1);
    const { args } = submitMessageCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og ikke sette saken på vent hvis ikke Innhent eller forlenget', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'testbrevkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const dataFetcher = wrapper.find(DataFetcher);
    const messages = dataFetcher.renderProp('render')({
      brevmaler: templates,
    }).find(Messages);

    const submitCallback = messages.prop('submitCallback') as (message) => Promise<any>;
    return submitCallback(message).then(() => {
      const state = wrapper.state() as { showSettPaVentModal: boolean; showMessagesModal: boolean };
      expect(state.showMessagesModal).is.true;
      expect(state.showSettPaVentModal).is.false;
      expect(submitMessageCallback).to.have.property('callCount', 1);
      const { args } = submitMessageCallback.getCalls()[0];
      expect(args).to.have.length(1);
      expect(args[0]).to.eql({
        behandlingId: 1,
        mottaker: message.mottaker,
        brevmalkode: message.brevmalkode,
        fritekst: message.fritekst,
        arsakskode: undefined,
      });
    });
  });

  it('skal sende melding og sette saken på vent hvis INNHENT_DOK', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'INNHEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const dataFetcher = wrapper.find(DataFetcher);
    const messages = dataFetcher.renderProp('render')({
      brevmaler: templates,
    }).find(Messages);

    const submitCallback = messages.prop('submitCallback') as (message) => Promise<any>;
    return submitCallback(message).then(() => {
      const state = wrapper.state() as { showSettPaVentModal: boolean; showMessagesModal: boolean };
      expect(state.showMessagesModal).is.false;
      expect(state.showSettPaVentModal).is.true;
      expect(submitMessageCallback).to.have.property('callCount', 1);
      const { args } = submitMessageCallback.getCalls()[0];
      expect(args).to.have.length(1);
      expect(args[0]).to.eql({
        behandlingId: 1,
        mottaker: message.mottaker,
        brevmalkode: message.brevmalkode,
        fritekst: message.fritekst,
        arsakskode: undefined,
      });
    });
  });

  it('skal sende melding og sette saken på vent hvis FORLEN', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'FORLEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const dataFetcher = wrapper.find(DataFetcher);
    const messages = dataFetcher.renderProp('render')({
      brevmaler: templates,
    }).find(Messages);

    const submitCallback = messages.prop('submitCallback') as (message) => Promise<any>;
    return submitCallback(message).then(() => {
      const state = wrapper.state() as { showSettPaVentModal: boolean; showMessagesModal: boolean };
      expect(state.showMessagesModal).is.false;
      expect(state.showSettPaVentModal).is.true;
      expect(submitMessageCallback).to.have.property('callCount', 1);
      const { args } = submitMessageCallback.getCalls()[0];
      expect(args).to.have.length(1);
      expect(args[0]).to.eql({
        behandlingId: 1,
        mottaker: message.mottaker,
        brevmalkode: message.brevmalkode,
        fritekst: message.fritekst,
        arsakskode: undefined,
      });
    });
  });

  it('skal sende melding og sette saken på vent hvis FORLME', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'FORLME',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const dataFetcher = wrapper.find(DataFetcher);
    const messages = dataFetcher.renderProp('render')({
      brevmaler: templates,
    }).find(Messages);

    const submitCallback = messages.prop('submitCallback') as (message) => Promise<any>;
    return submitCallback(message).then(() => {
      const state = wrapper.state() as { showSettPaVentModal: boolean; showMessagesModal: boolean };
      expect(state.showMessagesModal).is.false;
      expect(state.showSettPaVentModal).is.true;
      expect(submitMessageCallback).to.have.property('callCount', 1);
      const { args } = submitMessageCallback.getCalls()[0];
      expect(args).to.have.length(1);
      expect(args[0]).to.eql({
        behandlingId: 1,
        mottaker: message.mottaker,
        brevmalkode: message.brevmalkode,
        fritekst: message.fritekst,
        arsakskode: undefined,
      });
    });
  });

  it('skal håndtere melding fra modal', () => {
    const setBehandlingOnHoldCallback = sinon.stub().returns(Promise.resolve());
    const pushCallback = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={sprak}
      recipients={recipients}
      fetchPreview={sinon.spy()}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={setBehandlingOnHoldCallback}
      resetSubmitMessage={sinon.spy()}
      push={pushCallback}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingUuid="123"
      behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
      revurderingVarslingArsak={[]}
    />);
    wrapper.setState({ showSettPaVentModal: true });

    const formValues = {
      frist: '2017-10-10',
      ventearsak: 'TEST',
    };
    wrapper.find(MessageBehandlingPaVentModal).prop('onSubmit')(formValues);

    expect(setBehandlingOnHoldCallback).to.have.property('callCount', 1);
    const { args } = setBehandlingOnHoldCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({
      behandlingId: 1,
      behandlingVersjon: 123,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    });

    expect(pushCallback).to.have.property('callCount', 1);
    expect(pushCallback.getCalls()[0].args).to.have.length(1);
    expect(pushCallback.getCalls()[0].args[0]).to.eql('/');

    const state = wrapper.state() as { showSettPaVentModal: boolean };
    expect(state.showSettPaVentModal).is.false;
  });
});
