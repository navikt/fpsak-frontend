type Dokument = Readonly<{
  journalpostId: string;
  dokumentId: string;
  behandlinger?: number[];
  tittel?: string;
  tidspunkt?: string;
  kommunikasjonsretning: string;
  gjelderFor?: string;
}>

export default Dokument;
