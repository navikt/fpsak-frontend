import { createSelector } from 'reselect';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import Behandling from '../types/behandlingTsType';
import Aksjonspunkt from '../types/aksjonspunktTsType';
import Vilkar from '../types/vilkarTsType';
import FagsakInfo from '../types/fagsakInfoTsType';
import NavAnsatt from '../types/navAnsattTsType';
import erReadOnly from '../util/erReadOnly';

const SUCCESS = 'success';
const WARNING = 'warning';
const DANGER = 'danger';
const DEFAULT = 'default';

const finnProsessmenyType = (status, harApentAksjonspunkt) => {
  if (harApentAksjonspunkt) {
    return WARNING;
  }
  if (status === vilkarUtfallType.OPPFYLT) {
    return SUCCESS;
  } if (status === vilkarUtfallType.IKKE_OPPFYLT) {
    return DANGER;
  }
  return DEFAULT;
};

interface OwnProps {
  alleSteg: {}[];
  valgtProsessSteg?: string;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  navAnsatt: NavAnsatt;
  fagsak: FagsakInfo;
  hasFetchError: boolean;
  intl: {};
}

// TODO (TOR) skriv om denne
const byggProsessmenySteg = createSelector<OwnProps, any, any>(
  [(ownProps) => ownProps.alleSteg,
    (ownProps) => ownProps.valgtProsessSteg,
    (ownProps) => ownProps.behandling,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.vilkar,
    (ownProps) => ownProps.navAnsatt,
    (ownProps) => ownProps.fagsak,
    (ownProps) => ownProps.hasFetchError,
    (ownProps) => ownProps.intl],
  (alleSteg, valgtStegKode, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl) => {
    const indexTilStegMedApentAksjonspunkt = alleSteg
      .findIndex((steg) => aksjonspunkter.filter((ap) => steg.apCodes.includes(ap.definisjon.kode))
        .some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET));

    const indexTilValgtSteg = alleSteg.findIndex((p) => p.code === valgtStegKode);

    return alleSteg.map((steg, mapIndex) => {
      const harApentAp = indexTilStegMedApentAksjonspunkt === mapIndex;
      const type = finnProsessmenyType(steg.status, harApentAp);

      const apForSteg = aksjonspunkter.filter((a) => steg.apCodes.includes(a.definisjon.kode));
      const vilkarForBp = vilkar.filter((v) => steg.vilkarene.includes(v));
      const isReadOnly = erReadOnly(behandling, apForSteg, vilkarForBp, navAnsatt, fagsak, hasFetchError);
      const isSubmittable = apForSteg.some((ap) => ap.kanLoses) || vilkarUtfallType.OPPFYLT === steg.status;

      const erValgtSteg = indexTilValgtSteg === mapIndex;
      const harApentApOgDefaultStegValgt = valgtStegKode === 'default' && harApentAp;
      const erHenlagtOgSisteSteg = valgtStegKode === 'default' && behandling.behandlingHenlagt && mapIndex === alleSteg.length - 1;
      const erAktiv = erHenlagtOgSisteSteg || erValgtSteg || harApentApOgDefaultStegValgt;

      return {
        kode: steg.code,
        aksjonspunkter: apForSteg,
        isReadOnly,
        isSubmittable,
        erStegBehandlet: steg.status !== vilkarUtfallType.IKKE_VURDERT || harApentAp,
        prosessmenySteg: {
          label: intl.formatMessage({ id: steg.titleCode }),
          isActive: erAktiv,
          isDisabled: false,
          isFinished: type === SUCCESS,
          type,
        },
      };
    });
  },
);

export default byggProsessmenySteg;
