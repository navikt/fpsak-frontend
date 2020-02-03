type NavAnsatt = Readonly<{
  brukernavn: string;
  kanBehandleKode6: boolean;
  kanBehandleKode7: boolean;
  kanBehandleKodeEgenAnsatt: boolean;
  kanBeslutte: boolean;
  kanOverstyre: boolean;
  kanSaksbehandle: boolean;
  kanVeilede: boolean;
  navn: string;
  funksjonellTid?: string;
}>

export default NavAnsatt;
