type Dokument = Readonly<{
  journalpostId: string;
  dokumentId: string;
  tittel?: string;
  tidspunkt?: string;
  kommunikasjonsretning: string;
}>

export default Dokument;
