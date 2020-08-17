import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { DataFetcher } from '@fpsak-frontend/rest-api-redux';
import { Fagsak } from '@fpsak-frontend/types';

import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';
import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import MessageBehandlingPaVentModal from './MessageBehandlingPaVentModal';
import { MessagesIndex } from './MessagesIndex';

describe('<MessagesIndex>', () => {
  const recipients = ['Søker'];
  const templates = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
  ];
  const sprak = {
    kode: 'NB',
    kodeverk: 'SPRAK',
  };

  const fagsak = {
    saksnummer: 123456,
  };

  const alleBehandlinger = [{
    id: 1,
    uuid: '1212',
    type: {
      kode: BehandlingType.FORSTEGANGSSOKNAD,
      kodeverk: '',
    },
  }];

  const kodeverk = {
    [kodeverkTyper.VENT_AARSAK]: [],
  };

  const templates2 = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
    { kode: 'Mal2', navn: 'Mal 2', tilgjengelig: true },
    { kode: 'Mal3', navn: 'Mal 3', tilgjengelig: true },
  ];

  it('skal vise messages når mottakere og brevmaler har blitt hentet fra server', () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates2);

    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={sinon.spy()}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={sinon.spy()}
    />);

    const index = wrapper.find(MeldingerSakIndex);
    expect(index.prop('recipients')).to.eql(recipients);
    expect(index.prop('templates')).to.eql(templates2);
  });

  it('skal sette default tom streng ved forhåndsvisning dersom fritekst ikke er fylt ut', () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates2);
    requestApi.mock(FpsakApiKeys.PREVIEW_MESSAGE_FORMIDLING, templates2);

    const fetchPreviewFunction = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={sinon.spy()}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={sinon.spy()}
    />);

    const index = wrapper.find(MeldingerSakIndex);
    const previewCallback = index.prop('previewCallback') as (params: any) => void;
    previewCallback({ mottaker: 'Søker', brevmalkode: 'Mal1' });

    expect(fetchPreviewFunction).to.have.property('callCount', 1);
    expect(fetchPreviewFunction.getCall(0).args[2].fritekst).to.equal(' ');
  });

  it('skal resette fritekst ved lukking av modal', () => {
    const resetSubmitMessageFunction = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      submitFinished
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
    }, true).find(Messages);
    const submitCallback = messages.prop('submitCallback') as (params: any) => void;
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
    }, true).find(Messages);

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
    }, true).find(Messages);

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
    }, true).find(Messages);

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
    }, true).find(Messages);

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
