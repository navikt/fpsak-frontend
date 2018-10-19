import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { BehandlingMenu } from './BehandlingMenu';

describe('<BehandlingMenu>', () => {
  const behandlendeEnheter = [{
    enhetId: '001',
    enhetNavn: 'NAV',
    status: 'Aktiv',
  }];

  const fullAccess = {
    employeeHasAccess: true,
    isEnabled: true,
  };

  const navAnsatt = {
    brukernavn: '',
    kanBehandleKode6: false,
    kanBehandleKode7: false,
    kanBehandleKodeEgenAnsatt: false,
    kanBeslutte: false,
    kanOverstyre: false,
    kanSaksbehandle: false,
    kanVeilede: false,
    navn: '',
  };

  const behandlingIdentifier = new BehandlingIdentifier(23, 1);

  it('skal rendre behandlingsmeny med visning av alle valg bortsett fra "fortsett behandling" når behandling ikke er satt på vent', () => {
    const behandlingOnHoldCallback = sinon.spy();
    const pushCallback = sinon.spy();
    const shelveBehandlingCallback = sinon.spy();
    const previewCallback = sinon.spy();
    const submitRevurderingCallback = sinon.spy();

    const wrapper = shallow(<BehandlingMenu
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={2}
      saksnummer={23}
      previewHenleggBehandling={previewCallback}
      submitRevurdering={submitRevurderingCallback}
      resumeBehandling={sinon.spy()}
      shelveBehandling={shelveBehandlingCallback}
      setBehandlingOnHold={behandlingOnHoldCallback}
      nyBehandlendeEnhet={sinon.spy()}
      createNewForstegangsbehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      push={pushCallback}
      henleggBehandlingAccess={fullAccess}
      settBehandlingPaVentAccess={fullAccess}
      byttBehandlendeEnhetAccess={fullAccess}
      opprettRevurderingAccess={fullAccess}
      gjenopptaBehandlingAccess={fullAccess}
      opprettNyForstegangsBehandlingAccess={fullAccess}
      opneBehandlingForEndringerAccess={fullAccess}
      navAnsatt={navAnsatt}
      ikkeVisOpprettNyBehandling={fullAccess}
      openBehandlingForChanges={sinon.spy()}
      hasSoknad
      isInnsynsbehandling={false}
    />);

    const behandlingOnHoldMenuItem = wrapper.find('PauseBehandlingMenuItem');
    expect(behandlingOnHoldMenuItem).has.length(1);
    expect(behandlingOnHoldMenuItem.prop('behandlingIdentifier')).is.eql(behandlingIdentifier);
    expect(behandlingOnHoldMenuItem.prop('setBehandlingOnHold')).is.eql(behandlingOnHoldCallback);
    expect(behandlingOnHoldMenuItem.prop('toggleBehandlingsmeny')).is.not.null;

    const kanHenleggesMenuItem = wrapper.find('Connect(ShelveBehandlingMenuItem)');
    expect(kanHenleggesMenuItem).has.length(1);
    expect(kanHenleggesMenuItem.prop('behandlingIdentifier')).is.eql(behandlingIdentifier);
    expect(kanHenleggesMenuItem.prop('previewHenleggBehandling')).is.eql(previewCallback);
    expect(kanHenleggesMenuItem.prop('shelveBehandling')).is.eql(shelveBehandlingCallback);
    expect(kanHenleggesMenuItem.prop('push')).is.eql(pushCallback);
    expect(kanHenleggesMenuItem.prop('toggleBehandlingsmeny')).is.not.null;
  });

  it('skal vise menyvalg "fortsett behandling" men ikke "Sett på vent" og "Kan henlegges" når behandling er satt på vent', () => {
    const resumeBehandlingCallback = sinon.spy();
    const wrapper = shallow(<BehandlingMenu
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={2}
      behandlingPaaVent
      saksnummer={23}
      previewHenleggBehandling={sinon.spy()}
      submitRevurdering={sinon.spy()}
      resumeBehandling={resumeBehandlingCallback}
      shelveBehandling={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      nyBehandlendeEnhet={sinon.spy()}
      createNewForstegangsbehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      push={sinon.spy()}
      henleggBehandlingAccess={fullAccess}
      settBehandlingPaVentAccess={fullAccess}
      byttBehandlendeEnhetAccess={fullAccess}
      opprettRevurderingAccess={fullAccess}
      gjenopptaBehandlingAccess={fullAccess}
      opprettNyForstegangsBehandlingAccess={fullAccess}
      opneBehandlingForEndringerAccess={fullAccess}
      ikkeVisOpprettNyBehandling={fullAccess}
      navAnsatt={navAnsatt}
      openBehandlingForChanges={sinon.spy()}
      hasSoknad
      isInnsynsbehandling={false}
    />);

    expect(wrapper.find('PauseBehandlingMenuItem')).has.length(0);

    const behandlingOnHoldMenuItem = wrapper.find('ResumeBehandlingMenuItem');
    expect(behandlingOnHoldMenuItem).has.length(1);
    expect(behandlingOnHoldMenuItem.prop('behandlingIdentifier')).is.eql(behandlingIdentifier);
    expect(behandlingOnHoldMenuItem.prop('resumeBehandling')).is.eql(resumeBehandlingCallback);
    expect(behandlingOnHoldMenuItem.prop('toggleBehandlingsmeny')).is.not.null;

    expect(wrapper.find('ShelveBehandlingMenuItem')).has.length(0);
  });


  it('skal vise knapp med lukket-tekst når meny er synlig', () => {
    const wrapper = shallow(<BehandlingMenu
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={2}
      saksnummer={23}
      previewHenleggBehandling={sinon.spy()}
      submitRevurdering={sinon.spy()}
      resumeBehandling={sinon.spy()}
      shelveBehandling={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      nyBehandlendeEnhet={sinon.spy()}
      createNewForstegangsbehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      push={sinon.spy()}
      henleggBehandlingAccess={fullAccess}
      settBehandlingPaVentAccess={fullAccess}
      byttBehandlendeEnhetAccess={fullAccess}
      opprettRevurderingAccess={fullAccess}
      gjenopptaBehandlingAccess={fullAccess}
      opprettNyForstegangsBehandlingAccess={fullAccess}
      opneBehandlingForEndringerAccess={fullAccess}
      ikkeVisOpprettNyBehandling={fullAccess}
      navAnsatt={navAnsatt}
      openBehandlingForChanges={sinon.spy()}
      hasSoknad
      isInnsynsbehandling={false}
    />);

    wrapper.setState({ menuVisible: true });

    const messages = wrapper.find('FormattedMessage');
    expect(messages).has.length(2);
    expect(messages.last().prop('id')).is.eql('Behandlingsmeny.Close');
  });

  it('skal vise knapp med åpne-tekst når meny ikke er synlig', () => {
    const wrapper = shallow(<BehandlingMenu
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={2}
      saksnummer={23}
      previewHenleggBehandling={sinon.spy()}
      submitRevurdering={sinon.spy()}
      resumeBehandling={sinon.spy()}
      shelveBehandling={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      nyBehandlendeEnhet={sinon.spy()}
      createNewForstegangsbehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      push={sinon.spy()}
      henleggBehandlingAccess={fullAccess}
      settBehandlingPaVentAccess={fullAccess}
      byttBehandlendeEnhetAccess={fullAccess}
      opprettRevurderingAccess={fullAccess}
      gjenopptaBehandlingAccess={fullAccess}
      opprettNyForstegangsBehandlingAccess={fullAccess}
      opneBehandlingForEndringerAccess={fullAccess}
      ikkeVisOpprettNyBehandling={fullAccess}
      navAnsatt={navAnsatt}
      openBehandlingForChanges={sinon.spy()}
      hasSoknad
      isInnsynsbehandling={false}
    />);

    wrapper.setState({ menuVisible: false });

    const messages = wrapper.find('FormattedMessage');
    expect(messages).has.length(2);
    expect(messages.last().prop('id')).is.eql('Behandlingsmeny.Open');
  });
});
