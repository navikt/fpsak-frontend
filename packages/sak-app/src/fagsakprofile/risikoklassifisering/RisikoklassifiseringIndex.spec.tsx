import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';
import { Fagsak, Behandling } from '@fpsak-frontend/types';

import * as useTrackRouteParam from '../../app/useTrackRouteParam';
import { RisikoklassifiseringIndexImpl } from './RisikoklassifiseringIndex';
import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';

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

const fagsak = {
  saksnummer: 123456,
};

const behandling = {
  id: 1,
};

const location = {
  hash: '23',
  pathname: '/test/',
  state: {},
  search: '',
};

const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };

describe('<RisikoklassifiseringIndex>', () => {
  let contextStub;
  beforeEach(() => {
    contextStub = sinon.stub(useTrackRouteParam, 'default').callsFake(() => ({
      selected: true,
      location,
    }));
  });

  afterEach(() => {
    contextStub.restore();
  });

  it('skal rendere komponent', () => {
    requestApi.mock(FpsakApiKeys.NAV_ANSATT, navAnsatt);
    const wrapper = shallow(<RisikoklassifiseringIndexImpl
      fagsak={fagsak as Fagsak}
      alleBehandlinger={[behandling] as Behandling[]}
      kontrollresultat={lagRisikoklassifisering(kontrollresultatKode.HOY)}
      behandlingVersjon={1}
      push={sinon.spy()}
      location={locationMock}
      behandlingId={1}
    />);
    expect(wrapper.find(RisikoklassifiseringSakIndex)).has.length(1);
  });
});
