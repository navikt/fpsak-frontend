import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Table from 'sharedComponents/Table';
import FagsakList from './FagsakList';

describe('<FagsakList>', () => {
  const person = {
    navn: 'Frida',
    alder: 44,
    personnummer: '0405198632231',
    erKvinne: true,
  };

  const fagsak = {
    saksnummer: 12345,
    sakstype: {
      navn: 'Engangsstonad',
      kode: 'TEST',
    },
    status: {
      navn: 'Under behandling',
      kode: 'UBEH',
    },
    barnFodt: null,
    opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
    endret: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
    person,
  };

  const headerTextCodes = [
    'FagsakList.Saksnummer',
    'FagsakList.Sakstype',
    'FagsakList.Status',
    'FagsakList.BarnFodt',
  ];

  it('skal vise en tabell med en rad og tilhørende kolonnedata', () => {
    const clickFunction = sinon.spy();
    const wrapper = shallow(<FagsakList fagsaker={[fagsak]} selectFagsakCallback={clickFunction} />);

    const table = wrapper.find(Table);
    expect(table).to.have.length(1);

    expect(table.prop('headerTextCodes')).to.eql(headerTextCodes);

    const tableRows = table.children();
    expect(tableRows).to.have.length(1);
    const tableColumns = tableRows.children();
    expect(tableColumns).to.have.length(4);
    expect(tableColumns.first().childAt(0).text()).to.eql('12345');
    expect(tableColumns.at(1).childAt(0).text()).to.eql('Engangsstonad');
    expect(tableColumns.at(2).childAt(0).text()).to.eql('Under behandling');
    expect(tableColumns.last().childAt(0)).is.empty;
  });

  it('skal sortere søkeresultat der avsluttede skal vises sist, mens sist endrede skal vises først', () => {
    const fagsak2 = {
      saksnummer: 23456,
      sakstype: {
        navn: 'Engangsstonad',
        kode: 'TEST',
      },
      status: {
        navn: 'Under behandling',
        kode: 'UBEH',
      },
      barnFodt: null,
      opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22 ',
      endret: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      person,
    };
    const fagsak3 = {
      saksnummer: 34567,
      sakstype: {
        navn: 'Engangsstonad',
        kode: 'TEST',
      },
      status: {
        navn: 'Avsluttet',
        kode: 'AVSLU',
      },
      barnFodt: null,
      opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      endret: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      person,
    };

    const fagsaker = [fagsak, fagsak2, fagsak3];
    const wrapper = shallow(<FagsakList fagsaker={fagsaker} selectFagsakCallback={() => true} />);

    const table = wrapper.find(Table);
    const tableRows = table.children();
    expect(tableRows).to.have.length(3);

    const tableColumnsRow1 = tableRows.first().children();
    expect(tableColumnsRow1).to.have.length(4);
    expect(tableColumnsRow1.first().childAt(0).text()).to.eql('23456');
    expect(tableColumnsRow1.at(1).childAt(0).text()).to.eql('Engangsstonad');
    expect(tableColumnsRow1.at(2).childAt(0).text()).to.eql('Under behandling');
    expect(tableColumnsRow1.last().childAt(0)).is.empty;

    const tableColumnsRow2 = tableRows.at(1).children();
    expect(tableColumnsRow2).to.have.length(4);
    expect(tableColumnsRow2.first().childAt(0).text()).to.eql('12345');
    expect(tableColumnsRow2.at(1).childAt(0).text()).to.eql('Engangsstonad');
    expect(tableColumnsRow2.at(2).childAt(0).text()).to.eql('Under behandling');
    expect(tableColumnsRow2.last().childAt(0)).is.empty;

    const tableColumnsRow3 = tableRows.last().children();
    expect(tableColumnsRow3).to.have.length(4);
    expect(tableColumnsRow3.first().childAt(0).text()).to.eql('34567');
    expect(tableColumnsRow3.at(1).childAt(0).text()).to.eql('Engangsstonad');
    expect(tableColumnsRow3.at(2).childAt(0).text()).to.eql('Avsluttet');
    expect(tableColumnsRow3.last().childAt(0)).is.empty;
  });

  it('skal vise DateLabel i tabell kun om barn er født', () => {
    const fagsak4 = {
      saksnummer: 23456,
      sakstype: {
        navn: 'Engangsstonad',
        kode: 'TEST',
      },
      status: {
        navn: 'Under behandling',
        kode: 'UBEH',
      },
      barnFodt: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      endret: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
      person,
    };

    const clickFunction = sinon.spy();
    const wrapper = shallow(<FagsakList fagsaker={[fagsak, fagsak4]} selectFagsakCallback={clickFunction} />);

    const table = wrapper.find(Table);
    const tableRows = table.children();
    expect(tableRows).to.have.length(2);

    const tableColumnsRow1 = tableRows.first().children();
    expect(tableColumnsRow1.last().childAt(0).text()).is.eql('<DateLabel />');

    const tableColumnsRow2 = tableRows.last().children();
    expect(tableColumnsRow2.last().childAt(0)).is.empty;
  });
});
