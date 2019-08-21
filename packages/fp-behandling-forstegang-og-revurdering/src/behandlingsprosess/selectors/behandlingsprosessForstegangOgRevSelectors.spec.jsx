import { expect } from 'chai';

import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import as from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';

import { getBehandlingspunkterProps } from './behandlingsprosessForstegangOgRevSelectors';

describe('behandlingsprosessForstegangOgRevSelectors', () => {
  it('skal opprette default behandlingspunkter og for aksjonspunkt varsel revurdering for engangsstønad', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.ENGANGSSTONAD,
    };
    const behandlingType = {
      kode: BehandlingType.FORSTEGANGSSOKNAD,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VARSEL_REVURDERING_MANUELL,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {};
    const vilkar = [];
    const resultatstruktur = {};
    const stonadskontoer = {};
    const featureToggles = {};
    const uttaksresultat = {};
    const simuleringResultat = {};

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, vilkar, aksjonspunkter, behandlingsresultat,
      resultatstruktur, stonadskontoer, featureToggles, uttaksresultat, simuleringResultat);

    expect(bpProps).is.eql([{
      apCodes: [ac.VARSEL_REVURDERING_MANUELL],
      code: bpc.VARSEL,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.CheckVarselRevurdering',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.BEREGNING,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Beregning',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.SIMULERING,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Avregning',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.VEDTAK,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Vedtak',
      vilkarene: [],
    }]);
  });

  it('skal opprette default behandlingspunkter og for aksjonspunkt avklar personstatus for foreldrepenger', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.FORELDREPENGER,
    };
    const behandlingType = {
      kode: BehandlingType.FORSTEGANGSSOKNAD,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.AVKLAR_PERSONSTATUS,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {};
    const vilkar = [];
    const resultatstruktur = {
      perioder: [],
    };
    const stonadskontoer = {};
    const featureToggles = {};
    const uttaksresultat = {};
    const simuleringResultat = {};

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, vilkar, aksjonspunkter, behandlingsresultat,
      resultatstruktur, stonadskontoer, featureToggles, uttaksresultat, simuleringResultat);

    expect(bpProps).is.eql([{
      apCodes: [ac.AVKLAR_PERSONSTATUS],
      code: bpc.SAKSOPPLYSNINGER,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Saksopplysninger',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.BEREGNINGSGRUNNLAG,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Beregning',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.UTTAK,
      isVisible: true,
      status: vilkarUtfallType.IKKE_OPPFYLT,
      titleCode: 'Behandlingspunkt.Uttak',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.TILKJENT_YTELSE,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.TilkjentYtelse',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.SIMULERING,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Avregning',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.VEDTAK,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Vedtak',
      vilkarene: [],
    }]);
  });
});
