import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  errorOfType, ErrorTypes, getErrorResponseData,
} from '@fpsak-frontend/rest-api';
import { Fagsak, KodeverkMedNavn } from '@fpsak-frontend/types';
import { RestApiState, useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';

import { pathToFagsak } from '../app/paths';
import { FpsakApiKeys, useRestApiRunner } from '../data/fpsakApi';

interface OwnProps {
  push: (string) => void;
}

const EMPTY_ARRAY = [];

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
const FagsakSearchIndex: FunctionComponent<OwnProps> = ({
  push: pushLocation,
}) => {
  const alleKodeverk = useGlobalStateRestApiData<{[key: string]: [KodeverkMedNavn]}>(FpsakApiKeys.KODEVERK);

  const goToFagsak = (saksnummer) => {
    pushLocation(pathToFagsak(saksnummer));
  };

  const {
    startRequest: searchFagsaker, data: fagsaker = EMPTY_ARRAY, state: sokeStatus, error,
  } = useRestApiRunner<Fagsak[]>(FpsakApiKeys.SEARCH_FAGSAK);

  const searchResultAccessDenied = useMemo(() => (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL)
    ? getErrorResponseData(error)
    : undefined), [error]);

  const sokFerdig = sokeStatus === RestApiState.SUCCESS;

  useEffect(() => {
    if (sokFerdig && fagsaker.length === 1) {
      goToFagsak(fagsaker[0].saksnummer);
    }
  }, [sokFerdig, fagsaker]);

  return (
    <FagsakSokSakIndex
      fagsaker={fagsaker}
      searchFagsakCallback={searchFagsaker}
      searchResultReceived={sokFerdig}
      selectFagsakCallback={(e, saksnummer) => goToFagsak(saksnummer)}
      searchStarted={sokeStatus === RestApiState.LOADING}
      searchResultAccessDenied={searchResultAccessDenied}
      alleKodeverk={alleKodeverk}
    />
  );
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FagsakSearchIndex);
