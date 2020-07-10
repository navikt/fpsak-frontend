import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import vilkarResultat from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/vilkarResultat';
import sarligGrunn from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/sarligGrunn';
import aktsomhet from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/aktsomhet';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';

import withReduxProvider from '../../../decorators/withRedux';

const perioderForeldelse = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-02-02',
    belop: 1000,
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.IKKE_FORELDET,
      kodeverk: 'FORELDELSE_VURDERING',
    },
  }, {
    fom: '2019-02-03',
    tom: '2019-04-02',
    belop: 3000,
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.FORELDET,
      kodeverk: 'FORELDELSE_VURDERING',
    },
  }],
};

const vilkarvurderingsperioder = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-04-01',
    foreldet: false,
    feilutbetaling: 10,
    hendelseType: {
      kode: 'MEDLEM',
      navn: '§22 Medlemskap',
    },
    redusertBeloper: [],
    ytelser: [{
      aktivitet: 'Arbeidstaker',
      belop: 1050,
    }],
    årsak: {
      hendelseType: {
        kode: 'MEDLEM',
        navn: '§22 Medlemskap',
      },
    },
  }],
  rettsgebyr: 1000,
};
const vilkarvurdering = {
  vilkarsVurdertePerioder: [],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

const alleKodeverk = {
  [tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING]: [{
    kode: foreldelseVurderingType.FORELDET,
    navn: 'Foreldet',
    kodeverk: 'FORELDELSE_VURDERING',
  }, {
    kode: foreldelseVurderingType.IKKE_FORELDET,
    navn: 'Ikke foreldet',
    kodeverk: 'FORELDELSE_VURDERING',
  }, {
    kode: foreldelseVurderingType.TILLEGGSFRIST,
    navn: 'Tilleggsfrist',
    kodeverk: 'FORELDELSE_VURDERING',
  }],
  [tilbakekrevingKodeverkTyper.SARLIG_GRUNN]: [{
    kode: sarligGrunn.GRAD_AV_UAKTSOMHET,
    navn: 'Grad av uaktsomhet',
  }, {
    kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
    navn: 'Helt eller delvis NAVs feil',
  }, {
    kode: sarligGrunn.STOERRELSE_BELOEP,
    navn: 'Størrelse beløp',
  }, {
    kode: sarligGrunn.TID_FRA_UTBETALING,
    navn: 'Tid fra utbetaling',
  }, {
    kode: sarligGrunn.ANNET,
    navn: 'Annet',
  }],
  [tilbakekrevingKodeverkTyper.VILKAR_RESULTAT]: [{
    kode: vilkarResultat.FORSTO_BURDE_FORSTAATT,
    navn: 'Forsto eller burde forstått',
  }, {
    kode: vilkarResultat.FEIL_OPPLYSNINGER,
    navn: 'Feil opplysninger',
  }, {
    kode: vilkarResultat.MANGELFULL_OPPLYSNING,
    navn: 'Mangelfull opplysning',
  }, {
    kode: vilkarResultat.GOD_TRO,
    navn: 'God tro',
  }],
  [tilbakekrevingKodeverkTyper.AKTSOMHET]: [{
    kode: aktsomhet.FORSETT,
    navn: 'Forsett',
  }, {
    kode: aktsomhet.GROVT_UAKTSOM,
    navn: 'Grovt uaktsom',
  }, {
    kode: aktsomhet.SIMPEL_UAKTSOM,
    navn: 'Simpel uaktsom',
  }],
};

export default {
  title: 'prosess/tilbakekreving/prosess-tilbakekreving',
  component: TilbakekrevingProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

const beregnBelop = (params) => {
  const { perioder } = params;
  return Promise.resolve({
    perioder,
  });
};

export const visAksjonspunktForTilbakekreving = () => (
  <TilbakekrevingProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    perioderForeldelse={object('perioderForeldelse', perioderForeldelse)}
    vilkarvurderingsperioder={object('vilkarvurderingsperioder', vilkarvurderingsperioder)}
    vilkarvurdering={object('vilkarvurdering', vilkarvurdering)}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    readOnlySubmitButton={boolean('readOnly', false)}
    navBrukerKjonn={NavBrukerKjonn.KVINNE}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    alleKodeverk={alleKodeverk}
    beregnBelop={(params) => beregnBelop(params)}
  />
);
