import { useContext, useCallback } from 'react';

import { RestApiErrorDispatchContext } from './RestApiErrorContext';

/**
 * Hook for å legge til eller fjerne feil fra rest-kall
 */
const useRestApiErrorDispatcher = () => {
  const dispatch = useContext(RestApiErrorDispatchContext);

  const addErrorMessage = useCallback((data) => dispatch({ type: 'add', data }), []);
  const removeErrorMessage = useCallback(() => dispatch({ type: 'remove' }), []);

  return {
    addErrorMessage,
    removeErrorMessage,
  };
};

export default useRestApiErrorDispatcher;
