import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import MenuButton from './MenuButton';

describe('<MenuButton>', () => {
  it('skal rendre meny-knapp', () => {
    const onClick = sinon.spy();

    const wrapper = shallow(
      <MenuButton
        onClick={onClick}
        disabled={false}
      >
        <div>test</div>
      </MenuButton>,
    );

    const menuButton = wrapper.find('Knapp');
    expect(menuButton).has.length(1);
    expect(menuButton.prop('onClick')).is.eql(onClick);
    expect(menuButton.prop('disabled')).is.false;
    expect(menuButton.prop('children')).is.eql(<div>test</div>);
  });
});
