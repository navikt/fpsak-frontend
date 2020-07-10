import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { FatterVedtakApprovalModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';

import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-totrinnskontroll-fatter-vedtak-modal',
  component: FatterVedtakApprovalModalSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visModalEtterGodkjenning = () => (
  <FatterVedtakApprovalModalSakIndex
    showModal
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={{
      kode: text('Fagsakytelsetype', fagsakYtelseType.FORELDREPENGER),
    }}
    erGodkjenningFerdig
    erKlageWithKA={false}
    behandlingsresultat={{
      type: {
        kode: text('behandlingResultatType', behandlingResultatType.OPPHOR),
      },
    }}
    behandlingId={1}
    behandlingStatusKode={text('Behandlingstatus', behandlingStatus.FATTER_VEDTAK)}
    behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);

export const visModalEtterGodkjenningAvKlage = () => (
  <FatterVedtakApprovalModalSakIndex
    showModal
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={{
      kode: text('Fagsakytelsetype', fagsakYtelseType.FORELDREPENGER),
    }}
    erGodkjenningFerdig
    erKlageWithKA={boolean('erKlageWithKA', false)}
    behandlingsresultat={{
      type: {
        kode: text('behandlingResultatType', behandlingResultatType.OPPHOR),
      },
    }}
    behandlingId={1}
    behandlingStatusKode={text('Behandlingstatus', behandlingStatus.FATTER_VEDTAK)}
    behandlingTypeKode={behandlingType.KLAGE}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);

export const visModalEtterTilbakesendingTilSaksbehandler = () => (
  <FatterVedtakApprovalModalSakIndex
    showModal
    closeEvent={action('button-click')}
    allAksjonspunktApproved={false}
    fagsakYtelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
    }}
    erGodkjenningFerdig
    erKlageWithKA={false}
    behandlingsresultat={{
      type: {
        kode: text('behandlingResultatType', behandlingResultatType.OPPHOR),
      },
    }}
    behandlingId={1}
    behandlingStatusKode={text('Behandlingstatus', behandlingStatus.FATTER_VEDTAK)}
    behandlingTypeKode={text('Behandlingtype', behandlingType.FORSTEGANGSSOKNAD)}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);
