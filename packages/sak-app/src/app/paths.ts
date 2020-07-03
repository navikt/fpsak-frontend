import { Location } from 'history';

import { buildPath, formatQueryString, parseQueryString } from '@fpsak-frontend/utils';
import { skjermlenkeCodes } from '@fpsak-frontend/konstanter';

const FPSAK = 'fpsak';
const FPLOS = 'fplos';

export const fagsakPath = '/fagsak/:saksnummer(\\d+)/';
export const aktoerPath = '/aktoer/:aktoerId(\\d+)';
export const behandlingerPath = `${fagsakPath}behandling/`;
export const behandlingPath = `${behandlingerPath}:behandlingId(\\d+)/`;

export const pathToFagsak = (saksnummer) => buildPath(fagsakPath, { saksnummer });
export const pathToBehandlinger = (saksnummer) => buildPath(behandlingerPath, { saksnummer });
export const pathToBehandling = (saksnummer, behandlingId) => buildPath(behandlingPath, { saksnummer, behandlingId });
export const pathToMissingPage = () => '/404';

export const pathToAnnenPart = (saksnummer, behandlingId) => `/${FPSAK}/fagsak/${saksnummer}/behandling/${behandlingId}/?fakta=default&punkt=uttak`;

const emptyQueryString = (queryString) => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

export const getLocationWithQueryParams = (location: Location, queryParams) => ({
  ...location,
  search: updateQueryParams(location.search, queryParams),
});

export const getSupportPanelLocationCreator = (location: Location) => (
  supportPanel,
) => getLocationWithQueryParams(location, { stotte: supportPanel });
export const getProsessStegLocation = (location: Location) => (prosessSteg) => getLocationWithQueryParams(location, { punkt: prosessSteg });
export const getFaktaLocation = (location: Location) => (fakta) => getLocationWithQueryParams(location, { fakta });
export const getRiskPanelLocationCreator = (location: Location) => (
  isRiskPanelOpen,
) => getLocationWithQueryParams(location, { risiko: isRiskPanelOpen });

const DEFAULT_FAKTA = 'default';
const DEFAULT_PROSESS_STEG = 'default';

export const getLocationWithDefaultProsessStegAndFakta = (location: Location) => (
  getLocationWithQueryParams(location, { punkt: DEFAULT_PROSESS_STEG, fakta: DEFAULT_FAKTA })
);

export const getPathToFplos = (href) => {
  const hostAndContextPath = href.substr(0, href.lastIndexOf(FPSAK) + FPSAK.length);
  return hostAndContextPath.replace(new RegExp(FPSAK, 'g'), FPLOS);
};

export const createLocationForSkjermlenke = (behandlingLocation, skjermlenkeCode) => {
  const skjermlenke = skjermlenkeCodes[skjermlenkeCode];
  return getLocationWithQueryParams(behandlingLocation, { punkt: skjermlenke.punktNavn, fakta: skjermlenke.faktaNavn });
};

// Kan gå inn på url som ser sånn ut "http://localhost:9000/fpsak/fagsak/", men
// da vil ein automatisk redirecte til http://localhost:9000/fpsak/fagsak/behandling/*"
export const erUrlUnderBehandling = (location) => !location.pathname.includes('behandling/');

export const erBehandlingValgt = (location) => location.pathname.includes('behandling') && !location.pathname.endsWith('behandling/');
