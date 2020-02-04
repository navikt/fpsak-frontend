import React, { FunctionComponent, useCallback } from 'react';

import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import {
  Behandling, Aksjonspunkt, Kodeverk, InntektArbeidYtelse, Personopplysninger,
} from '@fpsak-frontend/types';

import FagsakInfo from '../types/fagsakInfoTsType';

// TODO (TOR) Fjern denne når nytt visittkort er på plass

interface OwnProps {
  behandling: Behandling;
  personopplysninger: Personopplysninger;
  inntektArbeidYtelse: InntektArbeidYtelse;
  fagsak: FagsakInfo;
  aksjonspunkter?: Aksjonspunkt[];
  featureToggleUtland: boolean;
  alleKodeverk: {[key: string]: Kodeverk[]};
  dispatch: (data: any) => Promise<any>;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  behandlingApi: {[name: string]: EndpointOperations};
}

const getBekreftAksjonspunktCallback = (dispatch, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, api) => (aksjonspunkter) => {
  const model = aksjonspunkter.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
  };

  if (model && aksjonspunktCodes.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE === model[0].kode) {
    return dispatch(api.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()({
      ...params,
      overstyrteAksjonspunktDtoer: model,
    }, { keepData: true })).then(() => oppdaterProsessStegOgFaktaPanelIUrl('default', 'default'));
  }

  return dispatch(api.SAVE_AKSJONSPUNKT.makeRestApiRequest()({
    ...params,
    bekreftedeAksjonspunktDtoer: model,
  }, { keepData: true })).then(() => oppdaterProsessStegOgFaktaPanelIUrl('default', 'default'));
};

const TempPersonPanel: FunctionComponent<OwnProps> = ({
  behandling,
  personopplysninger,
  inntektArbeidYtelse,
  fagsak,
  aksjonspunkter,
  featureToggleUtland,
  alleKodeverk,
  dispatch,
  behandlingApi,
  oppdaterProsessStegOgFaktaPanelIUrl,
}) => {
  const bekreftAksjonspunktCallback = useCallback(getBekreftAksjonspunktCallback(dispatch, fagsak, behandling,
    oppdaterProsessStegOgFaktaPanelIUrl, behandlingApi),
  [behandling.versjon]);

  return (
    <PersonFaktaIndex
      behandling={behandling}
      fagsakPerson={fagsak.fagsakPerson}
      aksjonspunkter={aksjonspunkter}
      personopplysninger={personopplysninger}
      inntektArbeidYtelse={inntektArbeidYtelse}
      submitCallback={bekreftAksjonspunktCallback}
      readOnly={false}
      featureToggleUtland={featureToggleUtland}
      alleKodeverk={alleKodeverk}
    />
  );
};

export default TempPersonPanel;
