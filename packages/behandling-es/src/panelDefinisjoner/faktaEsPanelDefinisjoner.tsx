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
  endpoints: [],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
}, {
  urlCode: faktaPanelCodes.VERGE,
  textCode: 'RegistrereVergeInfoPanel.Info',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_VERGE],
  endpoints: [esBehandlingApi.VERGE],
  renderComponent: (props) => <VergeFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => ({}),
}, {
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  aksjonspunkterCodes: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  endpoints: [],
  renderComponent: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ soknad }) => ({ soknad }),
}, {
  urlCode: faktaPanelCodes.OMSORGSVILKARET,
  textCode: 'OmsorgOgForeldreansvarInfoPanel.Omsorg',
  aksjonspunkterCodes: [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR],
  endpoints: [esBehandlingApi.FAMILIEHENDELSE],
  renderComponent: (props) => <OmsorgOgForeldreansvarFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({
    personopplysninger, inntektArbeidYtelse, soknad,
  }) => ({
    personopplysninger, inntektArbeidYtelse, soknad,
  }),
}, {
  urlCode: faktaPanelCodes.ADOPSJONSVILKARET,
  textCode: 'AdopsjonInfoPanel.Adopsjon',
  aksjonspunkterCodes: [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
    aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN],
  endpoints: [esBehandlingApi.FAMILIEHENDELSE],
  renderComponent: (props) => <AdopsjonFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => adopsjonsvilkarene.includes(v.vilkarType.kode)),
  getData: ({ personopplysninger, soknad }) => ({
    isForeldrepengerFagsak: false, personopplysninger, soknad,
  }),
}, {
  urlCode: faktaPanelCodes.FODSELSVILKARET,
  textCode: 'FodselInfoPanel.Fodsel',
  aksjonspunkterCodes: [aksjonspunktCodes.TERMINBEKREFTELSE, aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
    aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT],
  endpoints: [esBehandlingApi.FAMILIEHENDELSE, esBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, esBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING],
  renderComponent: (props) => <FodselFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => fodselsvilkarene.includes(v.vilkarType.kode)),
  getData: ({ personopplysninger, soknad }) => ({ personopplysninger, soknad }),
}, {
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunktCodes.AVKLAR_OPPHOLDSRETT, aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO],
  endpoints: [esBehandlingApi.MEDLEMSKAP, esBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getData: ({
    fagsak, behandling, hasFetchError, personopplysninger, soknad, inntektArbeidYtelse,
  }) => ({
    isForeldrepengerFagsak: false,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyBehandling: hasFetchError || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
    personopplysninger,
    soknad,
    inntektArbeidYtelse,
  }),
}];

export default faktaPanelDefinisjoner;
