import React, {
  createContext, useReducer, FunctionComponent, ReactNode,
} from 'react';

const defaultInitialState = {
  errors: [],
};

type Action = {type: 'add', data: any } | {type: 'remove'}
type Dispatch = (action: Action) => void
type State = {errors: any[]}

export const RestApiErrorStateContext = createContext<State>(defaultInitialState);
export const RestApiErrorDispatchContext = createContext<Dispatch | undefined>(undefined);

interface OwnProps {
  children: ReactNode;
  initialState?: State;
}

/**
 * State for å lagre feil oppstår ved rest-kall
 */
export const RestApiErrorProvider: FunctionComponent<OwnProps> = ({
  children,
  initialState,
}): JSX.Element => {
  const [state, dispatch] = useReducer((oldState, action) => {
    switch (action.type) {
      case 'add':
        return {
          errors: oldState.errors.concat(action.data),
        };
      case 'remove':
        return defaultInitialState;
      default:
        throw new Error();
    }
  }, initialState || defaultInitialState);

  return (
    <RestApiErrorStateContext.Provider value={state}>
      <RestApiErrorDispatchContext.Provider value={dispatch}>
        {children}
      </RestApiErrorDispatchContext.Provider>
    </RestApiErrorStateContext.Provider>
  );
};
