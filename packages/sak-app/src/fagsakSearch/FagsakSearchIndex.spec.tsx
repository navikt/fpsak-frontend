import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { Fagsak } from '@fpsak-frontend/types';
import { ErrorTypes } from '@fpsak-frontend/rest-api';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';

import FagsakSearchIndex from './FagsakSearchIndex';

describe('<FagsakSearchIndex>', () => {
  const fagsak: Partial<Fagsak> = {
    saksnummer: 12345,
    sakstype: {
      kode: 'ES',
      kodeverk: 'test',
    },
    status: {
      kode: 'OPPR',
      kodeverk: 'test',
    },
    barnFodt: '10.10.2017',
    antallBarn: 1,
    person: {
      navn: 'Espen',
      alder: 38,
      personnummer: '123456789',
      erKvinne: true,
      erDod: false,
      personstatusType: {
        kode: 'TEst',
        kodeverk: 'test',
      },
    },
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
    dekningsgrad: 100,
  };
  const fagsak2: Partial<Fagsak> = {
    ...fagsak,
    saksnummer: 23456,
  };
  const fagsaker = [fagsak, fagsak2];

  it('skal sette opp søkeskjermbilde for fagsaker', () => {
    const wrapper = shallow(<FagsakSearchIndex.WrappedComponent
      fagsaker={fagsaker as Fagsak[]}
      push={sinon.spy()}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      alleKodeverk={{}}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSokSakIndex);
    expect(fagsakSearchIndex).to.have.length(1);
    expect(fagsakSearchIndex.prop('fagsaker')).to.eql(fagsaker);
  });

  it('skal gå til valgt fagsak', () => {
    const pushCallback = sinon.spy();
    const wrapper = shallow(<FagsakSearchIndex.WrappedComponent
      fagsaker={fagsaker as Fagsak[]}
      push={pushCallback}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      alleKodeverk={{}}
    />);

    const fagsakSearchIndex = wrapper.find(FagsakSokSakIndex);
    const velgFagsak = fagsakSearchIndex.prop('selectFagsakCallback') as (event: any, saksnummer: number) => undefined;
    velgFagsak('', fagsak.saksnummer);

    expect(pushCallback.calledOnce).to.be.true;
    const { args } = pushCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(`/fagsak/${fagsak.saksnummer}/`);
  });

  it('skal gå direkte til fagsak når søkeresultatet returnerer kun en fagsak', () => {
    const pushCallback = sinon.spy();
    const wrapper = shallow(<FagsakSearchIndex.WrappedComponent
      push={pushCallback}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      alleKodeverk={{}}
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
    const wrapper = shallow(<FagsakSearchIndex.WrappedComponent
      push={pushCallback}
      searchFagsaker={sinon.spy()}
      searchResultReceived={false}
      searchStarted
      resetFagsakSearch={sinon.spy()}
      alleKodeverk={{}}
    />);

    wrapper.setProps({
      fagsaker,
      searchResultReceived: true,
      searchStarted: false,
    });
    wrapper.update();

    expect(pushCallback.calledOnce).to.be.false;
  });

  describe('getSearchFagsakerAccessDenied', () => {
    it('skal hente response-data når feilen er at en mangler tilgang', () => {
      const error = {
        response: {
          data: {
            type: ErrorTypes.MANGLER_TILGANG_FEIL,
          },
        },
      };

      const res = '';

      expect(res).is.eql(error.response.data);
    });

    it('skal ikke hente response-data når feilen er noe annet enn mangler tilgang', () => {
      const error = {
        response: {
          data: {
            type: ErrorTypes.TOMT_RESULTAT_FEIL,
          },
        },
      };

      const res = getSearchFagsakerAccessDenied.resultFunc(error);

      expect(res).is.undefined;
    });
  });
});
