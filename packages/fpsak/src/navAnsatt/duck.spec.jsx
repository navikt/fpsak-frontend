import { expect } from 'chai';

import { ApiStateBuilder } from '@fpsak-frontend/assets/testHelpers/data-test-helper';
import fpsakApi from 'data/fpsakApi';

import { getRettigheter, getNavAnsatt } from './duck';

describe('NAV-ansatt-reducer', () => {
  it('skal hente rettigheter til NAV-ansatt fra state', () => {
    const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };

    const dataState = new ApiStateBuilder()
      .withData(fpsakApi.NAV_ANSATT.name, navAnsatt)
      .withData(fpsakApi.FETCH_FAGSAK.name, {})
      .withData('BEHANDLING', {}, 'dataContextFpsakBehandling')
      .withData('ORIGINAL_BEHANDLING', {}, 'dataContextFpsakBehandling')
      .build();


    const state = {
      default: {
        ...dataState.default,
        fagsak: {
          selectedSaksnummer: 1,
        },
        fpsakBehandling: {
          behandlingId: 1,
        },
        behandling: {
          behandlingInfoHolder: {},
        },
      },
    };
    const rettigheter = getRettigheter(state);

    expect(Object.keys(rettigheter)).to.have.lengthOf.above(0);
    Object.keys(rettigheter)
      .forEach(key => expect(rettigheter).to.have.property(key)
        .that.has.all.keys('employeeHasAccess', 'isEnabled'));
  });

  it('skal hente NAV-ansatt fra state', () => {
    const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };
    const state = new ApiStateBuilder()
      .withData(fpsakApi.NAV_ANSATT.name, navAnsatt)
      .build();
    expect(getNavAnsatt(state)).to.eql(navAnsatt);
  });
});
