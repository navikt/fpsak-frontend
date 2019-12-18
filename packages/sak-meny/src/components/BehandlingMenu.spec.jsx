import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import BehandlingMenu from './BehandlingMenu';
import PauseBehandlingMenuItem from './pauseBehandling/PauseBehandlingMenuItem';
import ShelveBehandlingMenuItem from './shelveBehandling/ShelveBehandlingMenuItem';
import MenyKodeverk from '../MenyKodeverk';
import MenyBehandlingData from '../MenyBehandlingData';
import MenyRettigheter from '../MenyRettigheter';

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
  const type = { kode: behandlingType.FORSTEGANGSSOKNAD };
  const behandlingData = new MenyBehandlingData(1, '3', 2, type, false, false, 'enhetsid', 'Enhetsnavn', false);
  const kodeverk = new MenyKodeverk();

  const rettigheter = new MenyRettigheter({
    henleggBehandlingAccess: fullAccess,
    settBehandlingPaVentAccess: fullAccess,
    byttBehandlendeEnhetAccess: fullAccess,
    opprettRevurderingAccess: fullAccess,
    gjenopptaBehandlingAccess: fullAccess,
    opprettNyForstegangsBehandlingAccess: fullAccess,
    opneBehandlingForEndringerAccess: fullAccess,
    ikkeVisOpprettNyBehandling: fullAccess,
  });

  const behandlingOnHoldCallback = sinon.spy();
  const pushCallback = sinon.spy();
  const shelveBehandlingCallback = sinon.spy();
  const previewCallback = sinon.spy();

  it('skal rendre behandlingsmeny med visning av alle valg bortsett fra "fortsett behandling" når behandling ikke er satt på vent', () => {
    const wrapper = shallow(<BehandlingMenu
      saksnummer={23}
      behandlingData={behandlingData}
      menyKodeverk={kodeverk}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      previewHenleggBehandling={previewCallback}
      rettigheter={rettigheter}
      resumeBehandling={sinon.spy()}
      shelveBehandling={shelveBehandlingCallback}
      nyBehandlendeEnhet={sinon.spy()}
      createNewBehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      erTilbakekrevingAktivert={false}
      setBehandlingOnHold={behandlingOnHoldCallback}
      openBehandlingForChanges={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      push={pushCallback}
      navAnsatt={navAnsatt}
    />);

    const behandlingOnHoldMenuItem = wrapper.find(PauseBehandlingMenuItem);
    expect(behandlingOnHoldMenuItem).has.length(1);
    expect(behandlingOnHoldMenuItem.prop('behandlingIdentifier')).is.eql(behandlingIdentifier);
    expect(behandlingOnHoldMenuItem.prop('setBehandlingOnHold')).is.eql(behandlingOnHoldCallback);
    expect(behandlingOnHoldMenuItem.prop('toggleBehandlingsmeny')).is.not.null;

    const kanHenleggesMenuItem = wrapper.find(ShelveBehandlingMenuItem);
    expect(kanHenleggesMenuItem).has.length(1);
    expect(kanHenleggesMenuItem.prop('behandlingIdentifier')).is.eql(behandlingIdentifier);
    expect(kanHenleggesMenuItem.prop('previewHenleggBehandling')).is.eql(previewCallback);
    expect(kanHenleggesMenuItem.prop('shelveBehandling')).is.eql(shelveBehandlingCallback);
    expect(kanHenleggesMenuItem.prop('push')).is.eql(pushCallback);
    expect(kanHenleggesMenuItem.prop('toggleBehandlingsmeny')).is.not.null;
  });

  it('skal vise menyvalg "fortsett behandling" men ikke "Sett på vent" og "Kan henlegges" når behandling er satt på vent', () => {
    const wrapper = shallow(<BehandlingMenu
      saksnummer={23}
      behandlingData={new MenyBehandlingData(1, '3', 2, type, true, false, 'enhetsid', 'Enhetsnavn', false)}
      menyKodeverk={kodeverk}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      previewHenleggBehandling={previewCallback}
      rettigheter={rettigheter}
      resumeBehandling={sinon.spy()}
      shelveBehandling={shelveBehandlingCallback}
      nyBehandlendeEnhet={sinon.spy()}
      createNewBehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      erTilbakekrevingAktivert={false}
      setBehandlingOnHold={behandlingOnHoldCallback}
      openBehandlingForChanges={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      push={pushCallback}
      navAnsatt={navAnsatt}
    />);

    expect(wrapper.find('PauseBehandlingMenuItem')).has.length(0);

    const behandlingOnHoldMenuItem = wrapper.find('ResumeBehandlingMenuItem');
    expect(behandlingOnHoldMenuItem).has.length(1);
    expect(behandlingOnHoldMenuItem.prop('behandlingIdentifier')).is.eql(behandlingIdentifier);
    expect(behandlingOnHoldMenuItem.prop('toggleBehandlingsmeny')).is.not.null;
  });


  it('skal vise knapp med lukket-tekst når meny er synlig', () => {
    const wrapper = shallow(<BehandlingMenu
      saksnummer={23}
      behandlingData={behandlingData}
      menyKodeverk={kodeverk}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      previewHenleggBehandling={previewCallback}
      rettigheter={rettigheter}
      resumeBehandling={sinon.spy()}
      shelveBehandling={shelveBehandlingCallback}
      nyBehandlendeEnhet={sinon.spy()}
      createNewBehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      erTilbakekrevingAktivert={false}
      setBehandlingOnHold={behandlingOnHoldCallback}
      openBehandlingForChanges={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      push={pushCallback}
      navAnsatt={navAnsatt}
    />);

    wrapper.setState({ menuVisible: true });

    const messages = wrapper.find('FormattedMessage');
    expect(messages).has.length(2);
    expect(messages.last().prop('id')).is.eql('Behandlingsmeny.Close');
  });

  it('skal vise knapp med åpne-tekst når meny ikke er synlig', () => {
    const wrapper = shallow(<BehandlingMenu
      saksnummer={23}
      behandlingData={behandlingData}
      menyKodeverk={kodeverk}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      previewHenleggBehandling={previewCallback}
      rettigheter={rettigheter}
      resumeBehandling={sinon.spy()}
      shelveBehandling={shelveBehandlingCallback}
      nyBehandlendeEnhet={sinon.spy()}
      createNewBehandling={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      erTilbakekrevingAktivert={false}
      setBehandlingOnHold={behandlingOnHoldCallback}
      openBehandlingForChanges={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      push={pushCallback}
      navAnsatt={navAnsatt}
    />);

    wrapper.setState({ menuVisible: false });

    const messages = wrapper.find('FormattedMessage');
    expect(messages).has.length(2);
    expect(messages.last().prop('id')).is.eql('Behandlingsmeny.Open');
  });
});
