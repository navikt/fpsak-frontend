
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SakslistePanel from './components/SakslistePanel';
import { BehandlingskoerIndex } from './BehandlingskoerIndex';
import BehandlingPollingTimoutModal from './components/BehandlingPollingTimoutModal';

describe('<BehandlingskoerIndex>', () => {
  const sakslister = [{
    sakslisteId: 1,
    navn: 'test',
    behandlingTyper: [{
      kode: 'test',
      navn: 'test',
    }],
    fagsakYtelseTyper: [{
      kode: 'test',
      navn: 'test',
    }],
    andreKriterier: [{
      andreKriterierType: {
        kode: 'test',
        navn: 'test',
      },
      inkluder: true,
    }],
    sortering: {
      sorteringType: {
        kode: 'test',
        navn: 'test',
      },
      fomDager: 1,
      tomDager: 2,
      fomDato: '2019-01-01',
      tomDato: '2019-01-10',
      erDynamiskPeriode: false,
    },
  }];

  const oppgave = {
    id: 1,
    status: {
      erReservert: false,
    },
    saksnummer: 12343,
    behandlingId: 1,
    personnummer: 1234567891,
    navn: 'Espen Uteligger',
    behandlingstype: {
      kode: 'TEST',
      navn: 'test',
    },
    opprettetTidspunkt: '2018-01-12',
    behandlingsfrist: '2018-01-12',
    fagsakYtelseType: {
      kode: 'TEST',
      navn: 'test',
    },
    erTilSaksbehandling: true,
  };

  it('skal ikke vise behandlingskøer når det ikke finnes sakslister', () => {
    const fetchSakslister = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={sinon.spy()}
      fetchAlleSakslister={fetchSakslister}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      goToUrl={sinon.spy()}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    expect(wrapper.find(SakslistePanel)).to.have.length(0);
    expect(wrapper.find(BehandlingPollingTimoutModal)).to.have.length(0);
    expect(fetchSakslister.calledOnce).to.be.true;
  });

  it('skal hente behandlingskøer ved lasting av komponent og så vise desse korrekt', () => {
    const fetchSakslister = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={sinon.spy()}
      fetchAlleSakslister={fetchSakslister}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      sakslister={sakslister}
      goToUrl={sinon.spy()}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    expect(wrapper.find(SakslistePanel)).to.have.length(1);
    expect(fetchSakslister.calledOnce).to.be.true;
  });

  it('skal reservere og åpne sak i FPSAK når oppgave ikke er reservert fra før', async () => {
    const reserverOppgave = sinon.stub().withArgs(oppgave.id).resolves({
      payload: {
        erReservert: true,
        erReservertAvInnloggetBruker: true,
      },
    });
    const goToUrl = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={sinon.spy()}
      fetchAlleSakslister={sinon.spy()}
      reserverOppgave={reserverOppgave}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      sakslister={sakslister}
      goToUrl={goToUrl}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    const panel = wrapper.find(SakslistePanel);
    expect(panel).to.have.length(1);

    await panel.prop('reserverOppgave')(oppgave);

    expect(reserverOppgave.calledOnce).to.be.true;
    expect(goToUrl.calledOnce).to.be.true;
    const { args } = goToUrl.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql('www.fpsak.no/fagsak/12343/behandling/1/?punkt=default&fakta=default');
  });

  it('skal ikke reservere men kun åpne sak i FPSAK når oppgave allerede er reservert', () => {
    const reserverOppgave = sinon.spy();
    const goToUrl = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={sinon.spy()}
      fetchAlleSakslister={sinon.spy()}
      reserverOppgave={reserverOppgave}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      sakslister={sakslister}
      goToUrl={goToUrl}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    const panel = wrapper.find(SakslistePanel);
    expect(panel).to.have.length(1);

    const reservertOppgave = {
      ...oppgave,
      status: {
        erReservert: true,
        erReservertAvInnloggetBruker: true,
      },
    };
    panel.prop('reserverOppgave')(reservertOppgave);

    expect(reserverOppgave.calledOnce).to.be.false;
    expect(goToUrl.calledOnce).to.be.true;
    const { args } = goToUrl.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql('www.fpsak.no/fagsak/12343/behandling/1/?punkt=default&fakta=default');
  });

  it('skal hente sakslistens oppgaver og så starta polling etter endringer', async () => {
    const sakslisteId = 1;
    const oppgaveIder = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const fetchOppgaverTilBehandlingFn = sinon.stub()
      .withArgs(sakslisteId).resolves({
        payload: oppgaveIder,
      });
    const fetchOppgaverTilBehandlingOppgaverFn = sinon.stub()
      .onFirstCall().resolves({
        payload: oppgaveIder.concat({ id: 4 }),
      })
      .onSecondCall()
      .throws(); // Avbryter polling
    const fetchReserverteOppgaverFn = sinon.spy();

    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={fetchOppgaverTilBehandlingFn}
      fetchReserverteOppgaver={fetchReserverteOppgaverFn}
      fetchAlleSakslister={sinon.spy()}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={fetchOppgaverTilBehandlingOppgaverFn}
      flyttReservasjon={sinon.spy()}
      sakslister={sakslister}
      goToUrl={sinon.spy()}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    const panel = wrapper.find(SakslistePanel);
    expect(panel).to.have.length(1);

    await panel.prop('fetchSakslisteOppgaver')(sakslisteId);

    expect(fetchReserverteOppgaverFn.calledTwice).to.be.true;
    const { args } = fetchReserverteOppgaverFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(sakslisteId);

    expect(fetchOppgaverTilBehandlingOppgaverFn.calledOnce).to.be.true;
    const { args: args2 } = fetchOppgaverTilBehandlingOppgaverFn.getCalls()[0];
    expect(args2).to.have.length(2);
    expect(args2[0]).to.eql(1);
    expect(args2[1]).to.eql(oppgaveIder.map(o => o.id).join(','));
  });

  it('skal oppheve reservasjon og så hente reserverte oppgaver på nytt', async () => {
    const opphevOppgaveReservasjonFn = sinon.stub().withArgs(oppgave.id).resolves();
    const fetchReserverteOppgaverFn = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={fetchReserverteOppgaverFn}
      fetchAlleSakslister={sinon.spy()}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={opphevOppgaveReservasjonFn}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      sakslister={sakslister}
      goToUrl={sinon.spy()}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    const panel = wrapper.find(SakslistePanel);
    expect(panel).to.have.length(1);

    const oppgaveId = 1;
    const begrunnelse = 'Dette er en begrunnelse';
    const sakslisteId = 1;
    wrapper.setState({ sakslisteId });
    await panel.prop('opphevOppgaveReservasjon')(oppgaveId, begrunnelse);

    expect(opphevOppgaveReservasjonFn.calledOnce).to.be.true;
    const { args } = opphevOppgaveReservasjonFn.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql(oppgaveId);
    expect(args[1]).to.eql(begrunnelse);

    expect(fetchReserverteOppgaverFn.calledOnce).to.be.true;
    const { args: args2 } = fetchReserverteOppgaverFn.getCalls()[0];
    expect(args2).to.have.length(1);
    expect(args2[0]).to.eql(sakslisteId);
  });

  it('skal forlenge reservasjon og så hente reserverte oppgaver på nytt', async () => {
    const forlengOppgaveReservasjonFn = sinon.stub().withArgs(oppgave.id).resolves();
    const fetchReserverteOppgaverFn = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={fetchReserverteOppgaverFn}
      fetchAlleSakslister={sinon.spy()}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      sakslister={sakslister}
      goToUrl={sinon.spy()}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    const panel = wrapper.find(SakslistePanel);
    expect(panel).to.have.length(1);

    const oppgaveId = 1;
    const sakslisteId = 1;
    wrapper.setState({ sakslisteId });
    await panel.prop('forlengOppgaveReservasjon')(oppgaveId);

    expect(forlengOppgaveReservasjonFn.calledOnce).to.be.true;
    const { args } = forlengOppgaveReservasjonFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(oppgaveId);

    expect(fetchReserverteOppgaverFn.calledOnce).to.be.true;
    const { args: args2 } = fetchReserverteOppgaverFn.getCalls()[0];
    expect(args2).to.have.length(1);
    expect(args2[0]).to.eql(sakslisteId);
  });

  it('skal flytte reservasjon og så hente reserverte oppgaver på nytt', async () => {
    const flyttReservasjonFn = sinon.stub().withArgs(oppgave.id).resolves();
    const fetchReserverteOppgaverFn = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={fetchReserverteOppgaverFn}
      fetchAlleSakslister={sinon.spy()}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={flyttReservasjonFn}
      sakslister={sakslister}
      goToUrl={sinon.spy()}
      harTimeout={false}
      setValgtSakslisteId={sinon.spy()}
    />);

    const panel = wrapper.find(SakslistePanel);
    expect(panel).to.have.length(1);

    const oppgaveId = 1;
    const brukerIdent = 'T122334';
    const begrunnelse = 'Dette er en begrunnelse';
    const sakslisteId = 1;
    wrapper.setState({ sakslisteId });
    await panel.prop('flyttReservasjon')(oppgaveId, brukerIdent, begrunnelse);

    expect(flyttReservasjonFn.calledOnce).to.be.true;
    const { args } = flyttReservasjonFn.getCalls()[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql(oppgaveId);
    expect(args[1]).to.eql(brukerIdent);
    expect(args[2]).to.eql(begrunnelse);

    expect(fetchReserverteOppgaverFn.calledOnce).to.be.true;
    const { args: args2 } = fetchReserverteOppgaverFn.getCalls()[0];
    expect(args2).to.have.length(1);
    expect(args2[0]).to.eql(sakslisteId);
  });

  it('skal vise dialog ved timeout', () => {
    const fetchSakslister = sinon.spy();
    const wrapper = shallow(<BehandlingskoerIndex
      fpsakUrl="www.fpsak.no"
      fetchOppgaverTilBehandling={sinon.spy()}
      fetchReserverteOppgaver={sinon.spy()}
      fetchAlleSakslister={fetchSakslister}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      fetchOppgaverTilBehandlingOppgaver={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      sakslister={sakslister}
      goToUrl={sinon.spy()}
      harTimeout
      setValgtSakslisteId={sinon.spy()}
    />);

    expect(wrapper.find(BehandlingPollingTimoutModal)).to.have.length(1);
  });
});
