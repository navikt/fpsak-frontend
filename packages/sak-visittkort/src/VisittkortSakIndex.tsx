import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import {
  Kodeverk, KodeverkMedNavn, Personopplysninger, FamilieHendelseSamling, Fagsak,
} from '@fpsak-frontend/types';

import VisittkortPanel from './components/VisittkortPanel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  fagsak: Fagsak;
  sprakkode: Kodeverk;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  personopplysninger?: Personopplysninger;
  familieHendelse?: FamilieHendelseSamling;
  lenkeTilAnnenPart?: string;
  harTilbakekrevingVerge?: boolean;
}

const VisittkortSakIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  sprakkode,
  alleKodeverk,
  personopplysninger,
  familieHendelse,
  lenkeTilAnnenPart,
  harTilbakekrevingVerge,
}) => (
  <RawIntlProvider value={intl}>
    <VisittkortPanel
      personopplysninger={personopplysninger}
      familieHendelse={familieHendelse}
      lenkeTilAnnenPart={lenkeTilAnnenPart}
      fagsak={fagsak}
      alleKodeverk={alleKodeverk}
      sprakkode={sprakkode}
      harTilbakekrevingVerge={harTilbakekrevingVerge}
    />
  </RawIntlProvider>
);

export default VisittkortSakIndex;
