
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import sinon from 'sinon';
import NavFrontendChevron from 'nav-frontend-chevron';

import behandlingType from 'kodeverk/behandlingType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import DateLabel from 'sharedComponents/DateLabel';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import Image from 'sharedComponents/Image';
import { OppgaverTabell } from './OppgaverTabell';

describe('<OppgaverTabell>', () => {
  it('skal vise kriterievelger og liste over neste oppgaver', () => {
    const oppgaverTilBehandling = [{
      id: 1,
      status: {
        erReservert: false,
      },
      saksnummer: 1,
      behandlingId: 2,
      personnummer: '123456789',
      navn: 'Espen Utvikler',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad',
      },
      opprettetTidspunkt: '2019-01-02',
      behandlingsfrist: '2019-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPRENGER,
        navn: 'FP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }, {
      id: 2,
      status: {
        erReservert: false,
      },
      saksnummer: 2,
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad far',
      },
      opprettetTidspunkt: '2018-01-02',
      behandlingsfrist: '2018-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPRENGER,
        navn: 'FP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];

    const wrapper = shallow(<OppgaverTabell
      reserverteOppgaver={[]}
      oppgaverTilBehandling={oppgaverTilBehandling}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      finnSaksbehandler={sinon.spy()}
      resetSaksbehandler={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      antall={1}
    />);

    const tableRows = wrapper.find(TableRow);
    expect(tableRows).has.length(2);

    const columnsRow1 = tableRows.first().find(TableColumn);
    expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Utvikler 123456789');
    expect(columnsRow1.at(1).childAt(0).text()).is.eql('Førstegangssøknad');
    expect(columnsRow1.at(2).find(DateLabel).prop('dateString')).is.eql('2019-01-02');
    expect(columnsRow1.at(3).find(DateLabel).prop('dateString')).is.eql('2019-03-03');

    const columnsRow2 = tableRows.last().find(TableColumn);
    expect(columnsRow2.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
    expect(columnsRow2.at(1).childAt(0).text()).is.eql('Førstegangssøknad far');
    expect(columnsRow2.at(2).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
    expect(columnsRow2.at(3).find(DateLabel).prop('dateString')).is.eql('2018-03-03');

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(1);
    expect(message.prop('id')).is.eql('OppgaverTabell.DineNesteSaker');
  });

  it('skal vise de behandlingene som fremdeles er valgt av saksbehandler først i listen samt et menyikon for disse', () => {
    const oppgaverTilBehandling = [{
      id: 1,
      status: {
        erReservert: false,
      },
      saksnummer: 1,
      behandlingId: 2,
      personnummer: '123456789',
      navn: 'Espen Utvikler',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad',
      },
      opprettetTidspunkt: '2019-01-02',
      behandlingsfrist: '2019-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPRENGER,
        navn: 'FP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];
    const reserverteOppgaver = [{
      id: 2,
      status: {
        erReservert: true,
      },
      saksnummer: 2,
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad far',
      },
      opprettetTidspunkt: '2018-01-02',
      behandlingsfrist: '2018-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPRENGER,
        navn: 'FP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];

    const wrapper = shallow(<OppgaverTabell
      reserverteOppgaver={reserverteOppgaver}
      oppgaverTilBehandling={oppgaverTilBehandling}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      finnSaksbehandler={sinon.spy()}
      resetSaksbehandler={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      antall={1}
    />);

    const tableRows = wrapper.find(TableRow);
    expect(tableRows).has.length(2);

    const columnsRow1 = tableRows.first().find(TableColumn);
    expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
    expect(columnsRow1.at(1).childAt(0).text()).is.eql('Førstegangssøknad far');
    expect(columnsRow1.at(2).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
    expect(columnsRow1.at(3).find(DateLabel).prop('dateString')).is.eql('2018-03-03');
    expect(columnsRow1.at(4).find(Image)).has.length(0);
    expect(columnsRow1.at(5).find(Image)).has.length(1);

    const columnsRow2 = tableRows.last().find(TableColumn);
    expect(columnsRow2.first().childAt(0).text()).is.eql('Espen Utvikler 123456789');
    expect(columnsRow2.at(1).childAt(0).text()).is.eql('Førstegangssøknad');
    expect(columnsRow2.at(2).find(DateLabel).prop('dateString')).is.eql('2019-01-02');
    expect(columnsRow2.at(3).find(DateLabel).prop('dateString')).is.eql('2019-03-03');
    expect(columnsRow2.at(4).find(Image)).has.length(0);
    expect(columnsRow2.at(5).find(NavFrontendChevron)).has.length(1);
  });

  it('skal ikke vise liste når en ikke har oppgaver', () => {
    const reserverteOppgaver = [];
    const wrapper = shallow(<OppgaverTabell
      oppgaverTilBehandling={reserverteOppgaver}
      reserverteOppgaver={reserverteOppgaver}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      finnSaksbehandler={sinon.spy()}
      resetSaksbehandler={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      antall={1}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(2);
    expect(message.first().prop('id')).is.eql('OppgaverTabell.DineNesteSaker');
    expect(message.last().prop('id')).is.eql('OppgaverTabell.IngenOppgaver');

    expect(wrapper.find(TableRow)).has.length(0);
  });

  it('skal vise tooltip for reserverte oppgaver som er flyttet', () => {
    const reserverteOppgaver = [{
      id: 2,
      status: {
        erReservert: true,
        flyttetReservasjon: {
          tidspunkt: '2018-01-02',
          uid: '1234556',
          navn: 'Auto Joachim',
          begrunnelse: 'Har flytta til deg',
        },
      },
      saksnummer: 2,
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      behandlingstype: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'Førstegangssøknad far',
      },
      opprettetTidspunkt: '2018-01-02',
      behandlingsfrist: '2018-03-03',
      erTilSaksbehandling: true,
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPRENGER,
        navn: 'FP',
      },
      behandlingStatus: {
        kode: behandlingStatus.OPPRETTET,
        navn: '',
      },
    }];

    const wrapper = shallow(<OppgaverTabell
      reserverteOppgaver={reserverteOppgaver}
      oppgaverTilBehandling={[]}
      reserverOppgave={sinon.spy()}
      opphevOppgaveReservasjon={sinon.spy()}
      forlengOppgaveReservasjon={sinon.spy()}
      finnSaksbehandler={sinon.spy()}
      resetSaksbehandler={sinon.spy()}
      flyttReservasjon={sinon.spy()}
      antall={1}
    />);

    const tableRows = wrapper.find(TableRow);
    expect(tableRows).has.length(1);

    const columnsRow1 = tableRows.first().find(TableColumn);
    expect(columnsRow1.first().childAt(0).text()).is.eql('Espen Solstråle 657643535');
    expect(columnsRow1.at(1).childAt(0).text()).is.eql('Førstegangssøknad far');
    expect(columnsRow1.at(2).find(DateLabel).prop('dateString')).is.eql('2018-01-02');
    expect(columnsRow1.at(3).find(DateLabel).prop('dateString')).is.eql('2018-03-03');
    expect(columnsRow1.at(4).find(Image)).has.length(1);
    expect(columnsRow1.at(5).find(Image)).has.length(1);

    const tooltip = columnsRow1.at(4).find(Image).prop('tooltip');
    expect(tooltip.header.props.children.props.values).is.eql({
      dato: '02.01.2018',
      tid: '00:00',
      uid: '1234556',
      navn: 'Auto Joachim',
      beskrivelse: 'Har flytta til deg',
    });
  });
});
