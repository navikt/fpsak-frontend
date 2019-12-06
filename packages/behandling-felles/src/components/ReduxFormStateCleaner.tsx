import { FunctionComponent, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
  }, [behandlingVersjon]);

  return null;
};

ReduxFormStateCleaner.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

export default ReduxFormStateCleaner;
