import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import TableRow from './TableRow';
import TableColumn from './TableColumn';

describe('<TableRow>', () => {
  it('skal lage en rad og rendre children inne denne', () => {
    const mouseEventFunction = sinon.spy();
    const keyEventFunction = sinon.spy();
    const wrapper = shallow(
      <TableRow
        id={1}
        onMouseDown={mouseEventFunction}
        onKeyDown={keyEventFunction}
      >
        <TableColumn>{1}</TableColumn>
      </TableRow>,
    );

    expect(wrapper.find('tr')).to.have.length(1);
    const col = wrapper.find('TableColumn');
    expect(col).to.have.length(1);
    expect(col.childAt(0).text()).to.eql('1');
  });

  it('skal trigge events ved museklikk og tasteklikk', () => {
    const mouseEventFunction = sinon.spy();
    const keyEventFunction = sinon.spy();
    const wrapper = shallow(
      <TableRow
        id={1}
        onMouseDown={mouseEventFunction}
        onKeyDown={keyEventFunction}
      >
        <TableColumn>{1}</TableColumn>
      </TableRow>,
    );

    const row = wrapper.find('tr');
    row.simulate('mouseDown');
    expect(mouseEventFunction).to.have.property('callCount', 1);
    expect(keyEventFunction).to.have.property('callCount', 0);

    row.simulate('keyDown', { target: { tagName: 'TR' }, key: 'Enter', preventDefault: sinon.spy() });
    expect(keyEventFunction).to.have.property('callCount', 1);
    expect(mouseEventFunction).to.have.property('callCount', 1);
  });
});
