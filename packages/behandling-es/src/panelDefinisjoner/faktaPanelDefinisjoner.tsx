import React from 'react';

import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import { fodselsvilkarene, adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';

import { readOnlyUtils } from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../data/esBehandlingApi';

const faktaPanelDefinisjoner = [{
  urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
  textCode: 'ArbeidsforholdInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
  endpoints: [esBehandlingApi.PERSONOPPLYSNINGER, esBehandlingApi.INNTEKT_ARBEID_YTELSE],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.VERGE,
  textCode: 'RegistrereVergeInfoPanel.Info',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_VERGE],
  endpoints: [esBehandlingApi.VERGE, esBehandlingApi.AKSJONSPUNKTER],
  renderComponent: (props) => <VergeFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  aksjonspunkterCodes: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  endpoints: [esBehandlingApi.SOKNAD, esBehandlingApi.AKSJONSPUNKTER],
  renderComponent: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.OMSORGSVILKARET,
  textCode: 'OmsorgOgForeldreansvarInfoPanel.Omsorg',
  aksjonspunkterCodes: [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR],
  endpoints: [esBehandlingApi.FAMILIEHENDELSE, esBehandlingApi.SOKNAD, esBehandlingApi.PERSONOPPLYSNINGER,
    esBehandlingApi.AKSJONSPUNKTER, esBehandlingApi.INNTEKT_ARBEID_YTELSE],
  renderComponent: (props) => <OmsorgOgForeldreansvarFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.ADOPSJONSVILKARET,
  textCode: 'AdopsjonInfoPanel.Adopsjon',
  aksjonspunkterCodes: [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
    aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN],
  endpoints: [esBehandlingApi.SOKNAD, esBehandlingApi.FAMILIEHENDELSE, esBehandlingApi.AKSJONSPUNKTER, esBehandlingApi.PERSONOPPLYSNINGER],
  renderComponent: (props) => <AdopsjonFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => adopsjonsvilkarene.includes(v.vilkarType.kode)),
  getData: () => ({ isForeldrepengerFagsak: false }),
}, {
  urlCode: faktaPanelCodes.FODSELSVILKARET,
  textCode: 'FodselInfoPanel.Fodsel',
  aksjonspunkterCodes: [aksjonspunktCodes.TERMINBEKREFTELSE, aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
    aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT],
  endpoints: [esBehandlingApi.SOKNAD, esBehandlingApi.FAMILIEHENDELSE, esBehandlingApi.PERSONOPPLYSNINGER,
    esBehandlingApi.AKSJONSPUNKTER, esBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, esBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING],
  renderComponent: (props) => <FodselFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => fodselsvilkarene.includes(v.vilkarType.kode)),
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunktCodes.AVKLAR_OPPHOLDSRETT, aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO],
  endpoints: [esBehandlingApi.PERSONOPPLYSNINGER, esBehandlingApi.SOKNAD, esBehandlingApi.AKSJONSPUNKTER,
    esBehandlingApi.INNTEKT_ARBEID_YTELSE, esBehandlingApi.MEDLEMSKAP, esBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getData: ({
    fagsak, behandling, hasFetchError,
  }) => ({
    isForeldrepengerFagsak: false,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyBehandling: hasFetchError || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
  }),
}];

export default faktaPanelDefinisjoner;
