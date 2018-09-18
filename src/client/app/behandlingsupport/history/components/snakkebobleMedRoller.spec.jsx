import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Undertekst } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';

import SnakkebobleMedRoller from './snakkebobleMedRoller';

// TODO: AA - refactor to before()? Har provat men fungerer ikke så bra
describe('SnakkebobleMedRoller', () => {
  it('skal vise opp boble med korrekt class', () => {
    const tekst = 'Min tekst';
    const opprettetTidspunkt = '2017-12-10';
    const aktoer = { kode: 'SBH', navn: 'Saksbehandler' };
    const kjoenn = 'Kvinne';
    const type = { kode: 'VEDTAK', navn: 'Vedtak fattet' };
    const dokumentLinks = [];
    const selectedBehandlingId = '212';
    const location = { pathname: 'myPath' };

    const wrapper = shallow(
      <SnakkebobleMedRoller
        key={opprettetTidspunkt}
        tekst={tekst}
        rolle={aktoer.kode}
        rolleNavn={aktoer.navn}
        dato={opprettetTidspunkt}
        kjoennKode={kjoenn}
        histType={type}
        dokumentLinks={dokumentLinks}
        selectedBehandlingId={selectedBehandlingId}
        location={location}
      >
        <div />
      </SnakkebobleMedRoller>,
    );

    const panel = wrapper.find(Panel);
    expect(panel.prop('className')).to.be.equal('snakkeboble__panel snakkeboble-panel snakkeboble__snakkebole-panel--saksbehandler');
  });

  it('skal innehalla korrekt type, id og tidpunkt', () => {
    const tekst = 'Min tekst';
    const opprettetTidspunkt = '2017-12-10';
    const aktoer = { kode: 'SBH', navn: 'Saksbehandler' };
    const kjoenn = 'Kvinne';
    const type = { kode: 'VEDTAK', navn: 'Vedtak fattet' };
    const dokumentLinks = [];
    const selectedBehandlingId = '212';
    const location = { pathname: 'myPath' };

    const wrapper = shallow(
      <SnakkebobleMedRoller
        key={opprettetTidspunkt}
        tekst={tekst}
        rolle={aktoer.kode}
        rolleNavn={aktoer.navn}
        dato={opprettetTidspunkt}
        kjoennKode={kjoenn}
        histType={type}
        dokumentLinks={dokumentLinks}
        selectedBehandlingId={selectedBehandlingId}
        location={location}
      >
        <div />
      </SnakkebobleMedRoller>,
    );

    const undertekst = wrapper.find(Undertekst);
    expect(undertekst.childAt(0).text()).to.contain('10.12.2017 - ');
    expect(undertekst.childAt(1).text()).to.contain(' ');
    expect(undertekst.childAt(2).text()).to.contain('//');
    expect(undertekst.childAt(3).text()).to.contain(' ');
    expect(undertekst.childAt(4).text()).to.contain('Saksbehandler');
  });
});
