import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const behandlingVelgerBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: PropTypes.shape({
    kode: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.shape({
    kode: PropTypes.string.isRequired,
  }).isRequired,
  fagsakId: PropTypes.number.isRequired,
  opprettet: PropTypes.string.isRequired,
  avsluttet: PropTypes.string,
  endret: PropTypes.string,
  behandlendeEnhetId: PropTypes.string.isRequired,
  behandlendeEnhetNavn: PropTypes.string.isRequired,
  erAktivPapirsoknad: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
    rel: PropTypes.string.isRequired,
    requestPayload: PropTypes.any,
    type: PropTypes.string.isRequired,
  })).isRequired,
  gjeldendeVedtak: PropTypes.bool,
  førsteÅrsak: PropTypes.shape({
    behandlingArsakType: kodeverkObjektPropType,
    erAutomatiskRevurdering: PropTypes.bool,
    manueltOpprettet: PropTypes.bool,
  }),
  behandlingsresultat: PropTypes.shape({
    type: kodeverkObjektPropType,
    avslagsarsak: kodeverkObjektPropType,
  }),
});

export default behandlingVelgerBehandlingPropType;
