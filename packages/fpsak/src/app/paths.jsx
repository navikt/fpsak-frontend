import { buildPath, formatQueryString, parseQueryString } from 'utils/urlUtils';
import skjermlenkeCodes from 'kodeverk/skjermlenkeCodes';

export const fagsakPath = '/fagsak/:saksnummer(\\d+)/';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingId(\\d+)/`;

export const pathToFagsak = saksnummer => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = saksnummer => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer, behandlingId) => buildPath(behandlingPath, { saksnummer, behandlingId });
export const pathToMissingPage = () => '/404';

const emptyQueryString = queryString => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

const getLocationWithQueryParams = (location, queryParams) => ({ ...location, search: updateQueryParams(location.search, queryParams) });

export const getSupportPanelLocationCreator = location => supportPanel => getLocationWithQueryParams(location, { stotte: supportPanel });
export const getBehandlingspunktLocation = location => behandlingspunkt => getLocationWithQueryParams(location, { punkt: behandlingspunkt });
export const getFaktaLocation = location => fakta => getLocationWithQueryParams(location, { fakta });

export const DEFAULT_FAKTA = 'default';
export const DEFAULT_BEHANDLINGSPROSESS = 'default';

export const getLocationWithDefaultBehandlingspunktAndFakta = location => (
  getLocationWithQueryParams(location, { punkt: DEFAULT_BEHANDLINGSPROSESS, fakta: DEFAULT_FAKTA })
);

export const createLocationForHistorikkItems = (behandlingLocation, skjermlenkeCode) => {
  const skjermlenke = skjermlenkeCodes[skjermlenkeCode];
  return getLocationWithQueryParams(behandlingLocation, { punkt: skjermlenke.punktNavn, fakta: skjermlenke.faktaNavn });
};
