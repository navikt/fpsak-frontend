import React from 'react';

import UttakProsessIndex from '@fpsak-frontend/prosess-uttak';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import fpBehandlingApi from '../../data/fpBehandlingApi';

const faktaUttakAp = [
  aksjonspunktCodes.AVKLAR_UTTAK,
  aksjonspunktCodes.ANNEN_FORELDER_IKKE_RETT_OG_LØPENDE_VEDTAK,
  aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO,
  aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT,
  aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK,
  aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK,
];

const getStatusFromUttakresultat = (uttaksresultat, aksjonspunkter) => {
  if (!uttaksresultat || aksjonspunkter.some((ap) => faktaUttakAp.includes(ap.definisjon.kode) && ap.status.kode === 'OPPR')) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  if (uttaksresultat.perioderSøker && uttaksresultat.perioderSøker.length > 0) {
    const oppfylt = uttaksresultat.perioderSøker.some((p) => (
      p.periodeResultatType.kode !== periodeResultatType.AVSLATT
    ));
    if (oppfylt) {
      return vilkarUtfallType.OPPFYLT;
    }
  }
  return vilkarUtfallType.IKKE_OPPFYLT;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <UttakProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
    aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER,
    aksjonspunktCodes.TILKNYTTET_STORTINGET,
    aksjonspunktCodes.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD,
    aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
    aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET,
    aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT,
  ]

  getEndepunkter = () => [
    fpBehandlingApi.FAKTA_ARBEIDSFORHOLD,
    fpBehandlingApi.FAMILIEHENDELSE,
    fpBehandlingApi.UTTAK_PERIODE_GRENSE,
  ]

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ uttaksresultatPerioder, aksjonspunkter }) => getStatusFromUttakresultat(uttaksresultatPerioder, aksjonspunkter)

  getData = ({
    fagsak, rettigheter, tempUpdateStonadskontoer, uttaksresultatPerioder, uttakStonadskontoer, soknad, personopplysninger, ytelsefordeling,
  }) => ({
    fagsak,
    tempUpdateStonadskontoer,
    employeeHasAccess: rettigheter.kanOverstyreAccess.isEnabled,
    uttaksresultatPerioder,
    uttakStonadskontoer,
    soknad,
    personopplysninger,
    ytelsefordeling,
  })
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK

  getTekstKode = () => 'Behandlingspunkt.Uttak'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default UttakProsessStegPanelDef;
