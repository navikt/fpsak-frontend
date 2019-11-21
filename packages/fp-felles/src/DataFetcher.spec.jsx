import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { DataFetcher } from './DataFetcher';

describe('<DataFetcher>', () => {
  it('skal ikke hente data når en ikke har behandling-id', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const endpoints = [{
      name: 'HENT_KODEVERK',
    }];

    shallow(<DataFetcher
      behandlingVersjon={1}
      isFetchFinished={false}
      endpoints={endpoints}
      render={renderComponent}
      FETCH_HENT_KODEVERK={fetchKodeverk}
    />);

    expect(fetchKodeverk.called).is.false;
    console.log('test');
    expect(renderComponent.called).is.false;
  });

  it('skal ikke hente data når en ikke skal vise komponent', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const data = [{
      name: 'HENT_KODEVERK',
    }];

    shallow(<DataFetcher
      behandlingId={1}
      behandlingVersjon={1}
      showComponent={false}
      showComponentDuringFetch={false}
      isFetchFinished={false}
      endpoints={data}
      render={renderComponent}
      FETCH_HENT_KODEVERK={fetchKodeverk}
    />);

    expect(fetchKodeverk.called).is.false;
    expect(renderComponent.called).is.false;
  });

  it('skal hente data ved mount når en har behandling-id og behandling-versjon', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const data = [{
      name: 'HENT_KODEVERK',
    }];

    shallow(<DataFetcher
      behandlingId={1}
      behandlingVersjon={1}
      showComponent
      showComponentDuringFetch={false}
      isFetchFinished
      endpoints={data}
      render={renderComponent}
      FETCH_HENT_KODEVERK={fetchKodeverk}
    />);

    expect(fetchKodeverk.called).is.true;

    expect(renderComponent.called).is.true;
    expect(renderComponent.getCalls()).has.length(1);
    expect(renderComponent.getCalls()[0].args[0]).is.eql({
      hentKodeverk: undefined,
    });
  });

  it('skal hente data når en har behandling-id blir endret', () => {
    const renderComponent = sinon.spy();
    const fetchKodeverk = sinon.spy();
    const data = [{
      name: 'HENT_KODEVERK',
    }];

    const wrapper = shallow(<DataFetcher
      behandlingVersjon={1}
      showComponent
      showComponentDuringFetch={false}
      isFetchFinished
      endpoints={data}
      render={renderComponent}
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
});
