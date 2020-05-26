import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DataFetchPendingModal } from '@fpsak-frontend/shared-components';

import { FagsakIndex } from './FagsakIndex';
import FagsakResolver from './FagsakResolver';

describe('<FagsakIndex>', () => {
  it('skal rendre FagsakResolver', () => {
    const wrapper = shallow(<FagsakIndex
      harValgtBehandling
      selectedSaksnummer={123}
      alleKodeverk={{}}
      harVerge={false}
    />);

    const fagsakResolver = wrapper.find(FagsakResolver);

    expect(fagsakResolver).to.have.length(1);
  });

  it('skal rendre modal for oppdatering av saksopplysninger', () => {
    const wrapper = shallow(<FagsakIndex selectedSaksnummer={123} harValgtBehandling alleKodeverk={{}} harVerge={false} />);

    expect(wrapper.find(DataFetchPendingModal)).to.have.length(0);

    wrapper.setProps({ requestPendingMessage: 'feilmelding' });

    expect(wrapper.find(DataFetchPendingModal)).to.have.length(1);
  });
});
