import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';

import withReduxProvider from '../../../decorators/withRedux';

import alleKodeverk from '../../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingPaaVent: false,
};

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.VURDER_INNSYN,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
  },
  begrunnelse: undefined,
}];

export default {
  title: 'prosess/innsyn/prosess-innsyn',
  component: InnsynProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForVurderingAvInnsyn = () => (
  <InnsynProsessIndex
    behandling={behandling}
    innsyn={object('innsyn', {
      dokumenter: [],
      vedtaksdokumentasjon: [{
        dokumentId: '1',
        tittel: behandlingType.FORSTEGANGSSOKNAD,
        opprettetDato: '2019-01-01',
      }],
    })}
    saksnummer={123434}
    aksjonspunkter={aksjonspunkter}
    alleDokumenter={[{
      journalpostId: '2',
      dokumentId: '3',
      tittel: 'Dette er et dokument',
      tidspunkt: '2017-08-02T00:54:25.455',
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isSubmittable={boolean('isSubmittable', true)}
  />
);
