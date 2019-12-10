import { buildPath, formatQueryString, parseQueryString } from '@fpsak-frontend/utils';

const FPSAK = 'fpsak';
const FPLOS = 'fplos';

export const fagsakPath = '/fagsak/:saksnummer/';
export const aktoerPath = '/aktoer/:aktoerId(\\d+)';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingId(\\d+)/`;

export const pathToFagsak = (saksnummer) => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = (saksnummer) => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer, behandlingId) => buildPath(behandlingPath, { saksnummer, behandlingId });
export const pathToMissingPage = () => '/404';

const emptyQueryString = (queryString) => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

export const getLocationWithQueryParams = (location, queryParams) => ({
  ...location,
  search: updateQueryParams(location.search, queryParams),
});

export const getSupportPanelLocationCreator = (location) => (supportPanel) => getLocationWithQueryParams(location, { stotte: supportPanel });
export const getBehandlingspunktLocation = (location) => (behandlingspunkt) => getLocationWithQueryParams(location, { punkt: behandlingspunkt });
export const getFaktaLocation = (location) => (fakta) => getLocationWithQueryParams(location, { fakta });
export const getRiskPanelLocationCreator = (location) => (isRiskPanelOpen) => getLocationWithQueryParams(location, { risiko: isRiskPanelOpen });

export const DEFAULT_FAKTA = 'default';
export const DEFAULT_BEHANDLINGSPROSESS = 'default';

export const getLocationWithDefaultBehandlingspunktAndFakta = (location) => getLocationWithQueryParams(location, { punkt: DEFAULT_BEHANDLINGSPROSESS, fakta: DEFAULT_FAKTA });

export const getPathToFplos = (href) => {
  const hostAndContextPath = href.substr(0, href.lastIndexOf(FPSAK) + FPSAK.length);
  return hostAndContextPath.replace(new RegExp(FPSAK, 'g'), FPLOS);
};
