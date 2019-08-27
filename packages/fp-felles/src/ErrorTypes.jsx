/**
 * Feiltyper til differensiering av framvisning i GUI
 * Skal speile FeilType.java en-til-en
 */

// TODO (TOR) Det er duplikat av denne i rest-api. Fiks!
export const ErrorTypes = {
  MANGLER_TILGANG_FEIL: 'MANGLER_TILGANG_FEIL',
  TOMT_RESULTAT_FEIL: 'TOMT_RESULTAT_FEIL',
  BEHANDLING_ENDRET_FEIL: 'BEHANDLING_ENDRET_FEIL',
  GENERELL_FEIL: 'GENERELL_FEIL',
};

export const getErrorResponseData = (error) => (error && error.response && error.response.data ? error.response.data : error);
export const errorOfType = (error, errorType) => error && (getErrorResponseData(error).type === errorType);
