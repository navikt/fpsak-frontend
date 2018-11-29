import { expect } from 'chai';

import { apiState } from '@fpsak-frontend/assets/testHelpers//data-test-helper';
import fpsakApi from 'data/fpsakApi';

import { getRettigheter, getNavAnsatt } from './duck';

describe('NAV-ansatt-reducer', () => {
  it('skal hente rettigheter til NAV-ansatt fra state', () => {
    const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };

    const state = apiState()
      .withData(fpsakApi.NAV_ANSATT.name, navAnsatt);

    const rettigheter = getRettigheter(state);
    expect(Object.keys(rettigheter)).to.have.lengthOf.above(0);
    Object.keys(rettigheter)
      .forEach(key => expect(rettigheter).to.have.property(key)
        .that.has.all.keys('employeeHasAccess', 'isEnabled'));
  });

  it('skal hente NAV-ansatt fra state', () => {
    const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };
    const state = apiState()
      .withData(fpsakApi.NAV_ANSATT.name, navAnsatt);
    expect(getNavAnsatt(state)).to.eql(navAnsatt);
  });
});
