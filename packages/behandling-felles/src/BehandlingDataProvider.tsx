import React, {
  FunctionComponent, useReducer, ReactNode, useEffect,
} from 'react';
import { Behandling } from '@fpsak-frontend/behandling-felles';

const reducer = (state, action) => {
  switch (action.type) {
    case 'add-all':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
      };
    case 'new-version':
      return {
        version: action.data.versjon,
        previousVersion: state.version,
        data: {
          behandling: action.data,
        },
        previousData: state.data,
      };
    default:
  }
  return null;
};

const initialState = {
  version: undefined,
  previousVersion: undefined,
  data: undefined,
  previousData: undefined,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext(null);

interface OwnProps {
  behandling: Behandling;
  children: ReactNode;
}

const BehandlingDataProvider: FunctionComponent<OwnProps> = ({
  behandling,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'new-version', data: behandling });
  }, [behandling.versjon]);

  if (!state.version) {
    return null;
  }

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export default BehandlingDataProvider;
