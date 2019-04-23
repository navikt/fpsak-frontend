
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Undertekst } from 'nav-frontend-typografi';

import MenuButton from './MenuButton';

describe('<MenuButton>', () => {
  it('skal rendre meny-knapp', () => {
    const onClick = sinon.spy();

    const wrapper = shallow(
      <MenuButton
        onClick={onClick}
      >
        <div>test</div>
      </MenuButton>,
    );

    const menuButton = wrapper.find('button');
    expect(menuButton).has.length(1);
    expect(menuButton.prop('onClick')).is.eql(onClick);
    expect(menuButton.find(Undertekst).prop('children')).is.eql(<div>test</div>);
  });
});
