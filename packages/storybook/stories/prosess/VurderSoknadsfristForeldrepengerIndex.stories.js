import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VurderSoknadsfristForeldrepengerIndex from '@fpsak-frontend/prosess-soknadsfrist';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const soknad = {
  mottattDato: '2019-01-01',
};

const uttakPeriodeGrense = {
  mottattDato: '2019-01-01',
  antallDagerLevertForSent: 2,
  soknadsperiodeStart: '2019-01-01',
  soknadsperiodeSlutt: '2019-01-10',
  soknadsfristForForsteUttaksdato: '2019-10-01',
};

export default {
  title: 'prosess/prosess-soknadsfrist',
  component: VurderSoknadsfristForeldrepengerIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForSoknadsfrist = () => (
  <VurderSoknadsfristForeldrepengerIndex
    behandling={object('behandling', behandling)}
    uttakPeriodeGrense={object('uttakPeriodeGrense', uttakPeriodeGrense)}
    soknad={object('soknad', soknad)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
    }]}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnly', true)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', true)}
  />
);
