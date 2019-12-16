import { FunctionComponent, useEffect, useRef } from 'react';
import { destroy } from 'redux-form';
import { useDispatch } from 'react-redux';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
}

const ReduxFormStateCleaner: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
}) => {
  const dispatch = useDispatch();
  const ref = useRef<number>();

  useEffect(() => {
    if (ref.current && ref.current !== behandlingVersjon) {
      dispatch(destroy(getBehandlingFormPrefix(behandlingId, ref.current)));
    }
    ref.current = behandlingVersjon;
    return () => {
      dispatch(destroy(getBehandlingFormPrefix(behandlingId, ref.current)));
      dispatch(destroy(getBehandlingFormPrefix(behandlingId, behandlingVersjon)));
    };
  }, [behandlingVersjon]);

  return null;
};

export default ReduxFormStateCleaner;
