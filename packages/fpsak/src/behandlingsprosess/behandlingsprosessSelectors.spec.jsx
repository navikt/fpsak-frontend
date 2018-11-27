import { expect } from 'chai';

import { DEFAULT_BEHANDLINGSPROSESS } from 'app/paths';
import as from 'kodeverk/aksjonspunktStatus';
import vut from 'kodeverk/vilkarUtfallType';
import ac from 'kodeverk/aksjonspunktCodes';
import vt from 'kodeverk/vilkarType';
import bt from 'kodeverk/behandlingType';
import innsynResultatTypeKV from 'kodeverk/innsynResultatType';
import fyt from 'kodeverk/fagsakYtelseType';

import {
  getBehandlingspunkterProps, getBehandlingspunkter, getBehandlingspunkterStatus, getBehandlingspunkterTitleCodes,
  getBehandlingspunktAksjonspunkter, getBehandlingspunkterWithOpenAksjonspunkter, getDefaultBehandlingspunkt, getSelectedBehandlingspunkt,
  getIsSelectedBehandlingspunktOverridden, getNotAcceptedByBeslutter, getAksjonspunkterOpenStatus, isSelectedBehandlingspunktReadOnly,
  isBehandlingspunktAksjonspunkterSolvable, getBehandlingspunktAksjonspunkterCodes, isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt, isSelectedBehandlingspunktOverrideReadOnly,
}
  from './behandlingsprosessSelectors';

