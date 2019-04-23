
import { Dispatch } from 'redux';

import fpLosApi from 'data/fpLosApi';

export const fetchNyeOgFerdigstilteOppgaverNokkeltall = (sakslisteId: number) => (dispatch: Dispatch) => dispatch(
  fpLosApi.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER.makeRestApiRequest()(
    { sakslisteId },
  ),
);
export const getNyeOgFerdigstilteOppgaverNokkeltall = fpLosApi.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER.getRestApiData();
