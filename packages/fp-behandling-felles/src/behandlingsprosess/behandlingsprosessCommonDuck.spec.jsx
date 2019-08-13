import { expect } from 'chai';

import getBehandlingsprosessRedux from './behandlingsprosessCommonDuck';

const behandlingsprosesRedux = getBehandlingsprosessRedux('reducerName');

describe('Behandlingsprosess-reducer', () => {
  it('skal returnere initial state', () => {
    expect(behandlingsprosesRedux.reducer(undefined, {})).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: undefined,
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal resette behandlingspunkter til opprinnelig state, men ikke selectedBehandlingspunktNavn', () => {
    const manipulertState = {
      overrideBehandlingspunkter: [{ test: 'test' }],
      selectedBehandlingspunktNavn: 'askjlhd',
      resolveProsessAksjonspunkterStarted: true,
      resolveProsessAksjonspunkterSuccess: true,
    };

    expect(behandlingsprosesRedux.reducer(manipulertState, behandlingsprosesRedux.actionCreators.resetBehandlingspunkter())).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: 'askjlhd',
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal sette valgt behandlingspunkt-navn', () => {
    const behandlingspunkt = behandlingsprosesRedux.actionCreators.setSelectedBehandlingspunktNavn('test');

    expect(behandlingsprosesRedux.reducer(undefined, behandlingspunkt)).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: 'test',
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal toggle overstyring av behandlingspunkt', () => {
    const behandlingspunkt = behandlingsprosesRedux.actionCreators.toggleBehandlingspunktOverstyring('test');

    expect(behandlingsprosesRedux.reducer(undefined, behandlingspunkt)).to.eql({
      overrideBehandlingspunkter: ['test'],
      selectedBehandlingspunktNavn: undefined,
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal sette at bekreftelse av aksjonspunkter har startet', () => {
    const behandlingspunkt = behandlingsprosesRedux.actionCreators.resolveProsessAksjonspunkterStarted();

    expect(behandlingsprosesRedux.reducer(undefined, behandlingspunkt)).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: undefined,
      resolveProsessAksjonspunkterStarted: true,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal sette at bekreftelse av aksjonspunkter har ferdig', () => {
    const behandlingspunkt = behandlingsprosesRedux.actionCreators.resolveProsessAksjonspunkterSuccess();

    expect(behandlingsprosesRedux.reducer(undefined, behandlingspunkt)).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: undefined,
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: true,
    });
  });
});