describe('behandlingsprosessSelectors', () => {
  it('skal lage behandlingspunkter for engangsstønad', () => {
    const fagsakYtelseType = {
      kode: fyt.ENGANGSSTONAD,
    };
    const behandlingType = bt.ENDRINGSSOKNAD;
    const vilkar = [{
      vilkarType: {
        kode: vt.OMSORGSVILKARET,
      },
      vilkarStatus: {
        kode: vut.IKKE_VURDERT,
      },
    }];
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {};
    const innsynResultatType = innsynResultatTypeKV.INNVILGET;
    const resultatstruktur = undefined;
    const stonadskontoer = {};

    const props = getBehandlingspunkterProps.resultFunc(
      fagsakYtelseType, behandlingType, vilkar, aksjonspunkter,
      behandlingsresultat, innsynResultatType, resultatstruktur, stonadskontoer,
    );

    expect(props).has.length(4);
    expect(props[0].code).is.eql('behandle_innsyn');
    expect(props[0].apCodes).is.eql(['5037']);
    expect(props[1].code).is.eql('omsorg');
    expect(props[1].vilkarene).is.eql(vilkar);
    expect(props[2].code).is.eql('beregning');
    expect(props[3].code).is.eql('vedtak');
  });

  it('skal hente behandlingspunkt IDer', () => {
    const bpProps = [{
      code: 'behandle_innsyn',
    }, {
      code: 'vedtak',
    }];

    const punktIds = getBehandlingspunkter.resultFunc(bpProps);

    expect(punktIds).is.eql(bpProps.map(p => p.code));
  });

  it('skal hente behandlingspunkt-statuser', () => {
    const bpProps = [{
      code: 'behandle_innsyn',
      status: vut.IKKE_VURDERT,
    }, {
      code: 'vedtak',
      status: vut.OPPFYLT,
    }];
    const overriddenBps = [];

    const statuser = getBehandlingspunkterStatus.resultFunc(bpProps, overriddenBps);

    expect(statuser).is.eql({
      [bpProps[0].code]: bpProps[0].status,
      [bpProps[1].code]: bpProps[1].status,
    });
  });

  it('skal hente behandlingspunkt-statuser', () => {
    const bpProps = [{
      code: 'behandle_innsyn',
      status: vut.IKKE_VURDERT,
    }, {
      code: 'vedtak',
      status: vut.OPPFYLT,
    }];
    const overriddenBps = [];

    const statuser = getBehandlingspunkterStatus.resultFunc(bpProps, overriddenBps);

    expect(statuser).is.eql({
      [bpProps[0].code]: bpProps[0].status,
      [bpProps[1].code]: bpProps[1].status,
    });
  });

  it('skal hente kodene til tekstene som skal vises for behandlingspunktene', () => {
    const bpProps = [{
      code: 'behandle_innsyn',
      titleCode: 'Behandlingspunkt.Innsyn',
    }, {
      code: 'vedtak',
      titleCode: 'Behandlingspunkt.Vedtak',
    }];

    const statuser = getBehandlingspunkterTitleCodes.resultFunc(bpProps);

    expect(statuser).is.eql({
      [bpProps[0].code]: bpProps[0].titleCode,
      [bpProps[1].code]: bpProps[1].titleCode,
    });
  });

  it('skal hente aksjonspunktene til behandlingspunktet', () => {
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }, {
      definisjon: {
        kode: ac.FORESLA_VEDTAK,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingspunktAksjonspunkterNames = {
      behandle_innsyn: [ac.VURDER_INNSYN],
    };

    const statuser = getBehandlingspunktAksjonspunkter.resultFunc(aksjonspunkter, behandlingspunktAksjonspunkterNames);

    expect(Object.keys(statuser)).has.length(1);
    expect(statuser).is.eql({
      behandle_innsyn: [aksjonspunkter[0]],
    });
  });

  it('skal hente behandlingspunkter med åpne og løsbare aksjonspunkter', () => {
    const behandlingspunktAksjonspunkter = {
      behandle_innsyn: [{
        definisjon: {
          kode: ac.VURDER_INNSYN,
        },
        status: {
          kode: as.OPPRETTET,
        },
        kanLoses: true,
      }, {
        definisjon: {
          kode: ac.FORESLA_VEDTAK,
        },
        status: {
          kode: as.OPPRETTET,
        },
        kanLoses: false,
      }],
    };

    const bpsWithOpenAps = getBehandlingspunkterWithOpenAksjonspunkter.resultFunc(behandlingspunktAksjonspunkter);

    expect(bpsWithOpenAps).has.length(1);
    expect(bpsWithOpenAps).is.eql(['behandle_innsyn']);
  });

  it('skal hente første behandlingspunkt med åpent aksjonspunkt', () => {
    const vedtakBehandlingspunkt = {
      code: 'vedtak',
    };
    const bpsWithOpenAps = [{
      code: 'omsorg',
    }];

    const defaultBehandlingspunkt = getDefaultBehandlingspunkt.resultFunc(vedtakBehandlingspunkt, bpsWithOpenAps);

    expect(defaultBehandlingspunkt).is.eql(bpsWithOpenAps[0]);
  });

  it('skal hente vedtaksbehandlingspunkt som default når det ikke finnes åpne aksjonspunkt på andre behandlingspunkt', () => {
    const vedtakBehandlingspunkt = {
      code: 'vedtak',
    };
    const bpsWithOpenAps = [];
    const defaultBehandlingspunkt = getDefaultBehandlingspunkt.resultFunc(vedtakBehandlingspunkt, bpsWithOpenAps);

    expect(defaultBehandlingspunkt).is.eql(vedtakBehandlingspunkt);
  });

  describe('getSelectedBehandlingspunkt', () => {
    it('skal hente valgt behandlingspunkt', () => {
      const selectableBps = ['omsorg', 'vedtak'];
      const defaultBehandlingspunkt = selectableBps[1];
      const selectedBpNavn = selectableBps[0];

      const selectedBehandlingpunkt = getSelectedBehandlingspunkt.resultFunc(selectableBps, defaultBehandlingspunkt, selectedBpNavn);

      expect(selectedBehandlingpunkt).is.eql(selectableBps[0]);
    });

    it('skal hente default behandlingspunkt', () => {
      const selectableBps = ['omsorg', 'vedtak'];
      const defaultBehandlingspunkt = selectableBps[1];
      const selectedBpNavn = DEFAULT_BEHANDLINGSPROSESS;

      const selectedBehandlingpunkt = getSelectedBehandlingspunkt.resultFunc(selectableBps, defaultBehandlingspunkt, selectedBpNavn);

      expect(selectedBehandlingpunkt).is.eql(selectableBps[1]);
    });
  });

  it('skal finne ut at valgt behandlingspunkt er overstyrt', () => {
    const selectedBehandlingspunkt = 'medlem';
    const overriddenBehandlingspunkter = ['omsorg', 'medlem'];
    const isOverridden = getIsSelectedBehandlingspunktOverridden.resultFunc(selectedBehandlingspunkt, overriddenBehandlingspunkter);

    expect(isOverridden).is.true;
  });

  it('skal finne ut at valgt behandlingspunkt ikke er overstyrt', () => {
    const selectedBehandlingspunkt = 'fodsel';
    const overriddenBehandlingspunkter = ['omsorg', 'medlem'];
    const isOverridden = getIsSelectedBehandlingspunktOverridden.resultFunc(selectedBehandlingspunkt, overriddenBehandlingspunkter);

    expect(isOverridden).is.false;
  });

  it('skal se at aksjonspunktene til behandlingspunktet er akseptert av beslutter', () => {
    const selectedBehandlingspunkt = 'medlem';
    const aksjonspunkter = {
      [selectedBehandlingspunkt]: [ac.MEDLEMSKAP, ac.AVKLAR_FORTSATT_MEDLEMSKAP],
    };
    const merknaderFraBeslutter = {
      [ac.MEDLEMSKAP]: {
        notAccepted: true,
      },
      [ac.AVKLAR_FORTSATT_MEDLEMSKAP]: {
        notAccepted: false,
      },
    };

    const isAccepted = getNotAcceptedByBeslutter.resultFunc(selectedBehandlingspunkt, aksjonspunkter, merknaderFraBeslutter);

    expect(isAccepted).is.true;
  });

  it('skal se at aksjonspunktene til behandlingspunktet ikke er akseptert av beslutter', () => {
    const selectedBehandlingspunkt = 'medlem';
    const aksjonspunkter = {
      [selectedBehandlingspunkt]: [ac.MEDLEMSKAP, ac.AVKLAR_FORTSATT_MEDLEMSKAP],
    };
    const merknaderFraBeslutter = {};

    const isAccepted = getNotAcceptedByBeslutter.resultFunc(selectedBehandlingspunkt, aksjonspunkter, merknaderFraBeslutter);

    expect(isAccepted).is.false;
  });

  it('skal ha behandlingspunktstatus markert åpen når minst ett av aksjonspunktene kan løses', () => {
    const behandlingspunktAksjonspunkter = {
      behandle_innsyn: [{
        definisjon: {
          kode: ac.VURDER_INNSYN,
        },
        status: {
          kode: as.OPPRETTET,
        },
        kanLoses: true,
      }, {
        definisjon: {
          kode: ac.FORESLA_VEDTAK,
        },
        status: {
          kode: as.OPPRETTET,
        },
        kanLoses: false,
      }],
    };
    const overriddenBehandlingspunkter = [];

    const aksjonspunkterOpenStatus = getAksjonspunkterOpenStatus.resultFunc(behandlingspunktAksjonspunkter, overriddenBehandlingspunkter);

    expect(aksjonspunkterOpenStatus).is.eql({
      [Object.keys(behandlingspunktAksjonspunkter)[0]]: true,
    });
  });

  it('skal ha behandlingspunktstatus markert lukket når ingen av aksjonspunktene kan løses', () => {
    const behandlingspunktAksjonspunkter = {
      behandle_innsyn: [{
        definisjon: {
          kode: ac.VURDER_INNSYN,
        },
        status: {
          kode: as.OPPRETTET,
        },
        kanLoses: false,
      }, {
        definisjon: {
          kode: ac.FORESLA_VEDTAK,
        },
        status: {
          kode: as.OPPRETTET,
        },
        kanLoses: false,
      }],
    };
    const overriddenBehandlingspunkter = [];

    const aksjonspunkterOpenStatus = getAksjonspunkterOpenStatus.resultFunc(behandlingspunktAksjonspunkter, overriddenBehandlingspunkter);

    expect(aksjonspunkterOpenStatus).is.eql({
      [Object.keys(behandlingspunktAksjonspunkter)[0]]: false,
    });
  });

  describe('isSelectedBehandlingspunktReadOnly', () => {
    it('skal ikke markere behandlingspunkt som readOnly', () => {
      const rettigheter = {
        writeAccess: {
          isEnabled: true,
        },
      };
      const behandlingIsOnHold = false;
      const hasNonActivOrNonOverstyrbar = false;
      const hasFetchError = false;

      const isReadOnly = isSelectedBehandlingspunktReadOnly.resultFunc(rettigheter, behandlingIsOnHold, hasFetchError, hasNonActivOrNonOverstyrbar);

      expect(isReadOnly).is.false;
    });

    it('skal markere behandlingspunkt som readOnly når bruker ikke har skriverettighet', () => {
      const rettigheter = {
        writeAccess: {
          isEnabled: false,
        },
      };
      const behandlingIsOnHold = false;
      const hasFetchError = false;
      const hasNonActivOrNonOverstyrbar = false;

      const isReadOnly = isSelectedBehandlingspunktReadOnly.resultFunc(rettigheter, behandlingIsOnHold, hasFetchError, hasNonActivOrNonOverstyrbar);

      expect(isReadOnly).is.true;
    });

    it('skal markere behandlingspunkt som readOnly når behandling er satt på vent', () => {
      const rettigheter = {
        writeAccess: {
          isEnabled: true,
        },
      };
      const behandlingIsOnHold = true;
      const hasFetchError = false;
      const hasNonActivOrNonOverstyrbar = false;

      const isReadOnly = isSelectedBehandlingspunktReadOnly.resultFunc(rettigheter, behandlingIsOnHold, hasFetchError, hasNonActivOrNonOverstyrbar);

      expect(isReadOnly).is.true;
    });

    it('skal markere behandlingspunkt som readOnly når minst ett av aksjonspunktene ikke er aktive eller vilkar ikke er overstyrbart', () => {
      const rettigheter = {
        writeAccess: {
          isEnabled: true,
        },
      };
      const behandlingIsOnHold = false;
      const hasFetchError = false;
      const hasNonActivOrNonOverstyrbar = true;

      const isReadOnly = isSelectedBehandlingspunktReadOnly.resultFunc(rettigheter, behandlingIsOnHold, hasFetchError, hasNonActivOrNonOverstyrbar);

      expect(isReadOnly).is.true;
    });

    it('skal markere behandlingspunkt som readOnly når det har oppstått en feil ved henting av data', () => {
      const rettigheter = {
        writeAccess: {
          isEnabled: true,
        },
      };
      const behandlingIsOnHold = false;
      const hasFetchError = true;
      const hasNonActivOrNonOverstyrbar = false;

      const isReadOnly = isSelectedBehandlingspunktReadOnly.resultFunc(rettigheter, behandlingIsOnHold, hasFetchError, hasNonActivOrNonOverstyrbar);

      expect(isReadOnly).is.true;
    });
  });

  describe('isSelectedBehandlingspunktOverrideReadOnly', () => {
    it('skal ikke markere behandlingspunkt som readOnly', () => {
      const rettigheter = {
        kanOverstyreAccess: {
          isEnabled: true,
        },
      };
      const hasNonActivOrNonOverstyrbar = false;
      const isBehandlingStatusReadOnly = false;

      const isReadOnly = isSelectedBehandlingspunktOverrideReadOnly.resultFunc(rettigheter, hasNonActivOrNonOverstyrbar, isBehandlingStatusReadOnly);

      expect(isReadOnly).is.false;
    });

    it('skal markere behandlingspunkt som readOnly når bruker ikke har skriverettighet', () => {
      const rettigheter = {
        kanOverstyreAccess: {
          isEnabled: false,
        },
      };
      const isBehandlingStatusReadOnly = false;
      const hasNonActivOrNonOverstyrbar = false;

      const isReadOnly = isSelectedBehandlingspunktOverrideReadOnly.resultFunc(rettigheter, hasNonActivOrNonOverstyrbar, isBehandlingStatusReadOnly);

      expect(isReadOnly).is.true;
    });

    it('skal markere behandlingspunkt som readOnly når behandling er readOnly', () => {
      const rettigheter = {
        kanOverstyreAccess: {
          isEnabled: true,
        },
      };
      const isBehandlingStatusReadOnly = true;
      const hasNonActivOrNonOverstyrbar = false;

      const isReadOnly = isSelectedBehandlingspunktOverrideReadOnly.resultFunc(rettigheter, hasNonActivOrNonOverstyrbar, isBehandlingStatusReadOnly);

      expect(isReadOnly).is.true;
    });

    it('skal markere behandlingspunkt som readOnly når minst ett av aksjonspunktene ikke er aktive eller vilkar ikke er overstyrbart', () => {
      const rettigheter = {
        kanOverstyreAccess: {
          isEnabled: true,
        },
      };
      const isBehandlingStatusReadOnly = false;
      const hasNonActivOrNonOverstyrbar = true;

      const isReadOnly = isSelectedBehandlingspunktOverrideReadOnly.resultFunc(rettigheter, hasNonActivOrNonOverstyrbar, isBehandlingStatusReadOnly);

      expect(isReadOnly).is.true;
    });
  });

  it('skal ha minst ett åpent aksjonspunkt for behandlingspunkt', () => {
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }, {
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.AVSLUTTET,
      },
    }];

    const hasOpenAksjonspunkt = hasBehandlingspunktAtLeastOneOpenAksjonspunkt.resultFunc(aksjonspunkter);

    expect(hasOpenAksjonspunkt).is.true;
  });

  it('skal ikke ha åpne aksjonspunkter for behandlingspunkt', () => {
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.AVSLUTTET,
      },
    }, {
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.AVSLUTTET,
      },
    }];

    const hasOpenAksjonspunkt = hasBehandlingspunktAtLeastOneOpenAksjonspunkt.resultFunc(aksjonspunkter);

    expect(hasOpenAksjonspunkt).is.false;
  });

  it('skal kunne løse aksjonspunkter når minst ett er markert som løsbart', () => {
    const aksjonspunkter = [{
      kanLoses: true,
    }, {
      kanLoses: false,
    }];

    const isSolvable = isBehandlingspunktAksjonspunkterSolvable.resultFunc(aksjonspunkter);

    expect(isSolvable).is.true;
  });

  it('skal ikke kunne løse aksjonspunkter når ingen er markert som løsbare', () => {
    const aksjonspunkter = [{
      kanLoses: false,
    }, {
      kanLoses: false,
    }];

    const isSolvable = isBehandlingspunktAksjonspunkterSolvable.resultFunc(aksjonspunkter);

    expect(isSolvable).is.false;
  });

  it('skal finne aksjonspunktkodene til behandlingspunkt', () => {
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
    }];

    const codes = getBehandlingspunktAksjonspunkterCodes.resultFunc(aksjonspunkter);

    expect(codes).is.eql([ac.VURDER_INNSYN]);
  });

  it('skal være true når status er oppfylt', () => {
    const status = vut.OPPFYLT;
    const isSolvable = true;

    const notSolvableOrVilkarIsOppfylt = isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt.resultFunc(status, isSolvable);

    expect(notSolvableOrVilkarIsOppfylt).is.true;
  });

  it('skal være false når status er avsluttet', () => {
    const status = vut.AVSLUTTET;
    const isSolvable = true;

    const notSolvableOrVilkarIsOppfylt = isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt.resultFunc(status, isSolvable);

    expect(notSolvableOrVilkarIsOppfylt).is.false;
  });
});
