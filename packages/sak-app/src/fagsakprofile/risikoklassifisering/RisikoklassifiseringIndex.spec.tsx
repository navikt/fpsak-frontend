import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';

import BehandlingIdentifier from '../../behandling/BehandlingIdentifier';
import { RisikoklassifiseringIndexImpl } from './RisikoklassifiseringIndex';

const lagRisikoklassifisering = (kode) => ({
  kontrollresultat: {
    kode,
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

const locationMock = {
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
};

describe('<RisikoklassifiseringIndex>', () => {
  it('skal rendere komponent', () => {
    const wrapper = shallow(<RisikoklassifiseringIndexImpl
      resolveAksjonspunkter={sinon.spy()}
      push={sinon.spy()}
      location={locationMock}
      readOnly={false}
      kontrollresultat={lagRisikoklassifisering(kontrollresultatKode.HOY)}
      isPanelOpen={false}
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(RisikoklassifiseringSakIndex)).has.length(1);
  });
});
