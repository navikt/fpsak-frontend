// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type RequestAdditionalConfig = Readonly<{
  maxPollingLimit?: number;
  fetchLinkDataAutomatically?: boolean;
  linksToFetchAutomatically?: string[];
  addLinkDataToArray?: boolean;
  storeResultKey?: string;
}>
