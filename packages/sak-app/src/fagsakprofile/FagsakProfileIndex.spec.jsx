import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Redirect } from 'react-router-dom';

import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import {
  getLocationWithDefaultBehandlingspunktAndFakta, pathToBehandling, pathToBehandlinger, DataFetcher,
} from '@fpsak-frontend/fp-felles';

import { FagsakProfileIndex } from './FagsakProfileIndex';

describe('<FagsakProfileIndex>', () => {
  it('skal rendre komponent og vise alle behandlinger når ingen behandling er valgt', () => {
    const showAllCallback = sinon.spy();
    const wrapper = shallow(<FagsakProfileIndex
      saksnummer={123}
      sakstype={{ kode: fagsakYtelseType.FORELDREPENGER }}
      fagsakStatus={{ kode: fagsakStatus.OPPRETTET }}
      noExistingBehandlinger
      showAll={false}
      toggleShowAll={showAllCallback}
      reset={sinon.spy()}
      alleKodeverk={{}}
      enabledApis={[]}
      shouldRedirectToBehandlinger={false}
      location={{}}
      dekningsgrad={100}
    />);

    const dataFetchers = wrapper.find(DataFetcher);
    expect(dataFetchers.at(1).prop('showComponent')).is.false;

    const fagsakProfile = dataFetchers.at(0).renderProp('render')({
    }).find(FagsakProfilSakIndex);
    expect(fagsakProfile).has.length(1);
    expect(showAllCallback.getCalls()).has.length(1);
  });

  it('skal ikke slå på visning av alle behandlinger når behandling allerede er valgt', () => {
    const showAllCallback = sinon.spy();
    shallow(<FagsakProfileIndex
      saksnummer={123}
      sakstype={{ kode: fagsakYtelseType.FORELDREPENGER }}
      fagsakStatus={{ kode: fagsakStatus.OPPRETTET }}
      selectedBehandlingId={1}
      noExistingBehandlinger
      showAll
      toggleShowAll={showAllCallback}
      reset={sinon.spy()}
      alleKodeverk={{}}
      enabledApis={[]}
      shouldRedirectToBehandlinger={false}
      location={{}}
      dekningsgrad={100}
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
      noExistingBehandlinger
      showAll
      toggleShowAll={sinon.spy()}
      reset={resetCallback}
      alleKodeverk={{}}
      enabledApis={[]}
      shouldRedirectToBehandlinger={false}
      location={{}}
      dekningsgrad={100}
    />);

    wrapper.unmount();

    expect(resetCallback.getCalls()).has.length(1);
  });


  it('skal omdirigere til behandling hvis flagget er satt', () => {
    const behandlingId = 67890;
    const saksnummer = 123;
    const location = {};
    const pathToBehandlingerForFagsak = pathToBehandlinger(saksnummer);
    const locationForBehandling = getLocationWithDefaultBehandlingspunktAndFakta({ ...location, pathname: pathToBehandling(saksnummer, behandlingId) });

    const wrapper = shallow(<FagsakProfileIndex
      saksnummer={saksnummer}
      sakstype={{ kode: fagsakYtelseType.FORELDREPENGER }}
      fagsakStatus={{ kode: fagsakStatus.OPPRETTET }}
      selectedBehandlingId={1}
      noExistingBehandlinger
      showAll
      toggleShowAll={sinon.spy()}
      reset={sinon.spy()}
      alleKodeverk={{}}
      enabledApis={[]}
      shouldRedirectToBehandlinger={false}
      location={{}}
      dekningsgrad={100}
    />);

    let redirect = wrapper.find(DataFetcher).at(0).renderProp('render')({
    }).find(Redirect);
    expect(redirect).to.have.length(0);

    wrapper.setProps({ shouldRedirectToBehandlinger: true });

    redirect = wrapper.find(DataFetcher).at(0).renderProp('render')({
      behandlingerFpsak: [{
        id: 67890,
      }, {
        id: 2,
      }],
    }).find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to').that.eql(pathToBehandlingerForFagsak);

    redirect = wrapper.find(DataFetcher).at(0).renderProp('render')({
      behandlingerFpsak: [{
        id: 67890,
      }],
    }).find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to').that.eql(locationForBehandling);
  });
});
