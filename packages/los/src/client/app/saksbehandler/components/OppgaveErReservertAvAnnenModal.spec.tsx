
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

import Modal from 'sharedComponents/Modal';
import { getDateAndTime } from 'utils/dateUtils';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import { OppgaveErReservertAvAnnenModal } from './OppgaveErReservertAvAnnenModal';

describe('<OppgaveErReservertAvAnnenModal>', () => {
  const dato = moment().add(2, 'hours').format();
  const oppgave = {
    id: 1,
    status: {
      erReservert: false,
      reservertTilTidspunkt: dato,
      reservertAvNavn: 'Espen Utvikler',
      reservertAvUid: '123455',
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

  it('skal vise modal med reservasjonsdata', () => {
    const wrapper = shallowWithIntl(
      <OppgaveErReservertAvAnnenModal
        intl={intlMock}
        lukkErReservertModalOgOpneOppgave={sinon.spy()}
        oppgave={oppgave}
        oppgaveStatus={oppgave.status}
      />,
    );

    expect(wrapper.find(Modal)).has.length(1);
    const fmessage = wrapper.find(FormattedMessage);
    expect(fmessage).has.length(1);
    const dagOgTidspunkt = getDateAndTime(dato);
    expect(fmessage.prop('values')).is.eql({
      date: dagOgTidspunkt.date,
      time: dagOgTidspunkt.time,
      saksbehandlerid: '123455',
      saksbehandlernavn: 'Espen Utvikler',
    });
  });

  it('skal lukke modal og åpne oppgave ved trykk på knapp', () => {
    const lukkOgApneFn = sinon.spy();
    const wrapper = shallowWithIntl(
      <OppgaveErReservertAvAnnenModal
        intl={intlMock}
        lukkErReservertModalOgOpneOppgave={lukkOgApneFn}
        oppgave={oppgave}
        oppgaveStatus={oppgave.status}
      />,
    );

    const knapp = wrapper.find(Hovedknapp);
    expect(knapp).has.length(1);

    knapp.prop('onClick')();

    expect(lukkOgApneFn.calledOnce).to.be.true;
    const { args } = lukkOgApneFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(oppgave);
  });
});
