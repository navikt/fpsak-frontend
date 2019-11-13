import { expect } from 'chai';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import getCommonBehandlingSelectors from './commonBehandlingSelectors';

describe('commonBehandlingSelectors', () => {
  const getSelectedBehandlingId = () => 1;
  const behandlingApi = {
    BEHANDLING: {
      getRestApiData: () => () => 'test',
      getRestApiError: () => () => 'test',
    },
  };
  const selectors = getCommonBehandlingSelectors(getSelectedBehandlingId, behandlingApi);

  describe('isBehandlingInSync', () => {
    it('skal vise at behandling er i sync når behandling stemmer med valgt behandlingId', () => {
      const behandlingId = 1;
      const behandling = {
        id: behandlingId,
      };

      const isInSync = selectors.isBehandlingInSync.resultFunc(behandlingId, behandling);

      expect(isInSync).is.true;
    });

    it('skal vise at behandling ikke er i sync når behandling ikke stemmer med valgt behandlingId', () => {
      const originalBehandling = undefined;
      const behandlingId = 1;
      const behandling = {
        id: 2,
      };

      const isInSync = selectors.isBehandlingInSync.resultFunc(behandlingId, behandling, originalBehandling);

      expect(isInSync).is.false;
    });

    it('skal vise feilmelding når task-status er readOnly', () => {
      const behandling = {
        id: 1,
        taskStatus: {
          readOnly: true,
        },
      };
      const behandlingFetchError = undefined;

      const hasFetchError = selectors.hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

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

      const hasFetchError = selectors.hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

      expect(hasFetchError).is.true;
    });

    it('skal ikke vise feilmelding når det ikke har oppstått feil under henting eller task-status ikke er satt', () => {
      const behandling = {
        id: 1,
        taskStatus: undefined,
      };
      const behandlingFetchError = undefined;

      const hasFetchError = selectors.hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

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

      const hasFetchError = selectors.hasReadOnlyBehandling.resultFunc(behandlingFetchError, behandling);

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

      const openAps = selectors.getOpenAksjonspunkter.resultFunc(aksjonspunkter);

      expect(openAps).has.length(1);
      expect(openAps[0].id).is.eql(1);
    });

    it('skal ha åpent aksjonspunkt for kontrollering av revurdering', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
        },
      }];

      const isApOpen = selectors.isKontrollerRevurderingAksjonspunkOpen.resultFunc(openAksjonspunkter);

      expect(isApOpen).is.true;
    });

    it('skal ikke ha åpent aksjonspunkt for kontrollering av revurdering', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
      }];

      const isApOpen = selectors.isKontrollerRevurderingAksjonspunkOpen.resultFunc(openAksjonspunkter);

      expect(isApOpen).is.false;
    });

    it('skal ha behandling som manuelt er satt på vent', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
        },
      }];

      const hasAp = selectors.hasBehandlingManualPaVent.resultFunc(openAksjonspunkter);

      expect(hasAp).is.true;
    });

    it('skal ha behandling som ikke manuelt er satt på vent', () => {
      const openAksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
      }];

      const hasAp = selectors.hasBehandlingManualPaVent.resultFunc(openAksjonspunkter);

      expect(hasAp).is.false;
    });
  });

  describe('vilkår', () => {
    it('skal hente vilkartype-koder fra vilkårene', () => {
      const vilkar = [{
        vilkarType: {
          kode: vilkarType.FODSELSVILKARET_MOR,
        },
      }, {
        vilkarType: {
          kode: vilkarType.MEDLEMSKAPSVILKARET,
        },
      }];

      const vilkarTypeCodes = selectors.getBehandlingVilkarCodes.resultFunc(vilkar);

      expect(vilkarTypeCodes).is.eql([vilkarType.FODSELSVILKARET_MOR, vilkarType.MEDLEMSKAPSVILKARET]);
    });
  });

  describe('isBehandlingStatusReadOnly', () => {
    it('skal sette behandling til readOnly når behandling er lukker', () => {
      const isLukketStatus = true;
      const behandlingPaaVent = false;
      const fetchError = false;

      const isReadOnly = selectors.isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.true;
    });

    it('skal sette behandling til readOnly når behandling er satt på vent', () => {
      const isLukketStatus = false;
      const behandlingPaaVent = true;
      const fetchError = false;

      const isReadOnly = selectors.isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.true;
    });

    it('skal sette behandling til readOnly når det har oppstått feil ved henting av behandling', () => {
      const isLukketStatus = false;
      const behandlingPaaVent = false;
      const fetchError = true;

      const isReadOnly = selectors.isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.true;
    });

    it('skal ikke sette behandling til readOnly når status er opprettett og behandling ikke er satt på vent', () => {
      const isLukketStatus = false;
      const behandlingPaaVent = false;
      const fetchError = false;

      const isReadOnly = selectors.isBehandlingStatusReadOnly.resultFunc(behandlingPaaVent, fetchError, isLukketStatus);

      expect(isReadOnly).is.false;
    });
  });

  describe('getAllMerknaderFraBeslutter', () => {
    it('skal markere de aksjonspunktene som er avvist av beslutter når status er behandling-utredes', () => {
      const status = {
        kode: behandlingStatus.BEHANDLING_UTREDES,
      };
      const aksjonspunkter = [{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
        toTrinnsBehandling: true,
        toTrinnsBehandlingGodkjent: false,
      }, {
        definisjon: {
          kode: aksjonspunktCodes.VURDERE_DOKUMENT,
        },
        toTrinnsBehandling: true,
        toTrinnsBehandlingGodkjent: true,
      }];

      const merknader = selectors.getAllMerknaderFraBeslutter.resultFunc(status, aksjonspunkter);

      expect(merknader).is.eql({
        [aksjonspunktCodes.VURDER_INNSYN]: {
          notAccepted: true,
        },
        [aksjonspunktCodes.VURDERE_DOKUMENT]: {
          notAccepted: false,
        },
      });
    });
  });
});
