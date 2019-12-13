import React, { useState } from 'react';
import {
  withKnobs, object, number, boolean,
} from '@storybook/addon-knobs';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingVelgerSakIndex from '@fpsak-frontend/sak-behandling-velger';

import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

import alleKodeverk from '../mocks/alleKodeverk.json';

const BEHANDLING_TYPE_KODEVERK = 'BEHANDLING_TYPE';
const BEHANDLING_STATUS_KODEVERK = 'BEHANDLING_STATUS';

const behandlinger = [{
  id: 1,
  versjon: 2,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  },
  status: {
    kode: behandlingStatus.AVSLUTTET,
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  },
  fagsakId: 3,
  opprettet: '2017-08-02T00:54:25.455',
  avsluttet: '2017-08-03T00:54:25.455',
  endret: '2017-08-03T00:54:25.455',
  behandlendeEnhetId: '4812',
  behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
  links: [],
  gjeldendeVedtak: false,
  behandlingsresultat: {
    type: {
      kode: 'AVSLÅTT',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
    },
  },
}, {
  id: 2,
  versjon: 2,
  type: {
    kode: behandlingType.DOKUMENTINNSYN,
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  },
  status: {
    kode: behandlingStatus.OPPRETTET,
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  },
  fagsakId: 3,
  opprettet: '2017-08-02T00:54:25.455',
  avsluttet: '2017-08-03T00:54:25.455',
  endret: '2017-08-03T00:54:25.455',
  behandlendeEnhetId: '4812',
  behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
  links: [],
  gjeldendeVedtak: true,
  behandlingsresultat: {
    type: {
      kode: 'INNVILGET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
    },
  },
}, {
  id: 3,
  versjon: 2,
  type: {
    kode: behandlingType.REVURDERING,
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  },
  status: {
    kode: behandlingStatus.OPPRETTET,
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  },
  fagsakId: 3,
  opprettet: '2017-08-02T00:54:25.455',
  behandlendeEnhetId: '4812',
  behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
  links: [],
  gjeldendeVedtak: false,
  førsteÅrsak: {
    behandlingArsakType: {
      kode: 'RE-ENDR-BER-GRUN',
    },
    erAutomatiskRevurdering: true,
    manueltOpprettet: true,
  },
}, {
  id: 4,
  versjon: 2,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  },
  status: {
    kode: behandlingStatus.AVSLUTTET,
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  },
  fagsakId: 3,
  opprettet: '2017-08-02T00:54:25.455',
  avsluttet: '2017-08-03T00:54:25.455',
  endret: '2017-08-03T00:54:25.455',
  behandlendeEnhetId: '4812',
  behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
  links: [],
  gjeldendeVedtak: false,
  behandlingsresultat: {
    type: {
      kode: 'HENLAGT_SØKNAD_TRUKKET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
    },
  },
}];

export default {
  title: 'sak/sak-behandling-velger',
  component: BehandlingVelgerSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visPanelForValgAvBehandlinger = () => {
  const [visAlle, toggleVisAlle] = useState(false);
  return (
    <div style={{ width: '600px' }}>
      <BehandlingVelgerSakIndex
        behandlinger={object('behandlinger', behandlinger)}
        saksnummer={1}
        noExistingBehandlinger={boolean('noExistingBehandlinger', false)}
        behandlingId={number('behandlingId', 1)}
        showAll={visAlle}
        toggleShowAll={() => toggleVisAlle(!visAlle)}
        alleKodeverk={alleKodeverk}
      />
    </div>
  );
};
