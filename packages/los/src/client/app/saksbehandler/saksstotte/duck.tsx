
import fpLosApi from 'data/fpLosApi';

/* Action creators */
export const fetchBehandledeOppgaver = fpLosApi.BEHANDLEDE_OPPGAVER.makeRestApiRequest();
export const getBehandledeOppgaver = fpLosApi.BEHANDLEDE_OPPGAVER.getRestApiData();
