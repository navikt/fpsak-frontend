import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../../data/fpBehandlingApi';

const harPeriodeMedUtbetaling = (perioder) => {
  const periode = perioder.find((p) => p.dagsats > 0);
  return !!periode;
};

const getStatusFromResultatstruktur = (resultatstruktur, uttaksresultat) => {
  if (resultatstruktur && resultatstruktur.perioder.length > 0) {
    if (!harPeriodeMedUtbetaling(resultatstruktur.perioder)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    if (uttaksresultat && uttaksresultat.perioderSøker.length > 0) {
      const oppfylt = uttaksresultat.perioderSøker.some((p) => (
        p.periodeResultatType.kode !== periodeResultatType.AVSLATT
      ));
      if (oppfylt) {
        return vilkarUtfallType.OPPFYLT;
      }
    }
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = (props) => <TilkjentYtelseProsessIndex {...props} />

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_TILBAKETREKK,
  ]

  getEndepunkter = () => [
    fpBehandlingApi.FAMILIEHENDELSE,
  ]

  getOverstyrVisningAvKomponent = () => true

  getOverstyrtStatus = ({ beregningresultatForeldrepenger, uttaksresultatPerioder }) => getStatusFromResultatstruktur(
    beregningresultatForeldrepenger, uttaksresultatPerioder,
  )

  getData = ({
    fagsak, beregningresultatForeldrepenger, personopplysninger, soknad,
  }) => ({
    fagsak,
    personopplysninger,
    soknad,
    beregningresultat: beregningresultatForeldrepenger,
  })
}

class TilkjentYtelseProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.TILKJENT_YTELSE

  getTekstKode = () => 'Behandlingspunkt.TilkjentYtelse'

  getPanelDefinisjoner = () => [new PanelDef()]
}

export default TilkjentYtelseProsessStegPanelDef;
