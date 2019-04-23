import { formatQueryString, parseQueryString } from 'utils/urlUtils';
import { Location } from './locationTsType';

export const AVDELINGSLEDER_PATH = 'avdelingsleder';

const emptyQueryString = queryString => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
  const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
  return formatQueryString({
    ...prevParams,
    ...nextParams,
  });
};

const getLocationWithQueryParams = (location, queryParams) => ({ ...location, search: updateQueryParams(location.search, queryParams) });

export const getAvdelingslederPanelLocationCreator = (location: Location) => (avdelingslederPanel: string) => getLocationWithQueryParams(
  location, { fane: avdelingslederPanel },
);

export const getFpsakHref = (fpsakUrl: string, saksnummer: number, behandlingId?: number) => (behandlingId
  ? `${fpsakUrl}/fagsak/${saksnummer}/behandling/${behandlingId}/?punkt=default&fakta=default` : `${fpsakUrl}/fagsak/${saksnummer}/`);
