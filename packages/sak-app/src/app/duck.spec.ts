import { expect } from 'chai';

import { ApiStateBuilder } from '@fpsak-frontend/rest-api-redux';

import fpsakApi from '../data/fpsakApi';
import { getNavAnsatt } from './duck';

describe('App-reducer', () => {
  it('skal hente NAV-ansatt fra state', () => {
    const params = {};
    const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };
    const state = new ApiStateBuilder()
      .withData(fpsakApi.NAV_ANSATT.name, params, navAnsatt)
      .build();
    expect(getNavAnsatt(state)).to.eql(navAnsatt);
  });
});
