import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object, boolean } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';

import withReduxProvider from '../../decorators/withRedux';

const FAGSAK_STATUS_KODEVERK = 'FAGSAK_STATUS';
const FAGSAK_YTELSE_KODEVERK = 'FAGSAK_YTELSE';
const PERSONSTATUS_TYPE_KODEVERK = 'PERSONSTATUS_TYPE';

const fagsaker = [{
  saksnummer: 1,
  sakstype: {
    kode: fagsakYtelseType.FORELDREPENGER,
    kodeverk: FAGSAK_YTELSE_KODEVERK,
  },
  status: {
    kode: fagsakStatus.OPPRETTET,
    kodeverk: FAGSAK_STATUS_KODEVERK,
  },
  barnFodt: '2019-01-01',
  person: {
    navn: 'Espen Utvikler',
    alder: 40,
    personnummer: '123456789',
    erKvinne: false,
    personstatusType: {
      kode: personstatusType.BOSATT,
      kodeverk: PERSONSTATUS_TYPE_KODEVERK,
    },
  },
  opprettet: '2017-08-02T00:54:25.455',
}, {
  saksnummer: 2,
  sakstype: {
    kode: fagsakYtelseType.ENGANGSSTONAD,
    kodeverk: FAGSAK_YTELSE_KODEVERK,
  },
  status: {
    kode: fagsakStatus.OPPRETTET,
    kodeverk: FAGSAK_STATUS_KODEVERK,
  },
  barnFodt: '2019-01-01',
  person: {
    navn: 'Espen Utvikler',
    alder: 40,
    personnummer: '123456789',
    erKvinne: false,
    personstatusType: {
      kode: personstatusType.BOSATT,
      kodeverk: PERSONSTATUS_TYPE_KODEVERK,
    },
  },
  opprettet: '2017-08-02T00:54:25.455',
}];

const alleKodeverk = {
  [kodeverkTyper.FAGSAK_STATUS]: [{
    kode: fagsakStatus.OPPRETTET,
    navn: 'Opprettet',
    kodeverk: FAGSAK_STATUS_KODEVERK,
  }],
  [kodeverkTyper.FAGSAK_YTELSE]: [{
    kode: fagsakYtelseType.FORELDREPENGER,
    navn: 'Foreldrepenger',
    kodeverk: FAGSAK_YTELSE_KODEVERK,
  }, {
    kode: fagsakYtelseType.ENGANGSSTONAD,
    navn: 'Engangsstønad',
    kodeverk: FAGSAK_YTELSE_KODEVERK,
  }],
  [kodeverkTyper.PERSONSTATUS_TYPE]: [{
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
    kodeverk: PERSONSTATUS_TYPE_KODEVERK,
  }],
};

export default {
  title: 'sak/sak-sok',
  component: FagsakSokSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visMeldingerPanel = () => {
  const [visResultat, toggleResultat] = useState(false);
  return (
    <FagsakSokSakIndex
      fagsaker={visResultat ? object('fagsaker', fagsaker) : []}
      searchFagsakCallback={() => toggleResultat(true)}
      searchResultReceived={boolean('searchResultReceived', false)}
      selectFagsakCallback={action('button-click')}
      searchStarted={boolean('searchStarted', false)}
      alleKodeverk={alleKodeverk}
    />
  );
};

export const visSøkDerEnIkkeHarAdgang = () => (
  <FagsakSokSakIndex
    fagsaker={[]}
    searchFagsakCallback={action('button-click')}
    searchResultReceived={boolean('searchResultReceived', false)}
    selectFagsakCallback={action('button-click')}
    searchStarted={boolean('searchStarted', false)}
    searchResultAccessDenied={object('searchResultAccessDenied', {
      feilmelding: 'Har ikke adgang',
    })}
    alleKodeverk={alleKodeverk}
  />
);
