import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import FagsakSearch from './components/FagsakSearch';
import FagsakSearchIndex from './FagsakSearchIndex';

describe('<FagsakSearchIndex>', () => {
  const fagsak = {
    saksnummer: 12345,
    sakstype: {
      kode: 'ES',
      navn: 'test',
    },
    status: {
      kode: 'OPPR',
      navn: 'test',
    },
    barnFodt: '10.10.2017',
    antallBarn: 1,
    person: {
      navn: 'Espen',
      alder: 38,
      personnummer: '123456789',
      erKvinne: true,
    },
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
  };
  const fagsaker = [fagsak, { ...fagsak, saksnummer: 23456 }];

  it('skal sette opp søkeskjermbilde for fagsaker', () => {
    const wrapper = shallowWithIntl(<FagsakSearchIndex.WrappedComponent
      fagsaker={fagsaker}
      push={sinon.spy()}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSearch);
    expect(fagsakSearchIndex).to.have.length(1);
    expect(fagsakSearchIndex.prop('fagsaker')).to.eql(fagsaker);
  });

  it('skal gå til valgt fagsak', () => {
    const pushCallback = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex.WrappedComponent
      fagsaker={fagsaker}
      push={pushCallback}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSearch);
    fagsakSearchIndex.prop('selectFagsakCallback')('', fagsak.saksnummer);

    expect(pushCallback.calledOnce).to.be.true;
    const { args } = pushCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(`/fagsak/${fagsak.saksnummer}/`);
  });

  it('skal gå direkte til fagsak når søkeresultatet returnerer kun en fagsak', () => {
    const pushCallback = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex.WrappedComponent
      push={pushCallback}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
    />);

    wrapper.setProps({
      fagsaker: [fagsak],
      searchResultReceived: true,
      searchStarted: false,
    });
    wrapper.update();

    expect(pushCallback.calledOnce).to.be.true;
    const { args } = pushCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(`/fagsak/${fagsak.saksnummer}/`);
  });

  it('skal ikke gå direkte til fagsak når søkeresultatet returnerer flere fagsaker', () => {
    const pushCallback = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex.WrappedComponent
      push={pushCallback}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
    />);

    wrapper.setProps({
      fagsaker,
      searchResultReceived: true,
      searchStarted: false,
    });
    wrapper.update();

    expect(pushCallback.calledOnce).to.be.false;
  });
});
