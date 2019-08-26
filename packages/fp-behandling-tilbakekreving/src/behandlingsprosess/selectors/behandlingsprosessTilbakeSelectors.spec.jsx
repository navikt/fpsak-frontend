import { expect } from 'chai';

import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import as from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';

import ac from '../../kodeverk/tilbakekrevingAksjonspunktCodes';
import VedtakResultatType from '../../kodeverk/vedtakResultatType';
import { getBehandlingspunkterProps } from './behandlingsprosessTilbakeSelectors';

describe('behandlingsprosessTilbakeSelectors', () => {
  it('skal opprette behandlingspunkter for foreldelse, tilbakekreving og vedtak når en har desse aksjonspunktene', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.FORELDREPENGER,
    };
    const behandlingType = {
      kode: BehandlingType.TILBAKEKREVING,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_FORELDELSE,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }, {
      definisjon: {
        kode: ac.VURDER_TILBAKEKREVING,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {
      vedtakResultatType: {
        kode: VedtakResultatType.INGEN_TILBAKEBETALING,
      },
    };
    const foreldelseResultat = {};
    const vilkar = [];

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, vilkar, aksjonspunkter, foreldelseResultat, behandlingsresultat);

    expect(bpProps).is.eql([{
      apCodes: [ac.VURDER_FORELDELSE],
      code: bpc.FORELDELSE,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Foreldelse',
      vilkarene: [],
    }, {
      apCodes: [ac.VURDER_TILBAKEKREVING],
      code: bpc.TILBAKEKREVING,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Tilbakekreving',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.VEDTAK,
      isVisible: true,
      status: vilkarUtfallType.IKKE_OPPFYLT,
      titleCode: 'Behandlingspunkt.Vedtak',
      vilkarene: [],
    }]);
  });
});
