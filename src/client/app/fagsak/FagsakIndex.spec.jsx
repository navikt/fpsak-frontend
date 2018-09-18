import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DataFetchPendingModal from './components/DataFetchPendingModal';
import { FagsakIndex } from './FagsakIndex';
import FagsakResolver from './FagsakResolver';

describe('<FagsakIndex>', () => {
  it('skal rendre FagsakResolver', () => {
    const wrapper = shallow(<FagsakIndex selectedSaksnummer={123} requestPendingMessages={[]} />);

    const fagsakResolver = wrapper.find(FagsakResolver);

    expect(fagsakResolver).to.have.length(1);
  });

  it('skal rendre modal for oppdatering av saksopplysninger', () => {
    const wrapper = shallow(<FagsakIndex selectedSaksnummer={123} requestPendingMessages={[]} />);

    expect(wrapper.find(DataFetchPendingModal)).to.have.length(0);

    wrapper.setProps({ requestPendingMessages: ['feilmelding'] });

    expect(wrapper.find(DataFetchPendingModal)).to.have.length(1);
  });
});
