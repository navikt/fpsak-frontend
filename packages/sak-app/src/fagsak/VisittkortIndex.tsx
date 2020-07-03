import React, { FunctionComponent, useMemo } from 'react';

import { useRestApi, RestApiState } from '@fpsak-frontend/rest-api-hooks';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, KodeverkMedNavn, Personopplysninger, FamilieHendelseSamling, Fagsak,
} from '@fpsak-frontend/types';

import { pathToAnnenPart } from '../app/paths';
import { FpsakApiKeys } from '../data/fpsakApiNyUtenRedux';

const finnLenkeTilAnnenPart = (annenPartBehandling) => pathToAnnenPart(annenPartBehandling.saksnr.verdi, annenPartBehandling.behandlingId);

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  selectedSaksnummer: number;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  sprakkode?: Kodeverk;
  fagsak?: Fagsak;
  harTilbakekrevingVerge: boolean;
}

interface AnnenPartBehandling {
  saksnr: {
    verdi: string;
  };
  behandlingId: number;
}

const NO_PARAMS = undefined;
const KEEP_DATA = true;

export const VisittkortIndex: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  selectedSaksnummer,
  alleKodeverk,
  sprakkode,
  fagsak,
  harTilbakekrevingVerge,
}) => {
  const oppdaterVedEndringDep = [behandlingId, behandlingVersjon];

  const {
    data: behandlingPersonopplysninger, state: personopplysningerState,
  } = useRestApi<Personopplysninger>(FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER, NO_PARAMS, KEEP_DATA, oppdaterVedEndringDep);
  const {
    data: behandlingFamilieHendelse, state: familieHendelseState,
  } = useRestApi<FamilieHendelseSamling>(FpsakApiKeys.BEHANDLING_FAMILIE_HENDELSE, NO_PARAMS, KEEP_DATA, oppdaterVedEndringDep);
  const {
    data: annenPartBehandling, state: annenPartState,
  } = useRestApi<AnnenPartBehandling>(FpsakApiKeys.ANNEN_PART_BEHANDLING, { saksnummer: selectedSaksnummer }, KEEP_DATA, oppdaterVedEndringDep);

  const lenkeTilAnnenPart = useMemo(() => (annenPartBehandling ? finnLenkeTilAnnenPart(annenPartBehandling) : undefined), [annenPartBehandling]);

  if (personopplysningerState === RestApiState.LOADING || familieHendelseState === RestApiState.LOADING || annenPartState === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <VisittkortSakIndex
      personopplysninger={behandlingPersonopplysninger}
      familieHendelse={behandlingFamilieHendelse}
      lenkeTilAnnenPart={lenkeTilAnnenPart}
      alleKodeverk={alleKodeverk}
      sprakkode={sprakkode}
      fagsak={fagsak}
      harTilbakekrevingVerge={harTilbakekrevingVerge}
    />
  );
};

export default VisittkortIndex;
