import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import relatertYtelseTilstand from '@fpsak-frontend/kodeverk/src/relatertYtelseTilstand';
import relatertYtelseType from '@fpsak-frontend/kodeverk/src/relatertYtelseType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

const personopplysninger = {
  barn: [],
  navn: 'Espen Utviklar',
  fodselsdato: '2019-01-01',
  fnr: '123456789',
  navBrukerKjonn: {
    kode: navBrukerKjonn.MANN,
  },
  diskresjonskode: {
    kode: diskresjonskodeType.KODE6,
  },
  personstatus: {
    kode: personstatusType.BOSATT,
  },
  harVerge: false,
};
const inntektArbeidYtelse = {
  barnSoktFor: [],
};
const fagsakPerson = {
  barnSoktFor: [],
};
const alleKodeverk = {
  [kodeverkTyper.SIVILSTAND_TYPE]: [{
    kode: sivilstandType.ENKE,
    navn: 'Enke',
  }],
  [kodeverkTyper.PERSONSTATUS_TYPE]: [{
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
  }],
  [kodeverkTyper.RELATERT_YTELSE_TYPE]: [{
    kode: relatertYtelseType.FORELDREPENGER,
    navn: 'Foreldrepenger',
  }],
  [kodeverkTyper.FAGSAK_STATUS]: [{
    kode: fagsakStatus.OPPRETTET,
    navn: 'Opprettet',
  }],
  [kodeverkTyper.RELATERT_YTELSE_TILSTAND]: [{
    kode: relatertYtelseTilstand.LOPENDE,
    navn: 'Løpende',
  }],
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/PersonFaktaIndex',
  component: PersonFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const vis = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.ADOPSJONSVILKARET]);
  return (
    <PersonFaktaIndex
      behandling={behandling}
      personopplysninger={personopplysninger}
      inntektArbeidYtelse={inntektArbeidYtelse}
      fagsakPerson={fagsakPerson}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      featureToggleUtland
      alleKodeverk={alleKodeverk}
    />
  );
};
