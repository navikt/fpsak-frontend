const behandlingResultatType = {
  IKKE_FASTSATT: 'IKKE_FASTSATT',
  INNVILGET: 'INNVILGET',
  AVSLATT: 'AVSLÅTT',
  OPPHOR: 'OPPHØR',
  HENLAGT_SOKNAD_TRUKKET: 'HENLAGT_SØKNAD_TRUKKET',
  KLAGE_AVVIST: 'KLAGE_AVVIST',
  KLAGE_MEDHOLD: 'KLAGE_MEDHOLD',
  KLAGE_YTELSESVEDTAK_OPPHEVET: 'KLAGE_YTELSESVEDTAK_OPPHEVET',
  KLAGE_YTELSESVEDTAK_STADFESTET: 'KLAGE_YTELSESVEDTAK_STADFESTET',
  HENLAGT_KLAGE_TRUKKET: 'HENLAGT_KLAGE_TRUKKET',
  HENLAGT_INNSYN_TRUKKET: 'HENLAGT_INNSYN_TRUKKET',
  HENLAGT_FEILOPPRETTET: 'HENLAGT_FEILOPPRETTET',
  HENLAGT_BRUKER_DOD: 'HENLAGT_BRUKER_DØD',
  FORELDREPENGER_ENDRET: 'FORELDREPENGER_ENDRET',
  INGEN_ENDRING: 'INGEN_ENDRING',
  MANGLER_BEREGNINGSREGLER: 'MANGLER_BEREGNINGSREGLER',
};

const innvilgetKlageResultatTyper = [behandlingResultatType.KLAGE_MEDHOLD, behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET];

const innvilgetRevurderingFPResultatTyper = [behandlingResultatType.FORELDREPENGER_ENDRET, behandlingResultatType.INGEN_ENDRING];

export const isInnvilget = behandlingResultatTypeKode => innvilgetKlageResultatTyper.includes(behandlingResultatTypeKode)
  || innvilgetRevurderingFPResultatTyper.includes(behandlingResultatTypeKode)
  || behandlingResultatTypeKode === behandlingResultatType.INNVILGET;

export const isAvslag = behandlingResultatTypeKode => behandlingResultatTypeKode === behandlingResultatType.AVSLATT
  || behandlingResultatTypeKode === behandlingResultatType.KLAGE_AVVIST
  || behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET;

export const isOpphor = behandlingResultatTypeKode => behandlingResultatTypeKode === behandlingResultatType.OPPHOR;

export default behandlingResultatType;
