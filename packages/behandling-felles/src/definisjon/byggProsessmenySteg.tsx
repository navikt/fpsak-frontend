import { createSelector } from 'reselect';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import Behandling from '../types/behandlingTsType';
import Aksjonspunkt from '../types/aksjonspunktTsType';
import Vilkar from '../types/vilkarTsType';
import FagsakInfo from '../types/fagsakInfoTsType';
import NavAnsatt from '../types/navAnsattTsType';

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


const erReadOnly = (behandling, aksjonspunkterForPunkt, vilkarlisteForPunkt, navAnsatt, fagsak, hasFetchError) => {
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);
  const behandlingIsOnHold = behandling.behandlingPaaVent;
  const isBehandlingReadOnly = hasFetchError || (behandling.taskStatus && behandling.taskStatus.readOnly ? behandling.taskStatus.readOnly : false);
  // TODO (TOR) bp-ap og bp-v
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);
  return !rettigheter.writeAccess.isEnabled || behandlingIsOnHold || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar;
};


interface OwnProps {
  alleSteg: [{}];
  valgtProsessSteg?: string;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  vilkar: [Vilkar];
  navAnsatt: NavAnsatt;
  fagsak: FagsakInfo;
  hasFetchError: boolean;
  intl: {};
}

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
