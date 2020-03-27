import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import Table from './Table';
import TableColumn from './TableColumn';
import TableRow from './TableRow';

describe('<Table>', () => {
  const headerTextCodes = [
    'FagsakList.Saksnummer',
    'FagsakList.Sakstype',
  ];

  const formattedHeaderTextCodes = [
    <FormattedMessage id="FagsakList.Saksnummer" />,
    <FormattedMessage id="FagsakList.Sakstype" />,
  ];


  it('skal vise korrekt antall kolonneheadere med korrekt tekst', () => {
    const wrapper = shallow(
      <Table headerTextCodes={headerTextCodes}>
        <TableRow id="1">
          <TableColumn key={1}>{12345}</TableColumn>
          <TableColumn key={2}>{23446}</TableColumn>
        </TableRow>
      </Table>,
    );

    expect(wrapper.find('table')).to.have.length(1);
    const tableHeaderRow = wrapper.find('thead').children();
    expect(tableHeaderRow).to.have.length(1);

    const tableHeaderCols = tableHeaderRow.children();
    expect(tableHeaderCols).to.have.length(2);
    expect(tableHeaderCols.first().childAt(0).prop('id')).to.eql('FagsakList.Saksnummer');
    expect(tableHeaderCols.last().childAt(0).prop('id')).to.eql('FagsakList.Sakstype');
  });

  it('skal vise korrekt antall kolonneheadere med korrekt tekst for formatterte headere', () => {
    const wrapper = shallow(
      <Table headerTextCodes={formattedHeaderTextCodes} allowFormattedHeader>
        <TableRow id="1">
          <TableColumn key={1}>{12345}</TableColumn>
          <TableColumn key={2}>{23446}</TableColumn>
        </TableRow>
      </Table>,
    );

    expect(wrapper.find('table')).to.have.length(1);
    const tableHeaderRow = wrapper.find('thead').children();
    expect(tableHeaderRow).to.have.length(1);

    const tableHeaderCols = tableHeaderRow.children();
    expect(tableHeaderCols).to.have.length(2);
    expect(tableHeaderCols.first().childAt(0).prop('id')).to.eql('FagsakList.Saksnummer');
    expect(tableHeaderCols.last().childAt(0).prop('id')).to.eql('FagsakList.Sakstype');
  });


  it('skal vise korrekt antall rader og kolonner', () => {
    const wrapper = shallow(
      <Table headerTextCodes={headerTextCodes}>
        <TableRow key={1} id="1">
          <TableColumn key={1}>{12345}</TableColumn>
          <TableColumn key={2}>{23446}</TableColumn>
        </TableRow>
        <TableRow key={2} id="2">
          <TableColumn key={3}>{34567}</TableColumn>
          <TableColumn key={4}>{45678}</TableColumn>
        </TableRow>
      </Table>,
    );

    expect(wrapper.find('table')).to.have.length(1);
    const tableBodyRows = wrapper.find('tbody').children();
    expect(tableBodyRows).to.have.length(2);
    const tableBodyRow1 = tableBodyRows.first();
    expect(tableBodyRow1.prop('id')).to.eql('1');
    const tableBodyRow1Cols = tableBodyRow1.children();
    expect(tableBodyRow1Cols).to.have.length(2);
    expect(tableBodyRow1Cols.first().childAt(0).text()).to.eql('12345');
    expect(tableBodyRow1Cols.last().childAt(0).text()).to.eql('23446');

    const tableBodyRow2 = tableBodyRows.last();
    expect(tableBodyRow2.prop('id')).to.eql('2');
    const tableBodyRow2Cols = tableBodyRow2.children();
    expect(tableBodyRow2Cols).to.have.length(2);
    expect(tableBodyRow2Cols.first().childAt(0).text()).to.eql('34567');
    expect(tableBodyRow2Cols.last().childAt(0).text()).to.eql('45678');
  });
});
