import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import FagsakSearch from './FagsakSearch';
import SearchForm from './SearchForm';

describe('<FagsakSearch>', () => {
  const fagsak = {
    saksnummer: 12345,
    sakstype: {
      navn: 'Engangsstonad',
      kode: 'TEST',
    },
    status: {
      navn: 'Under behandling',
      kode: 'UBEH',
    },
    barnFodt: '13‎.‎02‎.‎2017‎',
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
    endret: '13‎.‎02‎.‎2017‎',
    person: {
      navn: 'Frida',
      alder: 44,
      personnummer: '0405198632231',
      erKvinne: true,
    },
  };

  it('skal kun vise søkefelt før søk er startet', () => {
    const searchFagsakFunction = sinon.spy();
    const wrapper = shallow(<FagsakSearch
      fagsaker={[]}
      searchFagsakCallback={searchFagsakFunction}
      searchResultReceived={false}
      selectFagsakCallback={sinon.spy()}
      spinner
      searchStarted
    />);

    const searchComp = wrapper.find(SearchForm);
    expect(searchComp).to.have.length(1);
    expect(wrapper.find('Label')).to.have.length(0);
    expect(wrapper.find('Person')).to.have.length(0);
    expect(wrapper.find('FagsakList')).to.have.length(0);
  });

  it('skal vise søkefelt og label for ingen søketreff når ingen fagsaker blir hentet', () => {
    const wrapper = shallow(<FagsakSearch
      fagsaker={[]}
      searchFagsakCallback={sinon.spy()}
      searchResultReceived
      selectFagsakCallback={sinon.spy()}
      spinner
      searchStarted
    />);

    expect(wrapper.find(SearchForm)).to.have.length(1);
    const labelComp = wrapper.find('Normaltekst');
    expect(labelComp).to.have.length(1);
    expect(labelComp.find('FormattedMessage').prop('id')).to.eql('FagsakSearch.ZeroSearchResults');
  });

  it('skal vise søkefelt og søketreff der person og to fagsaker blir vist', () => {
    const searchFagsakFunction = sinon.spy();
    const selectFagsakFunction = sinon.spy();
    const wrapper = shallow(<FagsakSearch
      fagsaker={[fagsak, fagsak]}
      searchFagsakCallback={searchFagsakFunction}
      searchResultReceived
      selectFagsakCallback={selectFagsakFunction}
      spinner
      searchStarted
    />);

    expect(wrapper.find(SearchForm)).to.have.length(1);
    expect(wrapper.find('Label')).to.have.length(0);

    const personComp = wrapper.find('Connect(PersonIndex)');
    expect(personComp).to.have.length(1);

    const fagsakListComp = wrapper.find('FagsakList');
    expect(fagsakListComp).to.have.length(1);
    expect(fagsakListComp.prop('fagsaker')).to.eql([fagsak, fagsak]);
    expect(fagsakListComp.prop('selectFagsakCallback')).to.eql(selectFagsakFunction);
  });
});
