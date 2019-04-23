
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import { FormattedHTMLMessage } from 'react-intl';

import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import OppgaveHandlingerMenu from './OppgaveHandlingerMenu';
import OpphevReservasjonModal from './OpphevReservasjonModal';
import OppgaveReservasjonForlengetModal from './OppgaveReservasjonForlengetModal';
import FlyttReservasjonModal from './FlyttReservasjonModal';
import MenuButton from './MenuButton';

describe('<OppgaveHandlingerMenu>', () => {
  const oppgave = {
    id: 1,
    status: {
      erReservert: false,
      reservertTilTidspunkt: moment().add(2, 'hours').format(),
    },
    saksnummer: 1,
    behandlingId: 2,
    personnummer: '1234567',
    navn: 'Espen Utvikler',
    behandlingstype: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
    },
    opprettetTidspunkt: '2017-01-01',
    behandlingsfrist: '2017-01-01',
    erTilSaksbehandling: true,
    fagsakYtelseType: {
      kode: fagsakYtelseType.FORELDREPRENGER,
      navn: 'FP',
    },
    behandlingStatus: {
      kode: behandlingStatus.OPPRETTET,
      navn: '',
    },
  };

  it('skal rendre meny med to knapper og vise tiden som står igjen av reservasjonen', () => {
    const wrapper = shallow(
      <OppgaveHandlingerMenu
        toggleMenu={sinon.spy()}
        offset={{
          top: 10,
          left: 20,
        }}
        oppgave={oppgave}
        imageNode={<div />}
        opphevOppgaveReservasjon={sinon.spy()}
        forlengOppgaveReservasjon={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        flyttReservasjon={sinon.spy()}
      />,
    );

    expect(wrapper.find(MenuButton)).has.length(3);
    const message = wrapper.find(FormattedHTMLMessage).first();
    expect(message.prop('values')).is.eql({ hours: 1, minutes: 59 });
  });

  it('skal vise modal for oppheving av reservasjon ved klikk på menyknapp og så lukke den ved å avbryte i modal', () => {
    const wrapper = shallow(
      <OppgaveHandlingerMenu
        toggleMenu={sinon.spy()}
        offset={{
          top: 10,
          left: 20,
        }}
        oppgave={oppgave}
        imageNode={<div />}
        opphevOppgaveReservasjon={sinon.spy()}
        forlengOppgaveReservasjon={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        flyttReservasjon={sinon.spy()}
      />,
    );
    expect(wrapper.find(OpphevReservasjonModal)).has.length(0);

    const menuButton = wrapper.find(MenuButton).first();
    menuButton.prop('onClick')();

    const modal = wrapper.find(OpphevReservasjonModal);
    expect(modal).has.length(1);

    modal.prop('cancel')();

    expect(wrapper.find(OpphevReservasjonModal)).has.length(0);
  });

  it('skal vise modal for oppheving av reservasjon og så bekrefte oppheving ved å oppgi begrunnelse', () => {
    const toggleMenuFn = sinon.spy();
    const opphevOppgaveReservasjonFn = sinon.spy();
    const wrapper = shallow(
      <OppgaveHandlingerMenu
        toggleMenu={toggleMenuFn}
        offset={{
          top: 10,
          left: 20,
        }}
        oppgave={oppgave}
        imageNode={<div />}
        opphevOppgaveReservasjon={opphevOppgaveReservasjonFn}
        forlengOppgaveReservasjon={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        flyttReservasjon={sinon.spy()}
      />,
    );

    const menuButton = wrapper.find(MenuButton).first();
    menuButton.prop('onClick')();

    const modal = wrapper.find(OpphevReservasjonModal);
    expect(modal).has.length(1);

    modal.prop('submit')(1, 'Dette er en begrunnelse');

    expect(opphevOppgaveReservasjonFn.calledOnce).to.be.true;
    const { args } = opphevOppgaveReservasjonFn.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql(1);
    expect(args[1]).to.eql('Dette er en begrunnelse');

    expect(toggleMenuFn.calledOnce).to.be.true;
    const { args: toggleArgs } = toggleMenuFn.getCalls()[0];
    expect(toggleArgs).to.have.length(1);
    expect(toggleArgs[0]).to.eql(oppgave);
  });

  it('skal vise modal for forlenging av reservasjon', async () => {
    const forlengOppgaveReservasjonFn = oppgaveId => Promise.resolve(`${oppgaveId}`);
    const wrapper = shallow(
      <OppgaveHandlingerMenu
        toggleMenu={sinon.spy()}
        offset={{
          top: 10,
          left: 20,
        }}
        oppgave={oppgave}
        imageNode={<div />}
        opphevOppgaveReservasjon={sinon.spy()}
        forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        flyttReservasjon={sinon.spy()}
      />,
    );

    const menuButton = wrapper.find(MenuButton).at(1);
    await menuButton.prop('onClick')();

    const modal = wrapper.find(OppgaveReservasjonForlengetModal);
    expect(modal).has.length(1);
  });

  it('skal vise modal for flytting av reservasjon', () => {
    const wrapper = shallow(
      <OppgaveHandlingerMenu
        toggleMenu={sinon.spy()}
        offset={{
          top: 10,
          left: 20,
        }}
        oppgave={oppgave}
        imageNode={<div />}
        opphevOppgaveReservasjon={sinon.spy()}
        forlengOppgaveReservasjon={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        flyttReservasjon={sinon.spy()}
      />,
    );

    const menuButton = wrapper.find(MenuButton).last();
    menuButton.prop('onClick')();

    expect(wrapper.find(FlyttReservasjonModal)).has.length(1);
  });

  it('skal flytte reservasjon og så lukke modal', () => {
    const flyttReservasjonFn = sinon.spy();
    const wrapper = shallow(
      <OppgaveHandlingerMenu
        toggleMenu={sinon.spy()}
        offset={{
          top: 10,
          left: 20,
        }}
        oppgave={oppgave}
        imageNode={<div />}
        opphevOppgaveReservasjon={sinon.spy()}
        forlengOppgaveReservasjon={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        flyttReservasjon={flyttReservasjonFn}
      />,
    );

    wrapper.setState({ showFlyttReservasjonModal: true });

    const modal = wrapper.find(FlyttReservasjonModal);

    const oppgaveId = 1;
    const brukerident = 'P039283';
    const begrunnelse = 'Dette er en begrunnelse';
    modal.prop('submit')(oppgaveId, brukerident, begrunnelse);

    expect(flyttReservasjonFn.calledOnce).to.be.true;
    const { args } = flyttReservasjonFn.getCalls()[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql(1);
    expect(args[1]).to.eql('P039283');
    expect(args[2]).to.eql('Dette er en begrunnelse');
  });
});
