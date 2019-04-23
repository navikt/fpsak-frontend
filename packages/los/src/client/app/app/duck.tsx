import { createSelector } from 'reselect';

import fpLosApi from 'data/fpLosApi';

/* Action types */
const SET_AVDELING_ENHET = 'SET_AVDELING_ENHET';
const RESET_AVDELING_ENHET = 'RESET_AVDELING_ENHET';

/* Action creators */
export const setAvdelingEnhet = (avdelingEnhet: string) => ({
  type: SET_AVDELING_ENHET,
  data: avdelingEnhet,
});

export const resetAvdelingEnhet = () => ({
  type: RESET_AVDELING_ENHET,
});

export const fetchAvdelingeneTilAvdelingsleder = fpLosApi.AVDELINGER.makeRestApiRequest();
export const getAvdelingeneTilAvdelingslederResultat = fpLosApi.AVDELINGER.getRestApiData();
export const resetAvdelingeneTilAvdelingslederData = fpLosApi.AVDELINGER.resetRestApi();

/* Reducers */
const initialState = {
  valgtAvdelingEnhet: undefined,
};

interface ActionTsType {
  type: string;
  data?: any;
}
interface StateTsType {
  valgtAvdelingEnhet?: string;
}

export const appReducer = (state: StateTsType = initialState, action: ActionTsType = { type: '' }) => {
  switch (action.type) {
    case SET_AVDELING_ENHET:
      return {
        ...state,
        valgtAvdelingEnhet: action.data,
      };
    case RESET_AVDELING_ENHET:
      return {
        ...state,
        valgtAvdelingEnhet: undefined,
      };
    default:
      return state;
  }
};

/* Selectors */
const getAppContext = state => state.default.appContext;

type NavAnsatt = Readonly<{
  navn: string;
  kanSaksbehandle: boolean;
  kanOppgavestyre: boolean;
  kanBehandleKode6: boolean;
  funksjonellTid: string;
}>;
const NavAnsattDefault = {
  navn: undefined,
  kanSaksbehandle: undefined,
  kanOppgavestyre: undefined,
  kanBehandleKode6: undefined,
  funksjonellTid: undefined,
};

export const getValgtAvdelingEnhet = createSelector([getAppContext], appContext => appContext.valgtAvdelingEnhet);
export const getNavAnsattName = createSelector([fpLosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt.navn);
export const getNavAnsattKanSaksbehandle = createSelector([fpLosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt
  .kanSaksbehandle);
export const getNavAnsattKanOppgavestyre = createSelector([fpLosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt
  .kanOppgavestyre);
export const getNavAnsattKanBehandleKode6 = createSelector([fpLosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt
  .kanBehandleKode6);
export const getFunksjonellTid = createSelector([fpLosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt.funksjonellTid);
export const getFpsakUrl = createSelector([fpLosApi.FPSAK_URL.getRestApiData()], (fpsakUrl: {verdi: undefined }) => fpsakUrl.verdi);
