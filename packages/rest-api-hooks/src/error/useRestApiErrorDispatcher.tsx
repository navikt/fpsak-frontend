import { useContext, useCallback } from 'react';

import { RestApiErrorDispatchContext } from './RestApiErrorContext';

/**
 * Hook for å legge til eller fjerne feil fra rest-kall
 */
const useRestApiErrorDispatcher = () => {
  const dispatch = useContext(RestApiErrorDispatchContext);

  const addErrorMessage = useCallback((data) => dispatch({ type: 'add', data }), []);
  const removeErrorMessages = useCallback(() => dispatch({ type: 'remove' }), []);

  return {
    addErrorMessage,
    removeErrorMessages,
  };
};

export default useRestApiErrorDispatcher;
