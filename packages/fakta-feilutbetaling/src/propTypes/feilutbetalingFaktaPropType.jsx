import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const feilutbetalingFaktaPropType = PropTypes.shape({
  behandlingFakta: PropTypes.shape({
    perioder: PropTypes.arrayOf(PropTypes.shape({
      fom: PropTypes.string.isRequired,
      tom: PropTypes.string.isRequired,
      belop: PropTypes.number.isRequired,
    })),
    totalPeriodeFom: PropTypes.string.isRequired,
    totalPeriodeTom: PropTypes.string.isRequired,
    aktuellFeilUtbetaltBeløp: PropTypes.number.isRequired,
    tidligereVarseltBeløp: PropTypes.number.isRequired,
    behandlingÅrsaker: PropTypes.arrayOf(PropTypes.shape({
      behandlingArsakType: kodeverkObjektPropType.isRequired,
    })),
    behandlingsresultat: PropTypes.shape({
      type: kodeverkObjektPropType.isRequired,
      konsekvenserForYtelsen: PropTypes.arrayOf(kodeverkObjektPropType.isRequired).isRequired,
    }),
    tilbakekrevingValg: PropTypes.shape({
      videreBehandling: kodeverkObjektPropType.isRequired,
    }),
    datoForRevurderingsvedtak: PropTypes.string.isRequired,
  }),
});

export default feilutbetalingFaktaPropType;
