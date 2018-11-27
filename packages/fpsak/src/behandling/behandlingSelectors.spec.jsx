import { expect } from 'chai';

import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import soknadType from 'kodeverk/soknadType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import vilkarType from 'kodeverk/vilkarType';
import behandlingType from 'kodeverk/behandlingType';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import {
  isBehandlingInSync, getSelectedBehandlingIdentifier, hasReadOnlyBehandling, getOpenAksjonspunkter, getToTrinnsAksjonspunkter,
  isBehandlingInInnhentSoknadsopplysningerSteg, isKontrollerRevurderingAksjonspunkOpen, hasBehandlingManualPaVent,
  getAktivitetStatuser, getAlleAndelerIForstePeriode, isBehandlingRevurderingFortsattMedlemskap, getBehandlingLanguageCode,
  getBehandlingVilkarCodes, isBehandlingStatusReadOnly, getEditedStatus, getAllMerknaderFraBeslutter, getMerknaderFraBeslutter,
  getAntallDodfodteBarn,
}
  from './behandlingSelectors';

describe('behandlingSelectors', () => {
  describe('isBehandlingInSync', () => {
    it('skal vise at behandling er i sync når behandling stemmer med valgt behandlingId og original behandling ikke finnes', () => {
      const originalBehandling = undefined;
      const behandlingId = 1;
      const behandling = {
        id: behandlingId,
      };

      const isInSync = isBehandlingInSync.resultFunc(behandlingId, behandling, originalBehandling);

      expect(isInSync).is.true;
    });

    it('skal vise at behandling er i sync når behandling stemmer med valgt behandlingId og original behandling er hentet', () => {
      const originalBehandling = {
        id: 1,
      };
      const behandlingId = 2;
      const behandling = {
        id: behandlingId,
        originalBehandlingId: originalBehandling.id,
      };

      const isInSync = isBehandlingInSync.resultFunc(behandlingId, behandling, originalBehandling);

      expect(isInSync).is.true;
    });

    it('skal vise at behandling ikke er i sync når behandling ikke stemmer med valgt behandlingId', () => {
      const originalBehandling = undefined;
      const behandlingId = 1;
      const behandling = {
        id: 2,
      };

      const isInSync = isBehandlingInSync.resultFunc(behandlingId, behandling, originalBehandling);

      expect(isInSync).is.false;
    });

    it('skal vise at behandling ikke er i sync når original behandling ikke er hentet', () => {
      const originalBehandling = undefined;
      const behandlingId = 2;
      const behandling = {
        id: behandlingId,
        originalBehandlingId: 1,
      };

      const isInSync = isBehandlingInSync.resultFunc(behandlingId, behandling, originalBehandling);

      expect(isInSync).is.false;
    });
  });

  describe('getSelectedBehandlingIdentifier', () => {
    it('skal hente behandlingIdentifier når behandling er valgt', () => {
      const saksnummer = 2;
      const behandlingId = 1;

      const behandlingIdentifier = getSelectedBehandlingIdentifier.resultFunc(behandlingId, saksnummer);

      expect(behandlingIdentifier.behandlingId).is.eql(behandlingId);
      expect(behandlingIdentifier.saksnummer).is.eql(saksnummer);
    });

    it('skal ikke hente behandlingIdentifier når behandling ikke er valgt', () => {
      const saksnummer = 2;
      const behandlingId = undefined;

      const behandlingIdentifier = getSelectedBehandlingIdentifier.resultFunc(behandlingId, saksnummer);

      expect(behandlingIdentifier).is.undefined;
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

    it('skal finne totrinns-aksjonspunkter', () => {
      const aksjonspunkter = [{
        id: 1,
        toTrinnsBehandling: true,
      }, {
        id: 2,
        toTrinnsBehandling: false,
      }];

      const totrinnsAps = getToTrinnsAksjonspunkter.resultFunc(aksjonspunkter);

      expect(totrinnsAps).has.length(1);
      expect(totrinnsAps[0].id).is.eql(1);
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
          kode: aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING,
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

  describe('beregningsgrunnlag', () => {
    it('skal finne aktivitetsstatus-koder', () => {
      const beregningsgrunnlag = {
        aktivitetStatus: [
          {
            kode: aktivitetStatus.ARBEIDSTAKER,
          },
          {
            kode: aktivitetStatus.FRILANSER,
          },
        ],
      };

      const statuser = getAktivitetStatuser.resultFunc(beregningsgrunnlag);
      const codes = statuser.map(status => status.kode);
      expect(codes).is.eql([aktivitetStatus.ARBEIDSTAKER, aktivitetStatus.FRILANSER]);
    });

    it('skal finne status og andeler i beregningsgrunnlaget', () => {
      const beregningsgrunnlag = {
        beregningsgrunnlagPeriode: [{
          beregningsgrunnlagPrStatusOgAndel: [{
            id: 1,
          }, {
            id: 2,
          }],
        }],
      };

      const statusOgAndeler = getAlleAndelerIForstePeriode.resultFunc(beregningsgrunnlag);

      expect(statusOgAndeler).is.eql(beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel);
    });
  });

  describe('medlem', () => {
    it('skal ha medlemskap og revuderingsbehandling', () => {
      const type = {
        kode: behandlingType.REVURDERING,
      };
      const medlem = {
        fom: '2018-10-10',
      };

      const isRevurdering = isBehandlingRevurderingFortsattMedlemskap.resultFunc(type, medlem);

      expect(isRevurdering).is.true;
    });

    it('skal ikke ha medlemskap', () => {
      const type = {
        kode: behandlingType.REVURDERING,
      };
      const medlem = {};

      const isRevurdering = isBehandlingRevurderingFortsattMedlemskap.resultFunc(type, medlem);

      expect(isRevurdering).is.false;
    });
  });

  describe('personopplysninger', () => {
    it('skal hente antall dødfødte barn markert av fødselsnummer', () => {
      const barn = [{
        fnr: '2342300001',
      }, {
        fnr: '2342323233',
      }, {
        fnr: '2342302341',
      }];

      const nr = getAntallDodfodteBarn.resultFunc(barn);

      expect(nr).is.eql(1);
    });
  });

  describe('språk', () => {
    it('skal hente språktekst fra behandlingens språk-kode', () => {
      const sprakkode = {
        kode: 'NN',
      };

      const languageCode = getBehandlingLanguageCode.resultFunc(sprakkode);

      expect(languageCode).is.eql('Malform.Nynorsk');
    });

    it('skal hente standard språktekst når behandlingens ikke har språk-kode', () => {
      const sprakkode = undefined;
      const languageCode = getBehandlingLanguageCode.resultFunc(sprakkode);
      expect(languageCode).is.eql('Malform.Bokmal');
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

      const vilkarTypeCodes = getBehandlingVilkarCodes.resultFunc(vilkar);

      expect(vilkarTypeCodes).is.eql([vilkarType.FODSELSVILKARET_MOR, vilkarType.MEDLEMSKAPSVILKARET]);
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

  describe('getEditedStatus', () => {
    it('skal markere at termindato er endret', () => {
      const soknad = {
        soknadType: {
          kode: soknadType.FODSEL,
        },
        fodselsdatoer: {
          0: '2018-01-01',
        },
        termindato: '2018-01-01',
      };
      const familiehendelse = {
        termindato: '2018-01-02',
      };
      const personopplysning = {
        id: 1,
        barnSoktFor: [],
      };
      const annenPartPersonopplysning = {
        id: 2,
      };

      const editedFields = getEditedStatus.resultFunc(soknad, familiehendelse, personopplysning, annenPartPersonopplysning);

      expect(editedFields.termindato).is.true;
    });

    it('skal markere at termindato ikke er endret', () => {
      const soknad = {
        soknadType: {
          kode: soknadType.FODSEL,
        },
        fodselsdatoer: {
          0: '2018-01-01',
        },
        termindato: '2018-01-01',
      };
      const familiehendelse = {
        termindato: '2018-01-01',
      };
      const personopplysning = {
        id: 1,
        barnSoktFor: [],
      };
      const annenPartPersonopplysning = {
        id: 2,
      };

      const editedFields = getEditedStatus.resultFunc(soknad, familiehendelse, personopplysning, annenPartPersonopplysning);

      expect(editedFields.termindato).is.false;
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

      const merknader = getAllMerknaderFraBeslutter.resultFunc(status, aksjonspunkter);

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

  describe('getMerknaderFraBeslutter', () => {
    it('skal hente merknad fra beslutter for ett bestemt aksjonspunkt', () => {
      const allMerknaderFraBeslutter = {
        [aksjonspunktCodes.VURDER_INNSYN]: {
          notAccepted: true,
        },
        [aksjonspunktCodes.VURDERE_DOKUMENT]: {
          notAccepted: false,
        },
      };

      const notAccepted = getMerknaderFraBeslutter(aksjonspunktCodes.VURDER_INNSYN).resultFunc(allMerknaderFraBeslutter);

      expect(notAccepted).is.eql(allMerknaderFraBeslutter[aksjonspunktCodes.VURDER_INNSYN]);
    });
  });
});
