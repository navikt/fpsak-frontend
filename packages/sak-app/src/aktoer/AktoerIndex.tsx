import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

import { Fagsak, FagsakPerson } from '@fpsak-frontend/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import AktoerGrid from './components/AktoerGrid';
import useTrackRouteParam from '../app/useTrackRouteParam';
import { useRestApi, FpsakApiKeys } from '../data/fpsakApiNyUtenRedux';

type Aktoer = {
  fagsaker: Fagsak[];
  person: FagsakPerson;
};

/**
 * AktoerIndex
 */
const AktoerIndex: FunctionComponent = () => {
  const { selected: selectedAktoerId } = useTrackRouteParam({
    paramName: 'aktoerId',
    parse: (aktoerIdFromUrl) => Number.parseInt(aktoerIdFromUrl, 10),
    isQueryParam: true,
  });

  const { data, state } = useRestApi<Aktoer>(FpsakApiKeys.AKTOER_INFO, { aktoerId: selectedAktoerId }, { keepData: true });

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  if (data.person) {
    return <AktoerGrid data={data} />;
  }

  return <Normaltekst>{`Ugyldig aktoerId: ${selectedAktoerId}`}</Normaltekst>;
};

export default AktoerIndex;
