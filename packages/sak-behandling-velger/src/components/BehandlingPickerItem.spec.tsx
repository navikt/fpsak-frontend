import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { NavLink } from 'react-router-dom';

import { Behandling } from '@fpsak-frontend/types';

import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingPickerItem from './BehandlingPickerItem';

describe('<BehandlingPickerItem>', () => {
  const behandlingTemplate = {
    id: 1,
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

  it('skal vise behandling uten lenke når det kun finnes en behandling og denne er valgt', () => {
    const wrapper = shallow(<BehandlingPickerItem
      onlyOneBehandling
      behandling={behandlingTemplate as Behandling}
      getBehandlingLocation={() => 'url'}
      isActive
      showAll
      toggleShowAll={() => undefined}
      alleKodeverk={{}}
    />);

    expect(wrapper.find(BehandlingPickerItemContent)).has.length(1);
    expect(wrapper.find(NavLink)).has.length(0);
  });

  it('skal vise behandling med lenke når det kun finnes en behandling og denne ikke er valgt', () => {
    const wrapper = shallow(<BehandlingPickerItem
      onlyOneBehandling
      behandling={behandlingTemplate as Behandling}
      getBehandlingLocation={() => 'url'}
      isActive={false}
      showAll
      toggleShowAll={() => undefined}
      alleKodeverk={{}}
    />);

    expect(wrapper.find(BehandlingPickerItemContent)).has.length(1);
    expect(wrapper.find(NavLink)).has.length(1);
  });

  it('skal vise behandling med knapp for visning av alle behandlinger når ingen behandlinger er valgt og innslag er aktivt', () => {
    const wrapper = shallow(<BehandlingPickerItem
      onlyOneBehandling={false}
      behandling={behandlingTemplate as Behandling}
      getBehandlingLocation={() => 'url'}
      isActive
      showAll={false}
      toggleShowAll={() => undefined}
      alleKodeverk={{}}
    />);

    expect(wrapper.find(BehandlingPickerItemContent)).has.length(1);
    expect(wrapper.find('button')).has.length(1);
  });
});
