import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';

import withReduxProvider from '../../../decorators/withRedux';

const alleKodeverk = require('../../mocks/alleKodeverk.json'); // eslint-disable-line

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
    readOnly={boolean('readOnly', false)}
    apCodes={[aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING]}
    readOnlySubmitButton={boolean('readOnly', false)}
    navBrukerKjonn={NavBrukerKjonn.KVINNE}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    alleKodeverk={alleKodeverk}
    beregnBelop={(params) => beregnBelop(params)}
  />
);
