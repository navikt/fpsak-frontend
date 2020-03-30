import React, { FunctionComponent, useState, useCallback } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FagsakInfo, Rettigheter, BehandlingPaVent, SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';
import { Behandling, Aksjonspunkt, KodeverkMedNavn } from '@fpsak-frontend/types';

import SoknadRegistrertModal from './SoknadRegistrertModal';
import RegistrerPapirsoknadPanel from './RegistrerPapirsoknadPanel';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  kodeverk: {[key: string]: KodeverkMedNavn[]};
  rettigheter: Rettigheter;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  lagreAksjonspunkt: (params: {}) => Promise<void>;
  erAksjonspunktLagret: boolean;
}

const getAktivtPapirsoknadApKode = (aksjonspunkter) => aksjonspunkter.filter((a) => a.erAktivt).map((ap) => ap.definisjon.kode)
  .filter((kode) => kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD
      || kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_FORELDREPENGER
      || kode === aksjonspunktCodes.REGISTRER_PAPIR_ENDRINGSØKNAD_FORELDREPENGER
      || kode === aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_SVANGERSKAPSPENGER)[0];

const lagLagreFunksjon = (soknadData, behandling, aksjonspunkter, fagsak, lagreAksjonspunkt) => (valuesForRegisteredFieldsOnly) => {
  const manuellRegistreringDtoList = [{
    '@type': getAktivtPapirsoknadApKode(aksjonspunkter),
    tema: soknadData.getFamilieHendelseType(),
    soknadstype: soknadData.getFagsakYtelseType(),
    soker: soknadData.getForeldreType(),
    ...valuesForRegisteredFieldsOnly,
  },
  ];

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
    bekreftedeAksjonspunktDtoer: manuellRegistreringDtoList,
  };
  return lagreAksjonspunkt(params);
};

/**
 * RegisterPapirsoknad
 *
 * Har ansvar for å sette opp ReduxForm-skjemaet for registrering av papirsøknad for engangsstønad eller foreldrepenger.
 * Komponenten tilpasser skjemaet til valgt søknadstype (engagnsstønad eller foreldrepenger), valgt søknadtema (fødsel, adopsjon eller omsorg)
 * og valgt foreldretype (mor, far/medmor eller tredjepart).
 */
export const RegistrerPapirsoknad: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  kodeverk,
  rettigheter,
  settPaVent,
  hentBehandling,
  lagreAksjonspunkt,
  erAksjonspunktLagret,
}) => {
  const [soknadData, setSoknadData] = useState();
  const readOnly = !rettigheter.writeAccess.isEnabled || behandling.behandlingPaaVent;

  const lagre = lagLagreFunksjon(soknadData, behandling, aksjonspunkter, fagsak, lagreAksjonspunkt);
  const lagreFullstendig = useCallback((_formValues, _dispatch, { valuesForRegisteredFieldsOnly }) => lagre(valuesForRegisteredFieldsOnly), [soknadData]);
  const lagreUfullstendig = useCallback(() => lagre({ ufullstendigSoeknad: true }), [soknadData]);

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
      />
      <SoknadRegistrertModal isOpen={erAksjonspunktLagret} />
      <RegistrerPapirsoknadPanel
        fagsak={fagsak}
        kodeverk={kodeverk}
        readOnly={readOnly}
        setSoknadData={setSoknadData}
        soknadData={soknadData}
        lagreUfullstendig={lagreUfullstendig}
        lagreFullstendig={lagreFullstendig}
      />
    </>
  );
};

export default RegistrerPapirsoknad;
