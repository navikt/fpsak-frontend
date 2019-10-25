import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';

import RisikoklassfiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';
import FagsakProfile from './components/FagsakProfile';
import { FagsakProfileIndex, getSkalViseRisikoklassifisering } from './FagsakProfileIndex';

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
      skalViseRisikoklassifisering={false}
      alleKodeverk={{}}
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
      skalViseRisikoklassifisering={false}
      alleKodeverk={{}}
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
      skalViseRisikoklassifisering={false}
      alleKodeverk={{}}
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
      skalViseRisikoklassifisering
      alleKodeverk={{}}
    />);
    expect(wrapper.find(RisikoklassfiseringIndex)).has.length(1);
    wrapper.unmount();

    expect(resetCallback.getCalls()).has.length(1);
  });

  it('skal teste at vi viser risikoklassifisering dersom valgt behandling er en førstegangsbehandling', () => {
    const typeMap = {
      9999999: 'BT-002',
      7777777: 'BT-004',
      5555555: 'BT-007',
    };
    const skalViseRisikoklassifisering = getSkalViseRisikoklassifisering.resultFunc(9999999, typeMap);
    expect(skalViseRisikoklassifisering).to.eql(true);
  });

  it('skal teste at vi ikke viser risikoklassifisering dersom valgt behandling er en førstegangsbehandling', () => {
    const typeMap = {
      9999999: 'BT-002',
      7777777: 'BT-004',
      5555555: 'BT-007',
    };
    const skalViseRisikoklassifisering = getSkalViseRisikoklassifisering.resultFunc(5555555, typeMap);
    expect(skalViseRisikoklassifisering).to.eql(false);
  });
});
