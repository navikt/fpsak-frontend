import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import { Behandling } from '@fpsak-frontend/types';

import BehandlingPickerItem from './BehandlingPickerItem';
import BehandlingPicker, { sortBehandlinger } from './BehandlingPicker';

describe('<BehandlingPicker>', () => {
  const behandlingTemplate = {
    versjon: 123,
    type: {
      kode: '',
      kodeverk: '',
    },
    status: {
      kode: 'FVED',
      kodeverk: '',
    },
    opprettet: '15.10.2017',
    behandlendeEnhetId: '1242424',
    behandlendeEnhetNavn: 'test',
    erAktivPapirsoknad: false,
    links: [{
      href: '/fpsak/test',
      rel: 'test',
      type: 'GET',
    }],
    gjeldendeVedtak: false,
  };

  it('skal vise forklarende tekst når det ikke finnes behandlinger', () => {
    const wrapper = shallow(<BehandlingPicker
      noExistingBehandlinger
      behandlinger={[]}
      getBehandlingLocation={() => 'url'}
      showAll={false}
      toggleShowAll={sinon.spy()}
      alleKodeverk={{}}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(1);
    expect(message.prop('id')).is.eql('BehandlingList.ZeroBehandlinger');
  });

  it('skal vise alle behandlinger sortert med sist opprettet først i listen', () => {
    const behandlinger = [{
      ...behandlingTemplate,
      id: 1,
      opprettet: '2017-05-01',
    }, {
      ...behandlingTemplate,
      id: 2,
      opprettet: '2018-01-01',
    }, {
      ...behandlingTemplate,
      id: 3,
      opprettet: '2017-01-01',
    }];
    const wrapper = shallow(<BehandlingPicker
      noExistingBehandlinger={false}
      behandlinger={behandlinger as Behandling[]}
      getBehandlingLocation={() => 'url'}
      showAll
      toggleShowAll={sinon.spy()}
      alleKodeverk={{}}
    />);

    const item = wrapper.find(BehandlingPickerItem);
    expect(item).has.length(3);
    expect(item.first().prop('behandling').id).is.eql(2);
    expect(item.at(1).prop('behandling').id).is.eql(1);
    expect(item.last().prop('behandling').id).is.eql(3);
  });

  it('skal vise alle behandlinger sortert med valgt behandling først i listen', () => {
    const behandlinger = [{
      ...behandlingTemplate,
      id: 1,
      opprettet: '2017-05-01',
    }, {
      ...behandlingTemplate,
      id: 2,
      opprettet: '2018-01-01',
    }, {
      ...behandlingTemplate,
      id: 3,
      opprettet: '2017-01-01',
    }];
    const wrapper = shallow(<BehandlingPicker
      noExistingBehandlinger={false}
      behandlinger={behandlinger as Behandling[]}
      behandlingId={2}
      getBehandlingLocation={() => 'url'}
      showAll
      toggleShowAll={sinon.spy()}
      alleKodeverk={{}}
    />);

    const item = wrapper.find(BehandlingPickerItem);
    expect(item).has.length(3);
    expect(item.first().prop('behandling').id).is.eql(2);
    expect(item.at(1).prop('behandling').id).is.eql(1);
    expect(item.last().prop('behandling').id).is.eql(3);
  });

  it('skal sortere behandlingene gitt avsluttet og opprettet datoer', () => {
    const behandlinger = [{
      opprettet: '2019-08-13T13:32:57',
      avsluttet: '2019-08-13T13:32:57',
    }, {
      opprettet: '2019-08-14T13:32:57',
    }, {
      opprettet: '2019-03-13T13:32:57',
      avsluttet: '2019-09-13T13:32:57',
    }, {
      opprettet: '2019-08-13T13:32:57',
    }];

    const sorterteBehandlinger = sortBehandlinger(behandlinger);

    expect(sorterteBehandlinger).is.eql([{
      opprettet: '2019-08-14T13:32:57',
    }, {
      opprettet: '2019-08-13T13:32:57',
    }, {
      opprettet: '2019-03-13T13:32:57',
      avsluttet: '2019-09-13T13:32:57',
    }, {
      opprettet: '2019-08-13T13:32:57',
      avsluttet: '2019-08-13T13:32:57',
    }]);
  });
});
