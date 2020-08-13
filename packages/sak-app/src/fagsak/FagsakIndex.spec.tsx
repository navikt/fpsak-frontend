import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DataFetchPendingModal } from '@fpsak-frontend/shared-components';

import { FagsakIndex } from './FagsakIndex';

describe('<FagsakIndex>', () => {
  const location = {
    pathname: '', search: '', state: {}, hash: '',
  };

  it('skal rendre modal for oppdatering av saksopplysninger', () => {
    const wrapper = shallow(<FagsakIndex selectedSaksnummer={123} alleKodeverk={{}} harVerge={false} location={location} />);

    expect(wrapper.find(DataFetchPendingModal)).to.have.length(0);

    wrapper.setProps({ requestPendingMessage: 'feilmelding' });

    expect(wrapper.find(DataFetchPendingModal)).to.have.length(1);
  });
});
