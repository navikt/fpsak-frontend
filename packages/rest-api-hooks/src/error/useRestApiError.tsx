import { useContext } from 'react';

import { RestApiErrorStateContext } from './RestApiErrorContext';

/**
 * Hook for å hente alle feil fra rest-kall
 */
const useRestApiError = () => {
  const state = useContext(RestApiErrorStateContext);
  return state.errors;
};

export default useRestApiError;
