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

  it('skal returnere readOnly når saksbehandler ikke er ansvarlig saksbehandler', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: true,
        },
    };
    const navAnsatt = {
        brukernavn: 'Jonas',
        kanSaksbehandle: true,
    };
    const ansvarligSaksbehandler = 'Jens';

    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, ansvarligSaksbehandler);
    expect(res).is.eql(true);
  });

  it('skal returnere readOnly når saksbehandler ikke har skrivetilgang', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: true,
        },
    };
    const navAnsatt = {
        brukernavn: 'Jonas',
        kanSaksbehandle: false,
    };
    const ansvarligSaksbehandler = 'Jonas';

    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, ansvarligSaksbehandler);
    expect(res).is.eql(true);
  });

  it('skal returnere readOnly når write access ikke er enabled', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: false,
        },
    };
    const navAnsatt = {
        brukernavn: 'Jonas',
        kanSaksbehandle: true,
    };
    const ansvarligSaksbehandler = 'Jonas';

    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, ansvarligSaksbehandler);
    expect(res).is.eql(true);
  });

  it('skal returnere readOnly når write access er enabled, saksbehandler ikke kan saksbehandle og det ikke er valgt en ansvarlig saksbehandler', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: true,
        },
    };
    const navAnsatt = {
        brukernavn: 'Jonas',
        kanSaksbehandle: false,
    };
    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, undefined);
    expect(res).is.eql(true);
  });

  it('skal returnere readOnly når write access er disabled og saksbehandler kan redigere og det ikke er valgt en ansvarlig saksbehandler', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: false,
        },
    };
    const navAnsatt = {
        brukernavn: 'Jonas',
        kanSaksbehandle: true,
    };
    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, undefined);
    expect(res).is.eql(true);
  });

  it('skal returnere ikke readOnly når write access er enabled, saksbehandler kan redigere og det ikke er valgt en ansvarlig saksbehandler', () => {
    const rettigheter = {
        writeAccess: {
            isEnabled: true,
        },
    };
    const navAnsatt = {
        brukernavn: 'Jonas',
        kanSaksbehandle: true,
    };
    const res = getReadOnly.resultFunc(rettigheter, navAnsatt, undefined);
    expect(res).is.eql(false);
  });
});
