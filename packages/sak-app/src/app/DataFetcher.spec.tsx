import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import { DataFetcher, mapStateToProps, createFetchForEachEndpoint } from './DataFetcher';

describe('<DataFetcher>', () => {
  it('skal ikke hente data når en ikke har behandling-id', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const endpoint: Partial<EndpointOperations> = {
      name: 'HENT_KODEVERK',
    };

    shallow(<DataFetcher
      behandlingVersjon={1}
      isFetchFinished={false}
      endpoints={[endpoint] as EndpointOperations[]}
      render={renderComponent}
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      FETCH_HENT_KODEVERK={fetchKodeverk}
    />);

    expect(fetchKodeverk.called).is.false;
    expect(renderComponent.called).is.false;
  });

  it('skal ikke hente data når en ikke skal vise komponent', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const endpoint: Partial<EndpointOperations> = {
      name: 'HENT_KODEVERK',
    };

    shallow(<DataFetcher
      behandlingId={1}
      behandlingVersjon={1}
      showComponent={false}
      isFetchFinished={false}
      endpoints={[endpoint] as EndpointOperations[]}
      render={renderComponent}
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      FETCH_HENT_KODEVERK={fetchKodeverk}
    />);

    expect(fetchKodeverk.called).is.false;
    expect(renderComponent.called).is.false;
  });

  it('skal ikke hente data når en allerede har hentet data for samme behandlingsid og behandlingsversjon', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const endpoint: Partial<EndpointOperations> = {
      name: 'HENT_KODEVERK',
    };

    shallow(<DataFetcher
      behandlingId={1}
      behandlingVersjon={1}
      isFetchFinished={false}
      endpoints={[endpoint] as EndpointOperations[]}
      render={renderComponent}
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      FETCH_HENT_KODEVERK={fetchKodeverk}
      CACHE_HENT_KODEVERK={{ behandlingId: 1, behandlingVersjon: 1 }}
    />);

    expect(fetchKodeverk.called).is.false;
  });

  it('skal hente data ved mount når en har behandling-id og behandling-versjon', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const endpoint: Partial<EndpointOperations> = {
      name: 'HENT_KODEVERK',
    };

    shallow(<DataFetcher
      behandlingId={1}
      behandlingVersjon={1}
      isFetchFinished
      endpoints={[endpoint] as EndpointOperations[]}
      render={renderComponent}
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      FETCH_HENT_KODEVERK={fetchKodeverk}
    />);

    expect(renderComponent.called).is.true;
    expect(renderComponent.getCalls()).has.length(1);
    expect(renderComponent.getCalls()[0].args[0]).is.eql({
      hentKodeverk: undefined,
    });

    expect(fetchKodeverk.called).is.true;
    const { args } = fetchKodeverk.getCalls()[0];
    expect(args).has.length(2);
    expect(args[0]).is.eql({});
    expect(args[1]).is.eql({
      keepData: false,
      cacheParams: {
        behandlingId: 1,
        behandlingVersjon: 1,
      },
    });
  });

  it('skal kalle endepunkt med parameter og ikke fjerne allerede hentet data', () => {
    const fetchKodeverk = sinon.spy();
    const endpoint: Partial<EndpointOperations> = {
      name: 'HENT_KODEVERK',
    };

    shallow(<DataFetcher
      behandlingId={1}
      behandlingVersjon={1}
      isFetchFinished
      endpoints={[endpoint] as EndpointOperations[]}
      render={sinon.spy()}
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      FETCH_HENT_KODEVERK={fetchKodeverk}
      keepDataWhenRefetching
      endpointParams={{ [endpoint.name]: { saksnummer: 1 } }}
    />);

    expect(fetchKodeverk.called).is.true;
    const { args } = fetchKodeverk.getCalls()[0];
    expect(args).has.length(2);
    expect(args[0]).is.eql({ saksnummer: 1 });
    expect(args[1]).is.eql({
      keepData: true,
      cacheParams: {
        behandlingId: 1,
        behandlingVersjon: 1,
      },
    });
  });

  it('skal hente data når en har behandling-id blir endret', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const endpoint: Partial<EndpointOperations> = {
      name: 'HENT_KODEVERK',
    };

    const wrapper = shallow(<DataFetcher
      behandlingVersjon={1}
      isFetchFinished
      endpoints={[endpoint] as EndpointOperations[]}
      render={renderComponent}
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      FETCH_HENT_KODEVERK={fetchKodeverk}
    />);

    expect(fetchKodeverk.called).is.false;
    expect(renderComponent.called).is.false;

    wrapper.setProps({
      behandlingId: 1,
    });

    expect(renderComponent.called).is.true;
    expect(renderComponent.getCalls()).has.length(1);
    expect(renderComponent.getCalls()[0].args[0]).is.eql({
      hentKodeverk: undefined,
    });
  });

  it('skal vise data når kun ett kall feiler', async () => {
    const endpoint1: Partial<EndpointOperations> = {
      name: 'BEHANDLING_FPSAK',
    };
    const endpoint2: Partial<EndpointOperations> = {
      name: 'BEHANDLING_FPTILBAKE',
    };

    const wrapper = await shallow(<DataFetcher
      behandlingId={1}
      behandlingVersjon={1}
      isFetchFinished
      endpoints={[endpoint1, endpoint2] as EndpointOperations[]}
      render={() => <div>test</div>}
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      FETCH_BEHANDLING_FPSAK={() => Promise.resolve()}
      FETCH_BEHANDLING_FPTILBAKE={() => Promise.reject()}
      showComponent
      allowErrors
      showLoadingIcon
      CACHE_BEHANDLING_FPSAK={{ behandlingId: 1, behandlingVersjon: 1 }}
      CACHE_BEHANDLING_FPTILBAKE={{ behandlingId: 1, behandlingVersjon: 1 }}
    />);

    expect(wrapper.html()).is.eql('<div>test</div>');
  });

  it('skal mappe endepunktsdata til prop', () => {
    const state = {};
    const ownProps = {
      endpoints: [{
        name: 'BEHANDLING_FPSAK',
        getRestApiData: () => () => ({ id: 1 }),
        getRestApiCacheParams: () => () => ({ id: 2 }),
        getRestApiFinished: () => () => true,
      }],
    };
    const props = mapStateToProps(state, ownProps);
    expect(props).is.eql({
      isFetchFinished: true,
      behandlingFpsak: {
        id: 1,
      },
      CACHE_BEHANDLING_FPSAK: {
        id: 2,
      },
    });
  });

  it('skal sette opp en fetch-funksjon for alle endepunkter', () => {
    const getBehandlinger = sinon.spy();
    const getKodeverk = sinon.spy();
    const endpoints = [{
      name: 'BEHANDLING_FPSAK',
      makeRestApiRequest: () => getBehandlinger,
    }, {
      name: 'KODEVERK',
      makeRestApiRequest: () => getKodeverk,
    }];
    const props = createFetchForEachEndpoint(endpoints);
    expect(props).is.eql({
      FETCH_BEHANDLING_FPSAK: getBehandlinger,
      FETCH_KODEVERK: getKodeverk,
    });
  });
});
