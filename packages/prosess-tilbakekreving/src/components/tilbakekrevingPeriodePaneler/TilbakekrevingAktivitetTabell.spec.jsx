import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';

import TilbakekrevingAktivitetTabell from './TilbakekrevingAktivitetTabell';

describe('<TilbakekrevingAktivitetTabell>', () => {
  it('skal ikke vise tabell når ytelselisten er tom', () => {
    const wrapper = shallow(<TilbakekrevingAktivitetTabell
      ytelser={[]}
    />);

    expect(wrapper.find(Table)).to.have.length(0);
  });

  it('skal vise tabell med to rader når det finnes to ytelser', () => {
    const wrapper = shallow(<TilbakekrevingAktivitetTabell
      ytelser={[{
        aktivitet: 'test',
        belop: 1,
      }, {
        aktivitet: 'test2',
        belop: 2,
      }]}
    />);

    const table = wrapper.find(Table);
    expect(table).to.have.length(1);

    const tableRow = wrapper.find(TableRow);
    expect(tableRow).to.have.length(2);

    const tableCol1 = tableRow.first().find(TableColumn);
    expect(tableCol1).to.have.length(2);
    expect(tableCol1.first().childAt(0).childAt(0).text()).to.eql('test');
    expect(tableCol1.last().childAt(0).childAt(0).text()).to.eql('1');
    const tableCol2 = tableRow.last().find(TableColumn);
    expect(tableCol2).to.have.length(2);
    expect(tableCol2.first().childAt(0).childAt(0).text()).to.eql('test2');
    expect(tableCol2.last().childAt(0).childAt(0).text()).to.eql('2');
  });
});
