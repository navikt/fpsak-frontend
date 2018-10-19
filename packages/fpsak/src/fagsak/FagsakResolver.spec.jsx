import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Redirect } from 'react-router-dom';

import { dummyFagsak } from 'testHelpers/data-test-helper';
import {
  getLocationWithDefaultBehandlingspunktAndFakta, pathToBehandling, pathToBehandlinger, pathToMissingPage,
} from 'app/paths';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { FagsakResolver } from './FagsakResolver';

const fagsak = dummyFagsak();
const behandlingId = 67890;
const location = {};
const pathToBehandlingerForFagsak = pathToBehandlinger(fagsak.saksnummer);
const locationForBehandling = getLocationWithDefaultBehandlingspunktAndFakta({ ...location, pathname: pathToBehandling(fagsak.saksnummer, behandlingId) });

const getRequiredProps = () => ({
  selectedSaksnummer: fagsak.saksnummer,
  fetchFagsakInfo: sinon.spy(),
  resetFagsakContext: sinon.spy(),
  resetFagsakSearch: sinon.spy(),
  removeErrorMessage: sinon.spy(),
  fetchFagsakInfoPending: false,
  allFagsakInfoResolved: false,
  shouldRedirectToBehandlinger: false,
  location,
});

describe('<FagsakResolver>', () => {
  it('skal hente fagsak fra server når den mountes', () => {
    const props = getRequiredProps();
    const { fetchFagsakInfo } = props;

    shallow(<FagsakResolver {...props} />);

    expect(fetchFagsakInfo).to.have.property('callCount', 1);
    const { args } = fetchFagsakInfo.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(12345);
  });

  it('skal rendre children når all informasjon er hentet', () => {
    const props = getRequiredProps();

    const ChildComponent = () => 'Innhold';
    const wrapper = shallow(<FagsakResolver {...props}><ChildComponent /></FagsakResolver>);

    expect(wrapper.find(ChildComponent)).to.have.length(0);

    wrapper.setProps({ allFagsakInfoResolved: true, selectedFagsak: fagsak });

    expect(wrapper.find(ChildComponent)).to.have.length(1);
  });

  it('skal resette fagsaker i state når komponent blir unmounta', () => {
    const props = getRequiredProps();
    const { resetFagsakContext } = props;

    const wrapper = shallow(<FagsakResolver {...props} />);

    expect(resetFagsakContext).to.have.property('callCount', 0);

    wrapper.unmount();

    expect(resetFagsakContext).to.have.property('callCount', 1);
  });

  it('skal vise spinner mens fagsak-info lastes', () => {
    const props = getRequiredProps();

    const wrapper = shallow(<FagsakResolver {...props} />);

    expect(wrapper.find(LoadingPanel)).to.have.length(0);

    wrapper.setProps({ fetchFagsakInfoPending: true });

    expect(wrapper.find(LoadingPanel)).to.have.length(1);

    wrapper.setProps({ allFagsakInfoResolved: true });

    expect(wrapper.find(LoadingPanel)).to.have.length(0);
  });

  it('skal omdirigere hvis henting er ferdig, men ikke all påkrevd informasjon er tilgjengelig', () => {
    const props = {
      ...getRequiredProps(),
      fetchFagsakInfoPending: true,
      allFagsakInfoResolved: false,
    };

    const wrapper = shallow(<FagsakResolver {...props} />);

    let redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(0);

    wrapper.setProps({ fetchFagsakInfoPending: false });

    redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to', pathToMissingPage());
  });

  it('skal omdirigere hvis all påkrevd informasjon er tilgjengelig, men selectedFagsak ikke finnes', () => {
    const props = {
      ...getRequiredProps(),
      fetchFagsakInfoPending: true,
      allFagsakInfoResolved: false,
      selectedFagsak: undefined,
    };

    const wrapper = shallow(<FagsakResolver {...props} />);

    let redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(0);

    wrapper.setProps({ allFagsakInfoResolved: true });

    redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to', pathToMissingPage());
  });

  it('skal omdirigere til behandling hvis flagget er satt', () => {
    const props = {
      ...getRequiredProps(),
      allFagsakInfoResolved: true,
      shouldRedirectToBehandlinger: false,
      selectedFagsak: fagsak,
      behandlingerIds: [behandlingId, behandlingId],
    };

    const wrapper = shallow(<FagsakResolver {...props} />);

    let redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(0);

    wrapper.setProps({ shouldRedirectToBehandlinger: true });

    redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to').that.eql(pathToBehandlingerForFagsak);

    wrapper.setProps({ behandlingerIds: [behandlingId] });

    redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to').that.eql(locationForBehandling);
  });
});
