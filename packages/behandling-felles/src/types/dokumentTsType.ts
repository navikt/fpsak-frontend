// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Dokument = Readonly<{
  journalpostId: string;
  dokumentId: string;
  tittel?: string;
  tidspunkt?: string;
  kommunikasjonsretning: string;
}>
