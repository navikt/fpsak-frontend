import { expect } from 'chai';

import { behandlingspunktCodes, featureToggle } from '@fpsak-frontend/fp-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import createSvangerskapspengerBpProps from './svangerskapspengerBpDefinition';

describe('Definisjon av behandlingspunkter - Svangerskapspenger', () => {
  const defaultBehandlingspunkter = [{
    apCodes: [],
    code: behandlingspunktCodes.BEREGNINGSGRUNNLAG,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Beregning',
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
    code: behandlingspunktCodes.SIMULERING,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Avregning',
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

  it('skal alltid vise behandlingspunktene for beregning, tilkjent-ytelse og vedtak når det finnes minst ett annet behandlingspunkt', () => {
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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

    expect(bpPropList).to.eql([sokersOpplysningspliktBehandlingspunkt, ...defaultBehandlingspunkter]);
  });

  it('skal ikke vise beregningspunkter for beregning, tilkjent-ytelse og vedtak når det ikke finnes andre behandlingspunkter', () => {
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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

    expect(bpPropList).to.eql([]);
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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });

  it('skal alltid vise behandlingspunktene for beregning, tilkjent-ytelse og vedtak når det finnes minst ett annet behandlingspunkt', () => {
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

    const bpPropList = createSvangerskapspengerBpProps(builderData);

    expect(bpPropList).to.eql([sokersOpplysningspliktBehandlingspunkt, ...defaultBehandlingspunkter]);
  });

  it('skal ikke vise tilkjent ytelse når ingen perioder har tildelt dagsats', () => {
    const resultatstruktur = {
      perioder: [
        {
          status: 'INNVILGET',
          dagsats: 0,
        },
        {
          status: 'INNVILGET',
          dagsats: 0,
        },
        {
          status: 'INNVILGET',
          dagsats: 0,
        },
      ],
    };
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [],
      behandlingsresultat: {},
      stonadskontoer: undefined,
      featureToggles,
      resultatstruktur,
    };

    const bpPropList = createSvangerskapspengerBpProps(builderData);

    expect(bpPropList).to.eql([sokersOpplysningspliktBehandlingspunkt, ...defaultBehandlingspunkter]);
  });

  it('skal vise tilkjent ytelse når minst en periode har tildelt dagsats', () => {
    const resultatstruktur = {
      perioder: [
        {
          status: 'INNVILGET',
          dagsats: 0,
        },
        {
          status: 'INNVILGET',
          dagsats: 0,
        },
        {
          status: 'INNVILGET',
          dagsats: 1,
        },
      ],
    };
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [sokersOpplysningspliktVilkar],
      aksjonspunkter: [],
      behandlingsresultat: {},
      stonadskontoer: undefined,
      featureToggles,
      resultatstruktur,
    };

    const bpPropList = createSvangerskapspengerBpProps(builderData);

    defaultBehandlingspunkter[1].status = vilkarUtfallType.OPPFYLT;

    expect(bpPropList).to.eql([sokersOpplysningspliktBehandlingspunkt, ...defaultBehandlingspunkter]);
  });
});
