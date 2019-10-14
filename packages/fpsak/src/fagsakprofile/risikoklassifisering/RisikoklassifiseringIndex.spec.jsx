import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';

import { RisikoklassifiseringIndexImpl } from './RisikoklassifiseringIndex';

const lagRisikoklassifisering = (kode) => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

describe('<RisikoklassifiseringIndex>', () => {
  it('skal rendere komponent', () => {
    const wrapper = shallow(<RisikoklassifiseringIndexImpl
      hentKontrollresultat={sinon.spy()}
      resolveAksjonspunkter={sinon.spy()}
      push={sinon.spy()}
      location={{}}
      setRiskPanelOpen={sinon.spy()}
      readOnly={false}
      risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.HOY)}
      isPanelOpen={false}
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(RisikoklassifiseringSakIndex)).has.length(1);
  });
});
