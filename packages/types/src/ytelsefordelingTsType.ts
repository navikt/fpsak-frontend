type Ytelsefordeling = Readonly<{
  ikkeOmsorgPerioder?: {
    periodeFom: string;
    periodeTom: string;
  };
  aleneOmsorgPerioder?: {
    periodeFom: string;
    periodeTom: string;
  };
  annenforelderHarRettDto: {
    annenforelderHarRett?: boolean;
    begrunnelse?: string;
    annenforelderHarRettPerioder?: {
      periodeFom: string;
      periodeTom: string;
    };
  };
  endringsdato: string;
  gjeldendeDekningsgrad: number;
  førsteUttaksdato: string;
}>

export default Ytelsefordeling;
