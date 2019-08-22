import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import kontrollresultatKode from '@fpsak-frontend/kodeverk/src/kontrollresultatKode';

import { RisikoklassifiseringIndexImpl, erReadOnly } from './RisikoklassifiseringIndex';
import ManglendeKlassifiseringPanel from './components/ManglendeKlassifiseringPanel';
import IngenRisikoPanel from './components/IngenRisikoPanel';
import HoyRisikoTittel from './components/HoyRisikoTittel';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

const lagNavansatt = kanSaksbehandle => ({
  brukernavn: 'testy',
  kanSaksbehandle,
});

const lagRettigheter = isEnabled => ({
  writeAccess: {
    isEnabled,
  },
});

const lagBehandling = erPaaVent => ({
  erPaaVent,
});

describe('<RisikoklassifiseringIndex>', () => {
  it('skal rendere korrekt komponent når det mangler klassifisering', () => {
    const wrapper = shallow(<RisikoklassifiseringIndexImpl
      risikoklassifisering={undefined}
      push={sinon.spy()}
      location={{}}
      isRiskPanelOpen
      setRiskPanelOpen={sinon.spy()}
      hentKontrollresultat={sinon.spy()}
      resolveAksjonspunkter={sinon.spy()}
      isPanelOpen={false}
      harHentetKontrollresultat
      selectedBehandling={lagBehandling(false)}
      rettigheter={lagRettigheter(true)}
      navAnsatt={lagNavansatt(true)}
    />);
    expect(wrapper.find(ManglendeKlassifiseringPanel)).has.length(1);
    expect(wrapper.find(IngenRisikoPanel)).has.length(0);
    expect(wrapper.find(HoyRisikoTittel)).has.length(0);
  });

  it('skal rendere korrekt komponent når det ikke er utfør klassifisering', () => {
    const wrapper = shallow(<RisikoklassifiseringIndexImpl
      risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.IKKE_KLASSIFISERT)}
      push={sinon.spy()}
      location={{}}
      isRiskPanelOpen
      setRiskPanelOpen={sinon.spy()}
      hentKontrollresultat={sinon.spy()}
      resolveAksjonspunkter={sinon.spy()}
      isPanelOpen={false}
      selectedBehandling={lagBehandling(false)}
      rettigheter={lagRettigheter(true)}
      navAnsatt={lagNavansatt(true)}
      harHentetKontrollresultat
    />);
    expect(wrapper.find(ManglendeKlassifiseringPanel)).has.length(1);
    expect(wrapper.find(IngenRisikoPanel)).has.length(0);
    expect(wrapper.find(HoyRisikoTittel)).has.length(0);
  });

  it('skal rendere korrekt komponent når det er ikke_hoy resultat', () => {
    const wrapper = shallow(<RisikoklassifiseringIndexImpl
      risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.IKKE_HOY)}
      push={sinon.spy()}
      location={{}}
      isRiskPanelOpen
      setRiskPanelOpen={sinon.spy()}
      hentKontrollresultat={sinon.spy()}
      resolveAksjonspunkter={sinon.spy()}
      isPanelOpen={false}
      selectedBehandling={lagBehandling(false)}
      rettigheter={lagRettigheter(true)}
      navAnsatt={lagNavansatt(true)}
      harHentetKontrollresultat
    />);
    expect(wrapper.find(ManglendeKlassifiseringPanel)).has.length(0);
    expect(wrapper.find(IngenRisikoPanel)).has.length(1);
    expect(wrapper.find(HoyRisikoTittel)).has.length(0);
  });

  it('skal rendere korrekt komponent når det er hoy resultat', () => {
    const wrapper = shallow(<RisikoklassifiseringIndexImpl
      risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.HOY)}
      push={sinon.spy()}
      location={{}}
      isRiskPanelOpen
      setRiskPanelOpen={sinon.spy()}
      hentKontrollresultat={sinon.spy()}
      resolveAksjonspunkter={sinon.spy()}
      isPanelOpen={false}
      selectedBehandling={lagBehandling(false)}
      rettigheter={lagRettigheter(true)}
      navAnsatt={lagNavansatt(true)}
      harHentetKontrollresultat
    />);
    expect(wrapper.find(ManglendeKlassifiseringPanel)).has.length(0);
    expect(wrapper.find(IngenRisikoPanel)).has.length(0);
    expect(wrapper.find(HoyRisikoTittel)).has.length(1);
  });

  it('skal ikke være readOnly når saksbehandler kan saksbehandle, behandling ikke er på vent og writeAccess er enabled', () => {
    const readOnly = erReadOnly(lagBehandling(false), lagRettigheter(true), lagNavansatt(true));
    expect(readOnly).to.eql(false);
  });

  it('skal være readOnly når saksbehandler kan saksbehandle, behandling ikke er på vent og writeAccess er disabled', () => {
    const readOnly = erReadOnly(lagBehandling(false), lagRettigheter(false), lagNavansatt(true));
    expect(readOnly).to.eql(true);
  });

  it('skal være readOnly når saksbehandler kan saksbehandle, behandling er på vent og writeAccess er enabled', () => {
    const readOnly = erReadOnly(lagBehandling(true), lagRettigheter(true), lagNavansatt(true));
    expect(readOnly).to.eql(true);
  });

  it('skal være readOnly når saksbehandler ikke kan saksbehandle, behandling ikke er på vent og writeAccess er enabled', () => {
    const readOnly = erReadOnly(lagBehandling(false), lagRettigheter(true), lagNavansatt(false));
    expect(readOnly).to.eql(true);
  });
});
