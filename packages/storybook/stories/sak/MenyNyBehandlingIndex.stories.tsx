import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import MenyNyBehandlingIndex from '@fpsak-frontend/sak-meny-ny-behandling';

import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-meny-ny-behandling',
  component: MenyNyBehandlingIndex,
  decorators: [withKnobs, withReduxProvider],
};

const behandlingstyper = [{
  kode: behandlingType.FORSTEGANGSSOKNAD,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Førstegangssøknad',
}, {
  kode: behandlingType.REVURDERING,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Revurdering',
}, {
  kode: behandlingType.KLAGE,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Klage',
}, {
  kode: behandlingType.DOKUMENTINNSYN,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Dokumentinnsyn',
}, {
  kode: behandlingType.TILBAKEKREVING,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Tilbakekreving',
}, {
  kode: behandlingType.TILBAKEKREVING_REVURDERING,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Tilbakekreving revurdering',
}, {
  kode: behandlingType.ANKE,
  kodeverk: 'BEHANDLING_TYPE',
  navn: 'Anke',
}];

export const visMenyForÅLageNyBehandling = () => (
  <MenyNyBehandlingIndex
    ytelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: 'YTELSE_TYPE',
    }}
    saksnummer={123}
    behandlingId={1}
    behandlingVersjon={2}
    behandlingType={{
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    }}
    lagNyBehandling={action('button-click')}
    behandlingstyper={behandlingstyper}
    tilbakekrevingRevurderingArsaker={[]}
    revurderingArsaker={[{
      kode: behandlingArsakType.KLAGE_U_INNTK,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Klage uten inntekt',
    }, {
      kode: behandlingArsakType.FØDSEL,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Fødsel',
    }]}
    opprettNyForstegangsBehandlingEnabled
    opprettRevurderingEnabled
    kanTilbakekrevingOpprettes={{
      kanBehandlingOpprettes: false,
      kanRevurderingOpprettes: false,
    }}
    erTilbakekrevingAktivert={false}
    sjekkOmTilbakekrevingKanOpprettes={action('button-click')}
    sjekkOmTilbakekrevingRevurderingKanOpprettes={action('button-click')}
    lukkModal={action('button-click')}
  />
);

export const visMenyForÅLageNyTilbakekrevingsbehandling = () => (
  <MenyNyBehandlingIndex
    ytelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: 'YTELSE_TYPE',
    }}
    saksnummer={123}
    behandlingId={1}
    behandlingVersjon={2}
    behandlingType={{
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    }}
    lagNyBehandling={action('button-click')}
    behandlingstyper={behandlingstyper}
    tilbakekrevingRevurderingArsaker={[{
      kode: behandlingArsakType.RE_KLAGE_KA,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Klage KA',
    }, {
      kode: behandlingArsakType.RE_KLAGE_NFP,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Klage NFP',
    }]}
    revurderingArsaker={[{
      kode: behandlingArsakType.KLAGE_U_INNTK,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Klage uten inntekt',
    }, {
      kode: behandlingArsakType.FØDSEL,
      kodeverk: 'BEHANDLING_ARSAK_TYPE',
      navn: 'Fødsel',
    }]}
    opprettNyForstegangsBehandlingEnabled
    opprettRevurderingEnabled
    kanTilbakekrevingOpprettes={{
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    }}
    erTilbakekrevingAktivert
    sjekkOmTilbakekrevingKanOpprettes={action('button-click')}
    sjekkOmTilbakekrevingRevurderingKanOpprettes={action('button-click')}
    lukkModal={action('button-click')}
  />
);
