import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { HistoryIndex } from './HistoryIndex';

describe('<HistoryIndex>', () => {
  it('skal vise historikk', () => {
    const wrapper = shallow(<HistoryIndex
      history={[]}
      selectedBehandlingId={1}
      saksnummer={12345}
      location={{ pathname: 'test' }}
    />);

    const history = wrapper.find('History');
    expect(history).to.have.length(1);
  });
});
