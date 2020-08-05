import { usePrevious } from '@fpsak-frontend/shared-components';

const useBehandlingEndret = (behandlingId, behandlingVersjon) => {
  const erBehandlingIdEndretFraUndefined = !usePrevious(behandlingId) && !!behandlingId;
  const erBehandlingVersjonEndretFraUndefined = !usePrevious(behandlingVersjon) && !!behandlingVersjon;
  return erBehandlingIdEndretFraUndefined || erBehandlingVersjonEndretFraUndefined;
};

export default useBehandlingEndret;
