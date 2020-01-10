import React from 'react';

import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import vilkarType, { fodselsvilkarene, adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import FordelBeregningsgrunnlagFaktaIndex from '@fpsak-frontend/fakta-fordel-beregningsgrunnlag';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';
import FodselOgTilretteleggingFaktaIndex from '@fpsak-frontend/fakta-fodsel-og-tilrettelegging';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import OmsorgFaktaIndex from '@fpsak-frontend/fakta-omsorg';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';

import { readOnlyUtils } from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi from '../data/svpBehandlingApi';

const faktaPanelDefinisjoner = [{
  urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
  textCode: 'ArbeidsforholdInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
  endpoints: [svpBehandlingApi.PERSONOPPLYSNINGER, svpBehandlingApi.INNTEKT_ARBEID_YTELSE],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.VERGE,
  textCode: 'RegistrereVergeInfoPanel.Info',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_VERGE],
  endpoints: [svpBehandlingApi.VERGE, svpBehandlingApi.AKSJONSPUNKTER],
  renderComponent: (props) => <VergeFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  aksjonspunkterCodes: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  endpoints: [svpBehandlingApi.SOKNAD, svpBehandlingApi.AKSJONSPUNKTER],
  renderComponent: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.OMSORGSVILKARET,
  textCode: 'OmsorgOgForeldreansvarInfoPanel.Omsorg',
  aksjonspunkterCodes: [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR],
  endpoints: [svpBehandlingApi.FAMILIEHENDELSE, svpBehandlingApi.SOKNAD, svpBehandlingApi.PERSONOPPLYSNINGER,
    svpBehandlingApi.AKSJONSPUNKTER, svpBehandlingApi.INNTEKT_ARBEID_YTELSE],
  renderComponent: (props) => <OmsorgOgForeldreansvarFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.FODSELTILRETTELEGGING,
  textCode: 'FodselOgTilretteleggingInfoPanel.FaktaFodselOgTilrettelegging',
  aksjonspunkterCodes: [aksjonspunktCodes.FODSELTILRETTELEGGING],
  endpoints: [svpBehandlingApi.SVANGERSKAPSPENGER_TILRETTELEGGING],
  renderComponent: (props) => <FodselOgTilretteleggingFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.ADOPSJONSVILKARET,
  textCode: 'AdopsjonInfoPanel.Adopsjon',
  aksjonspunkterCodes: [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
    aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN],
  endpoints: [svpBehandlingApi.SOKNAD, svpBehandlingApi.FAMILIEHENDELSE, svpBehandlingApi.AKSJONSPUNKTER, svpBehandlingApi.PERSONOPPLYSNINGER],
  renderComponent: (props) => <AdopsjonFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => adopsjonsvilkarene.includes(v.vilkarType.kode)),
  getData: () => ({ isForeldrepengerFagsak: false }),
}, {
  urlCode: faktaPanelCodes.FODSELSVILKARET,
  textCode: 'FodselInfoPanel.Fodsel',
  aksjonspunkterCodes: [aksjonspunktCodes.TERMINBEKREFTELSE, aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
    aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT],
  endpoints: [svpBehandlingApi.SOKNAD, svpBehandlingApi.FAMILIEHENDELSE, svpBehandlingApi.PERSONOPPLYSNINGER,
    svpBehandlingApi.AKSJONSPUNKTER, svpBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, svpBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING],
  renderComponent: (props) => <FodselFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => fodselsvilkarene.includes(v.vilkarType.kode)),
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunktCodes.AVKLAR_OPPHOLDSRETT, aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO],
  endpoints: [svpBehandlingApi.PERSONOPPLYSNINGER, svpBehandlingApi.SOKNAD, svpBehandlingApi.AKSJONSPUNKTER,
    svpBehandlingApi.INNTEKT_ARBEID_YTELSE, svpBehandlingApi.MEDLEMSKAP, svpBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getData: ({
    fagsak, behandling, hasFetchError,
  }) => ({
    isForeldrepengerFagsak: false,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyBehandling: hasFetchError || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
  }),
}, {
  urlCode: faktaPanelCodes.OPPTJENINGSVILKARET,
  textCode: 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening',
  aksjonspunkterCodes: [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING],
  endpoints: [svpBehandlingApi.OPPTJENING],
  renderComponent: (props) => <OpptjeningFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET),
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.BEREGNING,
  textCode: 'BeregningInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG],
  endpoints: [svpBehandlingApi.BEREGNINGSGRUNNLAG],
  renderComponent: (props) => <BeregningFaktaIndex {...props} />,
  showComponent: ({ beregningsgrunnlag }) => beregningsgrunnlag,
  getData: ({ rettigheter }) => ({ erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled }),
}, {
  urlCode: faktaPanelCodes.FORDELING,
  textCode: 'FordelBeregningsgrunnlag.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG],
  endpoints: [svpBehandlingApi.BEREGNINGSGRUNNLAG],
  renderComponent: (props) => <FordelBeregningsgrunnlagFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}, {
  urlCode: faktaPanelCodes.OMSORG,
  textCode: 'OmsorgInfoPanel.Omsorg',
  aksjonspunkterCodes: [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG],
  endpoints: [svpBehandlingApi.YTELSEFORDELING, svpBehandlingApi.PERSONOPPLYSNINGER, svpBehandlingApi.SOKNAD],
  renderComponent: (props) => <OmsorgFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => {},
}];

export default faktaPanelDefinisjoner;
