// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Person = Readonly<{
  navn: string;
  alder: number;
  personnummer: string;
  erKvinne: boolean;
  diskresjonskode?: string;
  dodsdato?: string;
}>
