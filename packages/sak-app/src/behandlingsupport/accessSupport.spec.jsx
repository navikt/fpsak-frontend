import { expect } from 'chai';
import fagsakStatusCode from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { godkjenningsFaneAccess, sendMeldingAccess } from './accessSupport';

const forEachFagsakAndBehandlingStatus = (callback) => (
  Object.values(fagsakStatusCode).forEach((fagsakStatus) => Object.values(behandlingStatusCode)
    .forEach((behandlingStatus) => callback(fagsakStatus, behandlingStatus)))
);

const getTestName = (accessName, expected, fagsakStatus, behandlingStatus) => (
  `skal${expected ? '' : ' ikke'} ha ${accessName} når fagsakStatus er '${fagsakStatus}' og behandlingStatus er '${behandlingStatus}'`
);

describe('accessSupport', () => {
  const saksbehandlerAnsatt = { kanSaksbehandle: true };
  const veilederAnsatt = { kanVeilede: true };

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
