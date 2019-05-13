import { expect } from 'chai';

import { featureToggle, behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import createForeldrepengerBpProps from './foreldrepengerBpDefinition';

describe('Definisjon av behandlingspunkter - Foreldrepenger', () => {
  const defaultBehandlingspunkter = [{
    apCodes: [],
    code: behandlingspunktCodes.BEREGNINGSGRUNNLAG,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Beregning',
    vilkarene: [],
  }, {
    apCodes: [],
    code: behandlingspunktCodes.UTTAK,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Uttak',
    vilkarene: [],
  }, {
    apCodes: [],
    code: behandlingspunktCodes.TILKJENT_YTELSE,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.TilkjentYtelse',
    vilkarene: [],
  }, {
    apCodes: [],
    code: behandlingspunktCodes.VEDTAK,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Vedtak',
    vilkarene: [],
  }];

  const sokersOpplysningspliktVilkar = {
    vilkarType: {
      kode: vilkarType.SOKERSOPPLYSNINGSPLIKT,
    },
    vilkarStatus: {
      kode: vilkarUtfallType.IKKE_VURDERT,
    },
  };

  const sokersOpplysningspliktBehandlingspunkt = {
    apCodes: [],
    code: behandlingspunktCodes.OPPLYSNINGSPLIKT,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Opplysningsplikt',
    vilkarene: [sokersOpplysningspliktVilkar],
  };

  const featureToggles = {
    [featureToggle.LØPENDE_MEDLESMKAP]: false,
    [featureToggle.SIMULER_OPPDRAG]: false,
  };

  it('skal alltid vise behandlingspunktene for beregning, uttak, tilkjent-ytelse og vedtak når det finnes minst ett annet behandlingspunkt', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([sokersOpplysningspliktBehandlingspunkt, ...defaultBehandlingspunkter]);
  });

  it('skal ikke vise beregningspunkter for beregning, uttak, tilkjent-ytelse og vedtak når det ikke finnes andre behandlingspunkter', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });

  it('skal vise behandlingspunkt for opplysningsplikt når en har dette vilkåret', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([{
      apCodes: [],
      code: behandlingspunktCodes.OPPLYSNINGSPLIKT,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Opplysningsplikt',
      vilkarene: [builderData.vilkar[0]],
    }, ...defaultBehandlingspunkter]);
  });

  it('skal ikke vise behandlingspunkt for opplysningsplikt når en har aksjonspunkt men ikke vilkåret', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [{
        definisjon: {
          kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      }],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });

  it('skal vise behandlingspunkt som oppfylt når vilkåret for opplysningsplikt er satt til oppfylt', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [{
        vilkarType: {
          kode: vilkarType.SOKERSOPPLYSNINGSPLIKT,
        },
        vilkarStatus: {
          kode: vilkarUtfallType.OPPFYLT,
        },
      }],
      aksjonspunkter: [],
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.INNVILGET,
        },
      },
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    // Burde eigentleg behandlingspunkt for vedtak ha status OPPFYLT her?
    expect(bpPropList).to.eql([{
      apCodes: [],
      code: behandlingspunktCodes.OPPLYSNINGSPLIKT,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Opplysningsplikt',
      vilkarene: [builderData.vilkar[0]],
    }, defaultBehandlingspunkter[0], defaultBehandlingspunkter[1], defaultBehandlingspunkter[2], {
      apCodes: [],
      code: behandlingspunktCodes.VEDTAK,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Vedtak',
      vilkarene: [],
    }]);
  });

  it('skal vise status oppfylt for behandlingspunktet uttak når det finnes perioder i uttaksresultat', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
      uttaksresultat: {
        perioderSøker: [{
          periodeResultatType: {
            kode: 'INNVILGET',
          },
        }],
      },
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([sokersOpplysningspliktBehandlingspunkt, defaultBehandlingspunkter[0], {
      apCodes: [],
      code: behandlingspunktCodes.UTTAK,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Uttak',
      vilkarene: [],
    }, defaultBehandlingspunkter[2], defaultBehandlingspunkter[3]]);
  });

  it('skal vise status oppfylt for behandlingspunktet tilkjent ytelse når det finnes perioder i resultatstrukturen og en har stønadskontoer', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [],
      behandlingsresultat: {},
      resultatstruktur: {
        perioder: [{
          fomDato: '2018-10-10',
          dagsats: 1200,
        }],
      },
      stonadskontoer: {},
      featureToggles,
      uttaksresultat: {
        perioderSøker: [{
          periodeResultatType: {
            kode: 'INNVILGET',
          },
        }],
      },
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPENGER,
      },
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([sokersOpplysningspliktBehandlingspunkt, defaultBehandlingspunkter[0], {
      apCodes: [],
      code: behandlingspunktCodes.UTTAK,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Uttak',
      vilkarene: [],
    }, {
      apCodes: [],
      code: behandlingspunktCodes.TILKJENT_YTELSE,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.TilkjentYtelse',
      vilkarene: [],
    }, defaultBehandlingspunkter[3]]);
  });

  it('skal ikke vise behandlingspunkt for søkers opplysningsplikt når behandling er revurdering og manuelt aksjonspunkt ikke er opprettet', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.REVURDERING,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });

  it('skal vise behandlingspunkt for søkers opplysningsplikt når behandling er revurdering og en har manuelt aksjonspunkt', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.REVURDERING,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [{
        definisjon: {
          kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      }],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    const newSokersOpplysningspliktBehandlingspunkt = {
      ...sokersOpplysningspliktBehandlingspunkt,
      apCodes: [aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU],
    };
    expect(bpPropList).to.eql([newSokersOpplysningspliktBehandlingspunkt, ...defaultBehandlingspunkter]);
  });

  it('skal ikke vise behandlingspunkt for søkers opplysningsplikt når behandling ikke har vilkar', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.REVURDERING,
      },
      vilkar: [],
      aksjonspunkter: [],
      behandlingsresultat: {},
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });
});
