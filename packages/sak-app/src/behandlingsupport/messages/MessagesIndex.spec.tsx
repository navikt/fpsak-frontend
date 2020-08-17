import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Fagsak } from '@fpsak-frontend/types';

import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';
import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import MessageBehandlingPaVentModal from './MessageBehandlingPaVentModal';
import { MessagesIndex } from './MessagesIndex';

describe('<MessagesIndex>', () => {
  const recipients = ['Søker'];

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

  const templates = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
    { kode: 'Mal2', navn: 'Mal 2', tilgjengelig: true },
    { kode: 'Mal3', navn: 'Mal 3', tilgjengelig: true },
  ];

  it('skal vise messages når mottakere og brevmaler har blitt hentet fra server', () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);

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
    expect(index.prop('templates')).to.eql(templates);
  });

  it('skal sette default tom streng ved forhåndsvisning dersom fritekst ikke er fylt ut', () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);
    requestApi.mock(FpsakApiKeys.PREVIEW_MESSAGE_FORMIDLING, {});

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

    const reqData = requestApi.getRequestMockData(FpsakApiKeys.PREVIEW_MESSAGE_FORMIDLING);
    expect(reqData).to.have.length(1);
    expect(reqData[0].params.fritekst).to.equal(' ');
  });

  it('skal lukke av modal', async () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);
    requestApi.mock(FpsakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={sinon.spy()}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={sinon.spy()}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'testbrevkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (message) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(0);

    await submitCallback(message);

    const modal = wrapper.find(MessagesModalSakIndex);
    expect(modal).to.have.length(1);

    const closeEvent = modal.prop('closeEvent') as () => void;
    closeEvent();

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(0);
  });

  it('skal sende melding', async () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);
    requestApi.mock(FpsakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={sinon.spy()}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={sinon.spy()}
    />);

    const message = {
      mottaker: 'Espen Utvikler',
      brevmalkode: 'testkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (params: any) => void;
    await submitCallback(message);

    const reqData = requestApi.getRequestMockData(FpsakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).to.have.length(1);
    expect(reqData[0].params).is.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og ikke sette saken på vent hvis ikke Innhent eller forlenget', async () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);
    requestApi.mock(FpsakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={sinon.spy()}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={sinon.spy()}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'testbrevkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (message) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(0);
    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(0);

    await submitCallback(message);

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(1);
    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(0);

    const reqData = requestApi.getRequestMockData(FpsakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).to.have.length(1);
    expect(reqData[0].params).is.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og sette saken på vent hvis INNHENT_DOK', async () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);
    requestApi.mock(FpsakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={sinon.spy()}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={sinon.spy()}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'INNHEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (message) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(0);
    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(0);

    await submitCallback(message);

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(0);
    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(1);

    const reqData = requestApi.getRequestMockData(FpsakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).to.have.length(1);
    expect(reqData[0].params).is.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og sette saken på vent hvis FORLEN', async () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);
    requestApi.mock(FpsakApiKeys.SUBMIT_MESSAGE);

    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={sinon.spy()}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={sinon.spy()}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'FORLEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (message) => Promise<any>;

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(0);
    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(0);

    await submitCallback(message);

    expect(wrapper.find(MessagesModalSakIndex)).to.have.length(0);
    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(1);

    const reqData = requestApi.getRequestMockData(FpsakApiKeys.SUBMIT_MESSAGE);
    expect(reqData).to.have.length(1);
    expect(reqData[0].params).is.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal håndtere melding fra modal', async () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, true);
    requestApi.mock(FpsakApiKeys.BREVMALER, templates);
    requestApi.mock(FpsakApiKeys.SUBMIT_MESSAGE);

    const setBehandlingOnHoldCallback = sinon.spy();
    const pushCallback = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      fagsak={fagsak as Fagsak}
      alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
      selectedBehandlingId={1}
      push={pushCallback}
      selectedBehandlingVersjon={123}
      setBehandlingOnHold={setBehandlingOnHoldCallback}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'FORLEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    const index = wrapper.find(MeldingerSakIndex);
    const submitCallback = index.prop('submitCallback') as (message) => Promise<any>;

    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(0);
    await submitCallback(message);
    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(1);

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

    expect(wrapper.find(MessageBehandlingPaVentModal)).to.have.length(0);
  });
});
