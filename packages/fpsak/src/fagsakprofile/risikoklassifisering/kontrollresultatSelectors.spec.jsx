import { expect } from 'chai';

import {
    getRisikoaksjonspunkt, getReadOnly,
} from './kontrollresultatSelectors';

describe('<kontrollresultatSelectors>', () => {
  it('skal returnere korrekt aksjonspunkt i en liste med mange', () => {
    const aksjonspunkter = [
        {
            definisjon: {
                kode: '5555',
            },
        },
        {
            definisjon: {
                kode: '8756',
            },
        },
        {
            definisjon: {
                kode: '5095',
            },
        },
    ];
    const res = getRisikoaksjonspunkt.resultFunc(aksjonspunkter);
    const expectedRes = {
        definisjon: {
            kode: '5095',
        },
    };
    expect(res).is.deep.equal(expectedRes);
  });

  it('skal ikke returnere undefined når vi ikke har noen aksjonspunkter', () => {
    const res = getRisikoaksjonspunkt.resultFunc(undefined);
    expect(res).is.deep.equal(undefined);
  });

  it('skal returnere readOnly når saken er på vent', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: true,
        },
    };
    const navAnsatt = {
        kanSaksbehandle: true,
    };
    const erPaaVentMap = {
        123: true,
    };
    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, erPaaVentMap, 123);
    expect(res).is.eql(true);
  });

  it('skal returnere readOnly når saksbehandler ikke har skrivetilgang', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: true,
        },
    };
    const navAnsatt = {
        kanSaksbehandle: false,
    };
    const erPaaVentMap = {
        123: false,
    };
    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, erPaaVentMap, 123);
    expect(res).is.eql(true);
  });

  it('skal returnere readOnly når write access ikke er enabled', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: false,
        },
    };
    const navAnsatt = {
        kanSaksbehandle: true,
    };
    const erPaaVentMap = {
        123: false,
    };
    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, erPaaVentMap, 123);
    expect(res).is.eql(true);
  });

  it('skal ikke returnere readOnly når korrekt sak ikke er på vent men andre er', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: true,
        },
    };
    const navAnsatt = {
        kanSaksbehandle: true,
    };
    const erPaaVentMap = {
        123: false,
        321: true,
    };
    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, erPaaVentMap, 123);
    expect(res).is.eql(false);
  });
});
