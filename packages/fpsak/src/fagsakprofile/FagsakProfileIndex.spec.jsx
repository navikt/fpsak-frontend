import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import fagsakStatus from 'kodeverk/fagsakStatus';
import FagsakProfile from './components/FagsakProfile';
import { FagsakProfileIndex } from './FagsakProfileIndex';


describe('<FagsakProfileIndex>', () => {
  it('skal rendre komponent og vise alle behandlinger når ingen behandling er valgt', () => {
    const showAllCallback = sinon.spy();
    const wrapper = shallow(<FagsakProfileIndex
      saksnummer={123}
      sakstype={{ kode: fagsakYtelseType.FORELDREPENGER }}
      fagsakStatus={{ kode: fagsakStatus.OPPRETTET }}
      behandlinger={[]}
      noExistingBehandlinger
      showAll={false}
      toggleShowAll={showAllCallback}
      reset={sinon.spy()}
    />);

    expect(wrapper.find(FagsakProfile)).has.length(1);
    expect(showAllCallback.getCalls()).has.length(1);
  });

  it('skal ikke slå på visning av alle behandlinger når behandling allerede er valgt', () => {
    const showAllCallback = sinon.spy();
    shallow(<FagsakProfileIndex
      saksnummer={123}
      sakstype={{ kode: fagsakYtelseType.FORELDREPENGER }}
      fagsakStatus={{ kode: fagsakStatus.OPPRETTET }}
      selectedBehandlingId={1}
      behandlinger={[]}
      noExistingBehandlinger
      showAll
      toggleShowAll={showAllCallback}
      reset={sinon.spy()}
    />);

    expect(showAllCallback.getCalls()).has.length(0);
  });

  it('skal resette visning av alle behandlinger når komponent blir fjernet', () => {
    const resetCallback = sinon.spy();
    const wrapper = shallow(<FagsakProfileIndex
      saksnummer={123}
      sakstype={{ kode: fagsakYtelseType.FORELDREPENGER }}
      fagsakStatus={{ kode: fagsakStatus.OPPRETTET }}
      selectedBehandlingId={1}
      behandlinger={[]}
      noExistingBehandlinger
      showAll
      toggleShowAll={sinon.spy()}
      reset={resetCallback}
    />);

    wrapper.unmount();

    expect(resetCallback.getCalls()).has.length(1);
  });
});
