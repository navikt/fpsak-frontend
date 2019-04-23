
import { createSelector } from 'reselect';
import { Dispatch } from 'redux';

import fpLosApi from 'data/fpLosApi';

/* Action types */
const SET_SAKSLISTE_ID = 'SET_SAKSLISTE_ID';

/* Action creators */
export const setValgtSakslisteId = (setSakslisteId: number) => ({
  type: SET_SAKSLISTE_ID,
  data: setSakslisteId,
});

export const fetchAlleSakslister = fpLosApi.SAKSLISTE.makeRestApiRequest();
export const getSakslisteResult = fpLosApi.SAKSLISTE.getRestApiData();

export const fetchOppgaverTilBehandling = (sakslisteId: number) => (dispatch: Dispatch) => dispatch(
  fpLosApi.OPPGAVER_TIL_BEHANDLING.makeRestApiRequest()(
    { sakslisteId }, { keepData: false },
  ),
);
export const fetchOppgaverTilBehandlingOppgaver = (sakslisteId: number, oppgaveIder?: string) => (dispatch: Dispatch) => dispatch(
  fpLosApi.OPPGAVER_TIL_BEHANDLING.makeRestApiRequest()(
    oppgaveIder ? { sakslisteId, oppgaveIder } : { sakslisteId }, { keepData: true },
  ),
);
export const getOppgaverTilBehandling = fpLosApi.OPPGAVER_TIL_BEHANDLING.getRestApiData();
export const harOppgaverTilBehandlingTimeout = fpLosApi.OPPGAVER_TIL_BEHANDLING.getRestApiPollingTimeout();

export const fetchReserverteOppgaver = () => (dispatch: Dispatch) => dispatch(
  fpLosApi.RESERVERTE_OPPGAVER.makeRestApiRequest()(
    undefined, { keepData: true },
  ),
);
export const getReserverteOppgaver = fpLosApi.RESERVERTE_OPPGAVER.getRestApiData();

export const reserverOppgave = (oppgaveId: number) => (dispatch: Dispatch) => dispatch(
  fpLosApi.RESERVER_OPPGAVE.makeRestApiRequest()(
    { oppgaveId },
  ),
);

export const hentReservasjonsstatus = (oppgaveId: number) => (dispatch: Dispatch) => dispatch(
  fpLosApi.HENT_RESERVASJONSSTATUS.makeRestApiRequest()(
    { oppgaveId },
  ),
);

export const opphevOppgaveReservasjon = (oppgaveId: number, begrunnelse: string) => (dispatch: Dispatch) => dispatch(
  fpLosApi.OPPHEV_OPPGAVERESERVASJON.makeRestApiRequest()(
    { oppgaveId, begrunnelse },
  ),
);

export const forlengOppgaveReservasjon = (oppgaveId: number) => (dispatch: Dispatch) => dispatch(
  fpLosApi.FORLENG_OPPGAVERESERVASJON.makeRestApiRequest()(
    { oppgaveId },
  ),
);

export const finnSaksbehandler = (brukerIdent: string) => (dispatch: Dispatch) => dispatch(
  fpLosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.makeRestApiRequest()(brukerIdent),
);
export const isSaksbehandlerSokStartet = fpLosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.getRestApiStarted();
export const isSaksbehandlerSokFerdig = fpLosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.getRestApiFinished();
export const getSaksbehandler = fpLosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.getRestApiData();
export const resetSaksbehandler = () => (dispatch: Dispatch) => dispatch(fpLosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.resetRestApi()());

export const flyttReservasjon = (oppgaveId: number, brukerIdent: string, begrunnelse: string) => (dispatch: Dispatch) => dispatch(
  fpLosApi.FLYTT_RESERVASJON.makeRestApiRequest()(
    { oppgaveId, brukerIdent, begrunnelse },
  ),
);

export const fetchSakslistensSaksbehandlere = (sakslisteId: number) => (dispatch: Dispatch) => dispatch(
  fpLosApi.SAKSLISTE_SAKSBEHANDLERE.makeRestApiRequest()(
    { sakslisteId }, { keepData: false },
  ),
);
export const getSakslistensSaksbehandlere = fpLosApi.SAKSLISTE_SAKSBEHANDLERE.getRestApiData();

export const fetchAntallOppgaverForBehandlingsko = (sakslisteId: number) => (dispatch: Dispatch) => dispatch(
  fpLosApi.BEHANDLINGSKO_OPPGAVE_ANTALL.makeRestApiRequest()({ sakslisteId }),
);
export const getAntallOppgaverForBehandlingskoResultat = fpLosApi.BEHANDLINGSKO_OPPGAVE_ANTALL.getRestApiData();


/* Reducers */
const initialState = {
  valgtSakslisteId: undefined,
};

interface ActionTsType {
  type: string;
  data?: any;
}
interface StateTsType {
  valgtSakslisteId?: number;
}

export const behandlingskoerReducer = (state: StateTsType = initialState, action: ActionTsType = { type: '' }) => {
  switch (action.type) {
    case SET_SAKSLISTE_ID:
      return {
        ...state,
        valgtSakslisteId: action.data,
      };
    default:
      return state;
  }
};

/* Selectors */
const getBehandlingskoerContext = state => state.default.behandlingskoerContext;
export const getValgtSakslisteId = createSelector([getBehandlingskoerContext], behandlingskoerContext => behandlingskoerContext.valgtSakslisteId);
