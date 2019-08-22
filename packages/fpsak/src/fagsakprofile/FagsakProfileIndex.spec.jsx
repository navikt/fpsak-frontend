import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import RisikoklassfiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';
import FagsakProfile from './components/FagsakProfile';
import { FagsakProfileIndex, getSelectedBehandling } from './FagsakProfileIndex';

const lagBehandlingAvType = kode => ({
    type: {
      kode,
    },
});


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
      selectedBehandling={lagBehandlingAvType('BT-004')}
    />);
    expect(wrapper.find(RisikoklassfiseringIndex)).has.length(0);
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
      selectedBehandling={lagBehandlingAvType('BT-004')}
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
      selectedBehandling={lagBehandlingAvType('BT-004')}
    />);
    expect(wrapper.find(RisikoklassfiseringIndex)).has.length(0);
    wrapper.unmount();

    expect(resetCallback.getCalls()).has.length(1);
  });

  it('skal teste at risikoklassifisering vises hvis den er tilgjengelig', () => {
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
      selectedBehandling={lagBehandlingAvType('BT-002')}
    />);
    expect(wrapper.find(RisikoklassfiseringIndex)).has.length(1);
    wrapper.unmount();

    expect(resetCallback.getCalls()).has.length(1);
  });

  it('skal teste at vi finner korrekt valgt behandling', () => {
    const behandlinger = [
      {
        id: 312,
        type: {
          kode: 'BT-005',
        },
      },
      {
        id: 123,
        type: {
          kode: 'BT-002',
        },
      },
    ];
    const selectedBehandling = getSelectedBehandling.resultFunc(123, behandlinger);
    expect(selectedBehandling.type.kode).to.eql('BT-002');
  });
});
