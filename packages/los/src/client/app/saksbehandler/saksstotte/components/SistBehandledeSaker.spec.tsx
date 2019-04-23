
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Lenke from 'nav-frontend-lenker';

import SistBehandledeSaker from './SistBehandledeSaker';

describe('<SistBehandledeSaker>', () => {
  it('skal vise sist behandlede saker som lenker i en liste', () => {
    const oppgaver = [{
      id: 3,
      status: {
        erReservert: false,
      },
      saksnummer: 1,
      behandlingId: 1,
      personnummer: '123456789',
      navn: 'Espen Utvikler',
      behandlingstype: {
        kode: 'test',
        navn: 'test',
      },
      behandlingStatus: {
        kode: 'test',
        navn: 'test',
      },
      opprettetTidspunkt: '2018-01-01',
      behandlingsfrist: '2018-01-01',
      fagsakYtelseType: {
        kode: 'test',
        navn: 'test',
      },
      erTilSaksbehandling: true,
    }, {
      id: 4,
      status: {
        erReservert: false,
      },
      saksnummer: 2,
      behandlingId: 2,
      personnummer: '657643535',
      navn: 'Espen Solstråle',
      behandlingstype: {
        kode: 'test',
        navn: 'test',
      },
      behandlingStatus: {
        kode: 'test',
        navn: 'test',
      },
      opprettetTidspunkt: '2018-01-01',
      behandlingsfrist: '2018-01-01',
      fagsakYtelseType: {
        kode: 'test',
        navn: 'test',
      },
      erTilSaksbehandling: true,
    }];

    const wrapper = shallow(<SistBehandledeSaker
      fpsakUrl="www.fpsak.no"
      sistBehandledeSaker={oppgaver}
    />);

    const links = wrapper.find(Lenke);
    expect(links).to.have.length(2);
    expect(links.first().prop('href')).to.eql('www.fpsak.no/fagsak/1/behandling/1/?punkt=default&fakta=default');
    expect(links.first().childAt(0).text()).to.eql('Espen Utvikler 123456789');
    expect(links.last().prop('href')).to.eql('www.fpsak.no/fagsak/2/behandling/2/?punkt=default&fakta=default');
    expect(links.last().childAt(0).text()).to.eql('Espen Solstråle 657643535');
  });

  it('skal ikke vise noen lenker når ingen behandlede saker blir funnet', () => {
    const oppgaver = [];
    const wrapper = shallow(<SistBehandledeSaker
      fpsakUrl="www.fpsak.no"
      sistBehandledeSaker={oppgaver}
    />);

    expect(wrapper.find(Lenke)).to.have.length(0);
  });
});
