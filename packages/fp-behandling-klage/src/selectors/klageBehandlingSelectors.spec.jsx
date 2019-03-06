import { expect } from 'chai';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  isBehandlingInSync, hasReadOnlyBehandling, getOpenAksjonspunkter,
  isBehandlingInInnhentSoknadsopplysningerSteg, isKontrollerRevurderingAksjonspunkOpen, hasBehandlingManualPaVent,
  isBehandlingStatusReadOnly,
}
  from './klageBehandlingSelectors';

describe('behandlingSelectors', () => {
  describe('isBehandlingInSync', () => {
    it('skal vise at behandling ikke er i sync når behandling ikke stemmer med valgt behandlingId', () => {
      const behandlingId = 1;
      const behandling = {
        id: 2,
      };

      const isInSync = isBehandlingInSync.resultFunc(behandlingId, behandling);

      expect(isInSync).is.false;
    });

    it('skal vise at behandling er i sync når behandling stemmer med valgt behandlingId', () => {
      const behandlingId = 1;
      const behandling = {
        id: 1,
      };

      const isInSync = isBehandlingInSync.resultFunc(behandlingId, behandling);

      expect(isInSync).is.true;
    });
  });


  describe('hasReadOnlyBehandling', () => {
    it('skal vise feilmelding når task-status er readOnly', () => {
      const behandling = {
        id: 1,
        taskStatus: {
          readOnly: true,
        },
      };
      const behandlingFetchError = undefined;

      const hasFetchError = hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

      expect(hasFetchError).is.true;
    });

    it('skal vise feilmelding når det har oppstått feil under henting av behandling', () => {
      const behandling = {
        id: 1,
        taskStatus: {
          readOnly: false,
        },
      };
      const behandlingFetchError = 'Det har oppstått en timeout';

      const hasFetchError = hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

      expect(hasFetchError).is.true;
    });

    it('skal ikke vise feilmelding når det ikke har oppstått feil under henting eller task-status ikke er satt', () => {
      const behandling = {
        id: 1,
        taskStatus: undefined,
      };
      const behandlingFetchError = undefined;

      const hasFetchError = hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

      expect(hasFetchError).is.false;
    });

    it('skal ikke vise feilmelding når det ikke har oppstått feil under henting eller task-status ikke er readonly', () => {
      const behandling = {
        id: 1,
        taskStatus: {
          readOnly: false,
        },
      };
      const behandlingFetchError = undefined;

      const hasFetchError = hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

      expect(hasFetchError).is.false;
    });
  });

  describe('aksjonspunkter', () => {
    it('skal finne åpne aksjonspunkter', () => {
      const aksjonspunkter = [{
        id: 1,
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      }, {
        id: 2,
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
      }];

      const openAps = getOpenAksjonspunkter.resultFunc(aksjonspunkter);

      expect(openAps).has.length(1);
      expect(openAps[0].id).is.eql(1);
    });

    it('skal være i innehent søknadsopplysningersteg når en har registrer papirsøknad aksjonspunkt', () => {
      const aksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD,
        },
      }, {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
      }];

      const isInSteg = isBehandlingInInnhentSoknadsopplysningerSteg.resultFunc(aksjonspunkter);

      expect(isInSteg).is.true;
    });

    it('skal ikke være i innehent søknadsopplysningersteg når en ikke har aktuelle aksjonspunkter', () => {
      const aksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.VURDERE_DOKUMENT,
        },
      }, {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
      }];

      const isInSteg = isBehandlingInInnhentSoknadsopplysningerSteg.resultFunc(aksjonspunkter);

      expect(isInSteg).is.false;
    });

    it('skal ha åpent aksjonspunkt for kontrollering av revurdering', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
        },
      }];

      const isApOpen = isKontrollerRevurderingAksjonspunkOpen.resultFunc(openAksjonspunkter);

      expect(isApOpen).is.true;
    });

    it('skal ikke ha åpent aksjonspunkt for kontrollering av revurdering', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
      }];

      const isApOpen = isKontrollerRevurderingAksjonspunkOpen.resultFunc(openAksjonspunkter);

      expect(isApOpen).is.false;
    });

    it('skal ha behandling som manuelt er satt på vent', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
        },
      }];

      const hasAp = hasBehandlingManualPaVent.resultFunc(openAksjonspunkter);

      expect(hasAp).is.true;
    });

    it('skal ha behandling som ikke manuelt er satt på vent', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
      }];

      const hasAp = hasBehandlingManualPaVent.resultFunc(openAksjonspunkter);

      expect(hasAp).is.false;
    });
  });


  describe('isBehandlingStatusReadOnly', () => {
    it('skal sette behandling til readOnly når behandling er lukker', () => {
      const isLukketStatus = true;
      const behandlingPaaVent = false;
      const fetchError = false;

      const isReadOnly = isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.true;
    });

    it('skal sette behandling til readOnly når behandling er satt på vent', () => {
      const isLukketStatus = false;
      const behandlingPaaVent = true;
      const fetchError = false;

      const isReadOnly = isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.true;
    });

    it('skal sette behandling til readOnly når det har oppstått feil ved henting av behandling', () => {
      const isLukketStatus = false;
      const behandlingPaaVent = false;
      const fetchError = true;

      const isReadOnly = isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.true;
    });

    it('skal ikke sette behandling til readOnly når status er opprettett og behandling ikke er satt på vent', () => {
      const isLukketStatus = false;
      const behandlingPaaVent = false;
      const fetchError = false;

      const isReadOnly = isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.false;
    });
  });
});
