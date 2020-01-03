import React, {
  FunctionComponent, useMemo, useCallback,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import { fodselsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  FagsakInfo, Behandling, Aksjonspunkt, Vilkar, FaktaPanel, Kodeverk, NavAnsatt, DataFetcherBehandlingDataV2,
  Soknad, Personopplysninger, InntektArbeidYtelse, getAlleMerknaderFraBeslutter, erReadOnly,
} from '@fpsak-frontend/behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import esBehandlingApi from '../data/esBehandlingApi';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  soknad: Soknad;
  personopplysninger: Personopplysninger;
  inntektArbeidYtelse: InntektArbeidYtelse;
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  hasFetchError: boolean;
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  valgtFaktaSteg?: string;
}

const paneler = [{
  textCode: 'ArbeidsforholdInfoPanel.Title',
  urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
  endpoints: [],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getExtraData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
}, {
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
  aksjonspunkterCodes: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  endpoints: [],
  renderComponent: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  showComponent: () => false,
  getExtraData: ({ soknad }) => ({ soknad }),
}, {
  textCode: 'FodselInfoPanel.Fodsel',
  urlCode: faktaPanelCodes.FODSELSVILKARET,
  aksjonspunkterCodes: [aksjonspunktCodes.TERMINBEKREFTELSE, aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
    aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT],
  endpoints: [esBehandlingApi.FAMILIEHENDELSE, esBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, esBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING],
  renderComponent: (props) => <FodselFaktaIndex {...props} />,
  showComponent: ({ vilkarListe }) => vilkarListe.some((vilkar) => fodselsvilkarene.includes(vilkar.vilkarType.kode)),
  getExtraData: ({ personopplysninger, soknad }) => ({ personopplysninger, soknad }),
}, {
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunktCodes.AVKLAR_OPPHOLDSRETT, aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO],
  endpoints: [esBehandlingApi.MEDLEMSKAP, esBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getExtraData: ({
    fagsak, personopplysninger, inntektArbeidYtelse, soknad,
  }) => ({
    isForeldrepengerFagsak: fagsak.fagsakYtelseType.kode === fagsakYtelseType.FORELDREPENGER,
    fagsakPerson: fagsak.fagsakPerson,
    personopplysninger,
    inntektArbeidYtelse,
    soknad,
  }),
}];


const utledFaktaPanelInfo = (fagsak, behandling, navAnsatt, soknad, aksjonspunkter, vilkarListe, personopplysninger, inntektArbeidYtelse, hasFetchError) => {
  const data = {
    fagsak, soknad, vilkarListe, personopplysninger, inntektArbeidYtelse,
  };
  const apCodes = aksjonspunkter.map((ap) => ap.definisjon.kode);
  return paneler
    .filter((panel) => panel.aksjonspunkterCodes.some((a) => apCodes.includes(a)) || panel.showComponent(data))
    .map((panel) => {
      const filtrerteAksjonspunkter = aksjonspunkter.filter((ap) => panel.aksjonspunkterCodes.includes(ap.definisjon.kode));
      return {
        textCode: panel.textCode,
        endpoints: panel.endpoints,
        renderComponent: panel.renderComponent,
        urlCode: panel.urlCode,
        aksjonspunkter: filtrerteAksjonspunkter,
        readOnly: erReadOnly(behandling, filtrerteAksjonspunkter, [], navAnsatt, fagsak, hasFetchError),
        submittable: !filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) || filtrerteAksjonspunkter.some((ap) => ap.kanLoses),
        harApneAksjonspunkter: filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses),
        extraData: panel.getExtraData(data),
      };
    });
};

const utledValgtPanel = (info, valgtFaktaSteg) => {
  if (valgtFaktaSteg === 'default') {
    const index = info.findIndex((i) => i.hasApneAksjonspunkter);
    return index !== -1 ? info[index] : info[0];
  }
  return info.find((i) => i.urlCode === valgtFaktaSteg);
};

const getBekreftFaktaCallback = (dispatch, fagsak, behandling, oppdaterFaktaPanelIUrl) => (aksjonspunkter) => {
  const model = aksjonspunkter.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
    bekreftedeAksjonspunktDtoer: model,
  };

  return dispatch(esBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }))
    .then(() => oppdaterFaktaPanelIUrl('default'));
};

const EngangsstonadFakta: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  soknad,
  personopplysninger,
  navAnsatt,
  inntektArbeidYtelse,
  kodeverk,
  oppdaterFaktaPanelIUrl,
  valgtFaktaSteg,
  hasFetchError,
}) => {
  const intl = useIntl();

  const faktaPanelInfo = useMemo(() => utledFaktaPanelInfo(fagsak, behandling, navAnsatt, soknad, aksjonspunkter, vilkar, personopplysninger,
    inntektArbeidYtelse, hasFetchError),
  [behandling.versjon]);

  const alleMerknaderFraBeslutter = useMemo(() => getAlleMerknaderFraBeslutter(behandling, aksjonspunkter), [behandling.versjon]);
  const valgtPanel = utledValgtPanel(faktaPanelInfo, valgtFaktaSteg);

  const valgFaktaPanelCallback = useCallback((index) => oppdaterFaktaPanelIUrl(faktaPanelInfo[index].urlCode), [faktaPanelInfo]);

  const dispatch = useDispatch();
  const bekreftCallback = useCallback(getBekreftFaktaCallback(dispatch, fagsak, behandling, oppdaterFaktaPanelIUrl), [behandling.versjon]);

  const faktaPaneler = useMemo(() => faktaPanelInfo.map((fpi) => ({
    tekst: intl.formatMessage({ id: fpi.textCode }),
    erAktiv: fpi.textCode === valgtPanel.textCode,
    harAksjonspunkt: fpi.harApneAksjonspunkter,
  })), [behandling.versjon, valgtPanel.textCode]);

  return (
    <FaktaPanel paneler={faktaPaneler} onClick={valgFaktaPanelCallback}>
      <DataFetcherBehandlingDataV2
        key={valgtPanel.textCode}
        behandlingVersion={behandling.versjon}
        endpoints={valgtPanel.endpoints}
        render={(dataProps) => valgtPanel.renderComponent({
          ...dataProps,
          aksjonspunkter: valgtPanel.aksjonspunkter,
          harApneAksjonspunkter: valgtPanel.harApneAksjonspunkter,
          submitCallback: bekreftCallback,
          readOnly: valgtPanel.readOnly,
          submittable: valgtPanel.submittable,
          alleKodeverk: kodeverk,
          alleMerknaderFraBeslutter,
          ...valgtPanel.extraData,
        })}
      />
    </FaktaPanel>
  );
};

export default EngangsstonadFakta;
