import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Redirect } from 'react-router-dom';

import { dummyFagsak } from '@fpsak-frontend/utils-test/src/data-test-helper';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { pathToMissingPage } from '../app/paths';
import { FagsakResolver } from './FagsakResolver';

const fagsak = dummyFagsak();
const location = {};

const getRequiredProps = () => ({
  selectedSaksnummer: fagsak.saksnummer,
  fetchFagsak: sinon.spy(),
  resetFagsakContext: sinon.spy(),
  resetFagsakSearch: sinon.spy(),
  removeErrorMessage: sinon.spy(),
  fetchKodeverk: sinon.spy(),
  fetchFagsakPending: false,
  fagsakResolved: false,
  shouldRedirectToBehandlinger: false,
  disableTilbakekreving: true,
  location,
});

describe('<FagsakResolver>', () => {
  it('skal hente fagsak fra server når den mountes', () => {
    const props = getRequiredProps();
    const { fetchFagsak } = props;

    shallow(<FagsakResolver {...props} />);

    expect(fetchFagsak).to.have.property('callCount', 1);
    const { args } = fetchFagsak.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql({ saksnummer: 12345 });
  });

  it('skal rendre children når all informasjon er hentet', () => {
    const props = getRequiredProps();

    const ChildComponent = () => <>Innhold</>;
    const wrapper = shallow(<FagsakResolver {...props}><ChildComponent /></FagsakResolver>);

    expect(wrapper.find(ChildComponent)).to.have.length(0);

    wrapper.setProps({ fagsakResolved: true, selectedFagsak: fagsak });

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

  it('skal vise spinner mens fagsak lastes', () => {
    const props = getRequiredProps();

    const wrapper = shallow(<FagsakResolver {...props} />);

    expect(wrapper.find(LoadingPanel)).to.have.length(0);

    wrapper.setProps({ fetchFagsakPending: true });

    expect(wrapper.find(LoadingPanel)).to.have.length(1);

    wrapper.setProps({ fagsakResolved: true });

    expect(wrapper.find(LoadingPanel)).to.have.length(0);
  });

  it('skal omdirigere hvis henting er ferdig, men ikke all påkrevd informasjon er tilgjengelig', () => {
    const props = {
      ...getRequiredProps(),
      fetchFagsakPending: true,
      fagsakResolved: false,
    };

    const wrapper = shallow(<FagsakResolver {...props} />);

    let redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(0);

    wrapper.setProps({ fetchFagsakPending: false });

    redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to', pathToMissingPage());
  });

  it('skal omdirigere hvis all påkrevd informasjon er tilgjengelig, men selectedFagsak ikke finnes', () => {
    const props = {
      ...getRequiredProps(),
      fetchFagsakPending: true,
      fagsakResolved: false,
      selectedFagsak: undefined,
    };

    const wrapper = shallow(<FagsakResolver {...props} />);

    let redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(0);

    wrapper.setProps({ fagsakResolved: true });

    redirect = wrapper.find(Redirect);
    expect(redirect).to.have.length(1);
    expect(redirect.at(0).props()).to.have.property('to', pathToMissingPage());
  });
});
