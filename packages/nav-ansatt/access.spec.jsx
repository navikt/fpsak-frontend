import { expect } from 'chai';
import fagsakStatusCode from 'kodeverk/fagsakStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingStatusCode from 'kodeverk/behandlingStatus';
import BehandlingType from 'kodeverk/behandlingType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import {
  byttBehandlendeEnhetAccess,
  gjenopptaBehandlingAccess,
  godkjenningsFaneAccess,
  henleggBehandlingAccess,
  kanOverstyreAccess,
  opneBehandlingForEndringerAccess,
  opprettNyForstegangsBehandlingAccess,
  opprettRevurderingAccess,
  sendMeldingAccess,
  settBehandlingPaVentAccess,
  writeAccess,
} from './access';

const forEachFagsakAndBehandlingStatus = callback => (
  Object.values(fagsakStatusCode).forEach(fagsakStatus => Object.values(behandlingStatusCode)
    .forEach(behandlingStatus => callback(fagsakStatus, behandlingStatus)))
);

const getTestName = (accessName, expected, fagsakStatus, behandlingStatus) => (
  `skal${expected ? '' : ' ikke'} ha ${accessName} når fagsakStatus er '${fagsakStatus}' og behandlingStatus er '${behandlingStatus}'`
);

describe('access', () => {
  const saksbehandlerAnsatt = { kanSaksbehandle: true };
  const veilederAnsatt = { kanVeilede: true };

  describe('writeAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha skrivetilgang', () => {
      const accessForSaksbehandler = writeAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert skrivetilgang', () => {
      const accessForVeileder = writeAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('skrivetilgang', expected, fagsakStatus, behandlingStatus), () => {
        const access = writeAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('henleggBehandlingAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til henlegge behandling', () => {
      const accessForSaksbehandler = henleggBehandlingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til henlegge behandling', () => {
      const accessForVeileder = henleggBehandlingAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til henlegge behandling', expected, fagsakStatus, behandlingStatus), () => {
        const access = henleggBehandlingAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('settBehandlingPaVentAccess når behandling har søknad', () => {
    const behandling = {
      id: 1,
      versjon: 123,
      aksjonspunkter: [],
      type: {
        kode: '',
        navn: '',
      },
      status: {
        kode: behandlingStatusCode.BEHANDLING_UTREDES,
        navn: '',
      },
      fagsakId: 1,
      opprettet: '15.10.2017',
      soknad: {
        soknadType: {
          kode: 'test',
          navn: '',
        },
      },
      vilkar: [{
        vilkarType: {
          kode: '1',
          navn: '',
        },
        avslagKode: '2',
        lovReferanse: '§ 22-13, 2. ledd',
      }],
      behandlingPaaVent: false,
    };

    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES, behandlingStatusCode.FORESLA_VEDTAK];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til å sette behandling på vent', () => {
      const accessForSaksbehandler = settBehandlingPaVentAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus, behandling);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å sette behandling på vent', () => {
      const accessForVeileder = settBehandlingPaVentAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus, behandling);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å sette behandling på vent', expected, fagsakStatus, behandlingStatus), () => {
        const access = settBehandlingPaVentAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus }, behandling);

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('saksbehandler skal ha tilgang til å sette behandling på vent når aksjonspunkt er REGISTRER_PAPIRSOKNAD', () => {
    const behandling = {
      id: 1,
      versjon: 123,
      aksjonspunkter: [
        {
          id: 0,
          definisjon: {
            kode: aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD,
            navn: 'Registrer papirsøknad engangsstønad',
          },
          status: {
            kode: 'OPPR',
            navn: 'Opprettet',
          },
        },
      ],
      type: {
        kode: '',
        navn: '',
      },
      soknad: [],
      status: {
        kode: behandlingStatusCode.BEHANDLING_UTREDES,
        navn: '',
      },
      fagsakId: 1,
      opprettet: '15.10.2017',
      behandlingPaaVent: false,
    };

    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES, behandlingStatusCode.FORESLA_VEDTAK];
    const validBehandlingStatus = { kode: validBehandlingStatuser[1] };

    it('saksbehandler skal ha tilgang til å sette behandling på vent når aksjonspunkt er REGISTRER_PAPIRSOKNAD', () => {
      const accessForSaksbehandler = settBehandlingPaVentAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus, behandling);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å sette behandling på vent', () => {
      const accessForVeileder = settBehandlingPaVentAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus, behandling);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å sette behandling på vent', expected, fagsakStatus, behandlingStatus), () => {
        const access = settBehandlingPaVentAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus }, behandling);

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('saksbehandler skal ha tilgang til å sette behandling på vent når det er behandling av klage', () => {
    const behandling = {
      fagsakId: 1000001,
      id: 2,
      aksjonspunkter: [],
      status: {
        kode: behandlingStatusCode.BEHANDLING_UTREDES,
        navn: 'Behandling utredes',
      },
      type: {
        kode: BehandlingType.KLAGE,
        navn: 'Klage',
      },
      beregningResultat: null,
      opprettet: '2017-09-19 15:32:58',
    };

    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES, behandlingStatusCode.FORESLA_VEDTAK];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til å sette behandling på vent når det er behandling av klage', () => {
      const accessForSaksbehandler = settBehandlingPaVentAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus, behandling);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å sette behandling på vent', () => {
      const accessForVeileder = settBehandlingPaVentAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus, behandling);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å sette behandling på vent', expected, fagsakStatus, behandlingStatus), () => {
        const access = settBehandlingPaVentAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus }, behandling);

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });


  describe('byttBehandlendeEnhetAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til å bytte behandlende enhet', () => {
      const accessForSaksbehandler = byttBehandlendeEnhetAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å bytte behandlende enhet', () => {
      const accessForVeileder = byttBehandlendeEnhetAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å bytte behandlende enhet', expected, fagsakStatus, behandlingStatus), () => {
        const access = byttBehandlendeEnhetAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('opprettRevurderingAccess - Foreldrepenger', () => {
    const validFagsakStatuser = [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING, fagsakStatusCode.LOPENDE, fagsakStatusCode.AVSLUTTET];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.IVERKSETTER_VEDTAK, behandlingStatusCode.AVSLUTTET];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    const fagsakKanikkeOppretteRevurdering = { kanRevurderingOpprettes: false };
    const fagsakKanOppretteRevurdering = { kanRevurderingOpprettes: true, sakstype: { kode: fagsakYtelseType.FORELDREPENGER } };

    it('saksbehandler skal ha tilgang til å opprette revurdering', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus, fagsakKanOppretteRevurdering);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler skal ha tilgang til å opprette revurdering hvis fagsaktilstand tillater det', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus, fagsakKanikkeOppretteRevurdering);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til å opprette revurdering', () => {
      const accessForVeileder = opprettRevurderingAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus, fagsakKanOppretteRevurdering);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å opprette revurdering', expected, fagsakStatus, behandlingStatus), () => {
        const access = opprettRevurderingAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus }, fagsakKanOppretteRevurdering);
        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('opprettRevurderingAccess - Engangsstønad', () => {
    const validFagsakStatuser = [fagsakStatusCode.AVSLUTTET];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.IVERKSETTER_VEDTAK, behandlingStatusCode.AVSLUTTET];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    const fagsakKanikkeOppretteRevurdering = { kanRevurderingOpprettes: false };
    const fagsakKanOppretteRevurdering = { kanRevurderingOpprettes: true, sakstype: { kode: fagsakYtelseType.ENGANGSSTONAD } };

    it('saksbehandler skal ha tilgang til å opprette revurdering', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus, fagsakKanOppretteRevurdering);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler skal ha tilgang til å opprette revurdering hvis fagsaktilstand tillater det', () => {
      const accessForSaksbehandler = opprettRevurderingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus, fagsakKanikkeOppretteRevurdering);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til å opprette revurdering', () => {
      const accessForVeileder = opprettRevurderingAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus, fagsakKanOppretteRevurdering);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å opprette revurdering', expected, fagsakStatus, behandlingStatus), () => {
        const access = opprettRevurderingAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus }, fagsakKanOppretteRevurdering);
        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });


  describe('opprettNyForstegangsBehandlingAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.AVSLUTTET];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.AVSLUTTET];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til å opprette ny førstegangsbehandling', () => {
      const accessForSaksbehandler = opprettNyForstegangsBehandlingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å opprette ny førstegangsbehandling', () => {
      const accessForVeileder = opprettNyForstegangsBehandlingAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å opprette ny førstegangsbehandling', expected, fagsakStatus, behandlingStatus), () => {
        const access = opprettNyForstegangsBehandlingAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('gjenopptaBehandlingAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    it('saksbehandler skal ha tilgang til å gjenoppta behandling', () => {
      const accessForSaksbehandler = gjenopptaBehandlingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('veileder skal ikke ha aktivert tilgang til å gjenoppta behandling', () => {
      const accessForVeileder = gjenopptaBehandlingAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å gjenoppta behandling', expected, fagsakStatus, behandlingStatus), () => {
        const access = gjenopptaBehandlingAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('opneBehandlingForEndringerAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    const foreldrepengerFagsak = { sakstype: { kode: fagsakYtelseType.FORELDREPENGER } };

    it('saksbehandler skal ha tilgang til å åpne behandling for endringer når behandlingstype er revurdering', () => {
      const behandlingType = {
        kode: BehandlingType.REVURDERING,
      };
      const accessForSaksbehandler = opneBehandlingForEndringerAccess(behandlingType, saksbehandlerAnsatt, validFagsakStatus,
        validBehandlingStatus, foreldrepengerFagsak);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler skal ikke ha tilgang til å åpne behandling for endringer når behandlingstype er ulik revurdering', () => {
      const behandlingType = {
        kode: BehandlingType.KLAGE,
      };
      const accessForSaksbehandler = opneBehandlingForEndringerAccess(behandlingType, saksbehandlerAnsatt, validFagsakStatus,
        validBehandlingStatus, foreldrepengerFagsak);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('saksbehandler skal ikke ha tilgang til å åpne behandling for endringer når sakstype er engangsstønad', () => {
      const engangsstonadFagsak = { sakstype: { kode: fagsakYtelseType.ENGANGSSTONAD } };
      const behandlingType = {
        kode: BehandlingType.REVURDERING,
      };
      const accessForSaksbehandler = opneBehandlingForEndringerAccess(behandlingType, saksbehandlerAnsatt, validFagsakStatus,
        validBehandlingStatus, engangsstonadFagsak);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const behandlingType = {
        kode: BehandlingType.REVURDERING,
      };
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å åpne behandling for endringer', expected, fagsakStatus, behandlingStatus), () => {
        const access = opneBehandlingForEndringerAccess(behandlingType, saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus },
          foreldrepengerFagsak);

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('kanOverstyreAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.BEHANDLING_UTREDES];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    const saksbehandlerOgOverstyrerAnsatt = { ...saksbehandlerAnsatt, kanOverstyre: true };
    const veilederOgOverstyrerAnsatt = { ...veilederAnsatt, kanOverstyre: false };

    it('saksbehandler med overstyrer-rolle skal ha tilgang til å overstyre', () => {
      const accessForSaksbehandler = kanOverstyreAccess(saksbehandlerOgOverstyrerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler uten overstyrer-rolle skal ikke ha tilgang til å overstyre', () => {
      const accessForSaksbehandler = kanOverstyreAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', false);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til å overstyre', () => {
      const accessForVeileder = kanOverstyreAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);

      const accessForVeilederOverstyrer = kanOverstyreAccess(veilederOgOverstyrerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeilederOverstyrer).to.have.property('employeeHasAccess', true);
      expect(accessForVeilederOverstyrer).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å overstyre', expected, fagsakStatus, behandlingStatus), () => {
        const access = kanOverstyreAccess(saksbehandlerOgOverstyrerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('godkjenningsFaneAccess', () => {
    const validFagsakStatuser = [fagsakStatusCode.UNDER_BEHANDLING];
    const validFagsakStatus = { kode: validFagsakStatuser[0] };

    const validBehandlingStatuser = [behandlingStatusCode.FATTER_VEDTAK];
    const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

    const saksbehandlerOgBeslutterAnsatt = { ...saksbehandlerAnsatt, kanBeslutte: true };
    const veilederOgBeslutterAnsatt = { ...veilederAnsatt, kanBeslutte: true };

    it('saksbehandler med beslutter-rolle skal ha tilgang til godkjenningsfanen', () => {
      const accessForSaksbehandler = godkjenningsFaneAccess(saksbehandlerOgBeslutterAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', true);
    });

    it('saksbehandler uten beslutter-rolle skal ikke ha tilgang til godkjenningsfanen', () => {
      const accessForSaksbehandler = godkjenningsFaneAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', false);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    it('veileder skal ikke ha aktivert tilgang til godkjenningsfanen', () => {
      const accessForVeileder = godkjenningsFaneAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeileder).to.have.property('employeeHasAccess', true);
      expect(accessForVeileder).to.have.property('isEnabled', false);

      const accessForVeilederOverstyrer = godkjenningsFaneAccess(veilederOgBeslutterAnsatt, validFagsakStatus, validBehandlingStatus);

      expect(accessForVeilederOverstyrer).to.have.property('employeeHasAccess', true);
      expect(accessForVeilederOverstyrer).to.have.property('isEnabled', false);
    });

    it('saksbehandler med beslutter-rolle skal ha tilgang til godkjenningsfanen hvis hen er ansvarlig saksbehandler på behandlingen', () => {
      const beslutterAnsatt = {
        ...saksbehandlerOgBeslutterAnsatt,
        brukernavn: 'beslutter',
      };
      const ansvarligSaksbehandler = 'beslutter';
      const accessForSaksbehandler = godkjenningsFaneAccess(beslutterAnsatt, validFagsakStatus, validBehandlingStatus, ansvarligSaksbehandler);

      expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
      expect(accessForSaksbehandler).to.have.property('isEnabled', false);
    });

    forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
      const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
      it(getTestName('tilgang til å overstyre', expected, fagsakStatus, behandlingStatus), () => {
        const access = godkjenningsFaneAccess(saksbehandlerOgBeslutterAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

        expect(access).to.have.property('isEnabled', expected);
      });
    });
  });

  describe('sendMeldingAccessSelector', () => {
    describe('saksbehandler og veileder', () => {
      const validFagsakStatuser = [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING];
      const validFagsakStatus = { kode: validFagsakStatuser[0] };

      const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
      const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

      it('saksbehandler skal ha tilgang til å sende melding', () => {
        const accessForSaksbehandler = sendMeldingAccess(saksbehandlerAnsatt, validFagsakStatus, validBehandlingStatus);

        expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
        expect(accessForSaksbehandler).to.have.property('isEnabled', true);
      });

      it('veileder skal ikke ha aktivert tilgang til å sende melding', () => {
        const accessForVeileder = sendMeldingAccess(veilederAnsatt, validFagsakStatus, validBehandlingStatus);

        expect(accessForVeileder).to.have.property('employeeHasAccess', true);
        expect(accessForVeileder).to.have.property('isEnabled', false);
      });

      forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
        const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
        it(getTestName('tilgang til å sende melding', expected, fagsakStatus, behandlingStatus), () => {
          const access = sendMeldingAccess(saksbehandlerAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

          expect(access).to.have.property('isEnabled', expected);
        });
      });
    });

    describe('beslutter', () => {
      const saksbehandlerOgBeslutterAnsatt = { ...saksbehandlerAnsatt, kanBeslutte: true };

      const validFagsakStatuser = [fagsakStatusCode.OPPRETTET, fagsakStatusCode.UNDER_BEHANDLING];
      const validFagsakStatus = { kode: validFagsakStatuser[0] };

      const validBehandlingStatuser = [behandlingStatusCode.OPPRETTET, behandlingStatusCode.BEHANDLING_UTREDES];
      const validBehandlingStatus = { kode: validBehandlingStatuser[0] };

      it('saksbehandler med beslutter-rolle skal ha tilgang til å sende melding', () => {
        const accessForSaksbehandler = sendMeldingAccess(saksbehandlerOgBeslutterAnsatt, validFagsakStatus, validBehandlingStatus);

        expect(accessForSaksbehandler).to.have.property('employeeHasAccess', true);
        expect(accessForSaksbehandler).to.have.property('isEnabled', true);
      });

      forEachFagsakAndBehandlingStatus((fagsakStatus, behandlingStatus) => {
        const expected = validFagsakStatuser.includes(fagsakStatus) && validBehandlingStatuser.includes(behandlingStatus);
        it(getTestName('tilgang til å sende melding', expected, fagsakStatus, behandlingStatus), () => {
          const access = sendMeldingAccess(saksbehandlerOgBeslutterAnsatt, { kode: fagsakStatus }, { kode: behandlingStatus });

          expect(access).to.have.property('isEnabled', expected);
        });
      });
    });
  });
});
