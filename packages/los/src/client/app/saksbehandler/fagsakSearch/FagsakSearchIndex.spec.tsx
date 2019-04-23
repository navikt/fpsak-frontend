
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import FagsakSearch from './components/FagsakSearch';
import { FagsakSearchIndex } from './FagsakSearchIndex';

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
    person: {
      navn: 'Espen',
      alder: 38,
      personnummer: '123456789',
      erKvinne: true,
      erDod: false,
    },
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
  };
  const fagsaker = [fagsak, { ...fagsak, saksnummer: 23456 }];

  it('skal sette opp søkeskjermbilde for fagsaker', () => {
    const wrapper = shallowWithIntl(<FagsakSearchIndex
      fagsaker={fagsaker}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      goToFagsak={sinon.spy()}
      reserverOppgave={sinon.spy()}
      hentReservasjonsstatus={sinon.spy()}
      fagsakOppgaver={[]}
      hentOppgaverForFagsaker={sinon.spy()}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSearch);
    expect(fagsakSearchIndex).to.have.length(1);
    expect(fagsakSearchIndex.prop('fagsaker')).to.eql(fagsaker);
  });

  it('skal gå til valgt fagsak', () => {
    const goToFagsak = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex
      fagsaker={fagsaker}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      goToFagsak={goToFagsak}
      reserverOppgave={sinon.spy()}
      hentReservasjonsstatus={sinon.spy()}
      fagsakOppgaver={[]}
      hentOppgaverForFagsaker={sinon.spy()}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSearch);
    fagsakSearchIndex.prop('selectFagsakCallback')('', fagsak.saksnummer);

    expect(goToFagsak.calledOnce).to.be.true;
  });

  it('skal gå direkte til fagsak når søkeresultatet returnerer kun en fagsak', () => {
    const goToFagsak = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      goToFagsak={goToFagsak}
      reserverOppgave={sinon.spy()}
      hentReservasjonsstatus={sinon.spy()}
      fagsakOppgaver={[]}
      hentOppgaverForFagsaker={sinon.spy()}
    />);

    wrapper.setProps({
      fagsaker: [fagsak],
    });
    wrapper.setState({
      sokStartet: false,
      sokFerdig: true,
    });
    wrapper.update();

    expect(goToFagsak.calledOnce).to.be.true;
  });

  it('skal ikke gå direkte til fagsak når søkeresultatet returnerer flere fagsaker', () => {
    const goToFagsak = sinon.spy();
    const wrapper = shallowWithIntl(<FagsakSearchIndex
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      goToFagsak={goToFagsak}
      reserverOppgave={sinon.spy()}
      hentReservasjonsstatus={sinon.spy()}
      fagsakOppgaver={[]}
      hentOppgaverForFagsaker={sinon.spy()}
    />);

    wrapper.setProps({
      fagsaker,
      searchResultReceived: true,
      searchStarted: false,
    });
    wrapper.update();

    expect(goToFagsak.calledOnce).to.be.false;
  });
});
