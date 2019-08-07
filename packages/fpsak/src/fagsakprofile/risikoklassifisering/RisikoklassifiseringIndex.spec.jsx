import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import kontrollresultatKode from '@fpsak-frontend/kodeverk/src/kontrollresultatKode';

import { RisikoklassifiseringIndexImpl } from './RisikoklassifiseringIndex';
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
      readOnly
      harHentetKontrollresultat
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
      readOnly
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
      readOnly
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
      readOnly
      harHentetKontrollresultat
    />);
    expect(wrapper.find(ManglendeKlassifiseringPanel)).has.length(0);
    expect(wrapper.find(IngenRisikoPanel)).has.length(0);
    expect(wrapper.find(HoyRisikoTittel)).has.length(1);
  });
});
