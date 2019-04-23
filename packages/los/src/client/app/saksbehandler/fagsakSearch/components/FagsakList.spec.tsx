
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Table from 'sharedComponents/Table';
import { FagsakList, getSorterteFagsaker } from './FagsakList';

describe('<FagsakList>', () => {
  const person = {
    navn: 'Frida',
    alder: 44,
    personnummer: '0405198632231',
    erKvinne: true,
    erDod: false,
  };

  const fagsak = {
    saksnummer: 12345,
    sakstype: {
      navn: '',
      kode: 'ES',
    },
    status: {
      navn: '',
      kode: 'UBEH',
    },
    barnFodt: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
    opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
    endret: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
    person,
  };

  const fagsakStatusTyper = [{
    navn: 'Under behandling',
    kode: 'UBEH',
  }, {
    navn: 'Avsluttet',
    kode: 'AVSLU',
  }];
  const fagsakYtelseTyper = [{
    navn: 'Engangsstonad',
    kode: 'ES',
  }, {
    navn: 'Engangsstonad',
    kode: 'TEST',
  }];

  const headerTextCodes = [
    'FagsakList.Saksnummer',
    'FagsakList.Stonadstype',
    'FagsakList.Behandlingstype',
    'FagsakList.Status',
    'FagsakList.BarnFodt',
    'EMPTY_1',
  ];

  it('skal vise en tabell med en rad og tilhørende kolonnedata', () => {
    const clickFunction = sinon.spy();
    const wrapper = shallow(
      <FagsakList
        sorterteFagsaker={[fagsak]}
        fagsakOppgaver={[]}
        selectFagsakCallback={clickFunction}
        selectOppgaveCallback={sinon.spy()}
        fagsakStatusTyper={fagsakStatusTyper}
        fagsakYtelseTyper={fagsakYtelseTyper}
      />,
    );

    const table = wrapper.find(Table);
    expect(table).to.have.length(1);

    expect(table.prop('headerTextCodes')).to.eql(headerTextCodes);

    const tableRows = table.children();
    expect(tableRows).to.have.length(1);
    const tableColumns = tableRows.children();
    expect(tableColumns).to.have.length(6);
    expect(tableColumns.first().childAt(0).text()).to.eql('12345');
    expect(tableColumns.at(1).childAt(0).text()).to.eql('Engangsstonad');
    expect(tableColumns.at(3).childAt(0).text()).to.eql('Under behandling');
    expect(tableColumns.at(4).childAt(0)).is.empty;
  });

  it('skal sortere søkeresultat der avsluttede skal vises sist, mens sist endrede skal vises først', () => {
    const fagsak2 = {
      saksnummer: 23456,
      sakstype: {
        navn: '',
        kode: 'TEST',
      },
      status: {
        navn: '',
        kode: 'UBEH',
      },
      opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22 ',
      endret: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      person,
      oppgaver: [],
    };
    const fagsak3 = {
      saksnummer: 34567,
      sakstype: {
        navn: '',
        kode: 'TEST',
      },
      status: {
        navn: '',
        kode: 'AVSLU',
      },
      opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      endret: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      person,
    };

    const fagsaker = [fagsak, fagsak2, fagsak3];

    const sorterteFagsaker = getSorterteFagsaker.resultFunc(fagsaker);

    expect(sorterteFagsaker).to.have.length(3);
    expect(sorterteFagsaker[0].saksnummer).to.eql(23456);
    expect(sorterteFagsaker[1].saksnummer).to.eql(12345);
    expect(sorterteFagsaker[2].saksnummer).to.eql(34567);
  });

  it('skal vise DateLabel i tabell kun om barn er født', () => {
    const fagsak4 = {
      saksnummer: 23456,
      sakstype: {
        navn: '',
        kode: 'TEST',
      },
      status: {
        navn: '',
        kode: 'UBEH',
      },
      barnFodt: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      endret: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      person,
    };

    const clickFunction = sinon.spy();
    const wrapper = shallow(
      <FagsakList
        sorterteFagsaker={[fagsak, fagsak4]}
        selectOppgaveCallback={sinon.spy()}
        selectFagsakCallback={clickFunction}
        fagsakStatusTyper={fagsakStatusTyper}
        fagsakYtelseTyper={fagsakYtelseTyper}
        fagsakOppgaver={[]}
      />,
    );

    const table = wrapper.find(Table);
    const tableRows = table.children();
    expect(tableRows).to.have.length(2);
    const tableColumnsRow1 = tableRows.first().children();
    expect(tableColumnsRow1.at(4).childAt(0).text()).is.eql('<DateLabel />');

    const tableColumnsRow2 = tableRows.last().children();
    expect(tableColumnsRow2.at(4).childAt(0)).is.empty;
  });
});
