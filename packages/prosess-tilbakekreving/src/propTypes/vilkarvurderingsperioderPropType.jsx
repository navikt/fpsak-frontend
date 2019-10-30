import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vilkarvurderingsperioderPropType = PropTypes.shape({
  perioder: PropTypes.arrayOf(PropTypes.shape({
    feilutbetaling: PropTypes.number.isRequired,
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    foreldet: PropTypes.bool.isRequired,
    hendelseType: kodeverkObjektPropType.isRequired,
    hendelseUndertype: kodeverkObjektPropType,
    oppfyltValg: kodeverkObjektPropType,
    redusertBeloper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    ytelser: PropTypes.arrayOf(PropTypes.shape({
      aktivitet: PropTypes.string.isRequired,
      belop: PropTypes.number.isRequired,
    })).isRequired,
    årsak: PropTypes.shape({
      hendelseType: kodeverkObjektPropType.isRequired,
      hendelseUndertype: kodeverkObjektPropType,
    }).isRequired,
  })).isRequired,
  rettsgebyr: PropTypes.number.isRequired,
});

export default vilkarvurderingsperioderPropType;
